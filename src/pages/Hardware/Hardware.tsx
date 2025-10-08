import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TableTemplate from "../../components/tables/Tables/TableTemplate";
import Button from "../../components/ui/button/Button";
import { Add, Reset, Scan, Upload } from "../../icons";
import Modals from "../UiElements/Modals";
import * as signalR from "@microsoft/signalr";
import ActionElement from "../UiElements/ActionElement";
import DangerModal from "../UiElements/DangerModal";
import {  HARDWARE_TABLE_HEADER, HARDWARE_TABLE_KEY, HttpMethod, HubEndPoint, ID_REPORT_KEY, ID_REPORT_TABLE_HEADER, IdReportEndPoint, ModalDetail, PopUpMsg, POST_ADD_SCP, POST_REMOVE_SCP, POST_RESET_SCP, POST_UPCONFIG_SCP, ScpEndPoint } from "../../constants/constant";
import { AddScpDto,  HardwareProps, IdReport, ResetScpDto, ScpDto, StatusDto } from "../../constants/types";
import SelectDeviceForm from "../../components/form/form-elements/SelectDeviceForm";
import LoadingModals from "../UiElements/LoadingModals";
import HttpRequest from "../../utility/HttpRequest";
import Helper from "../../utility/Helper";
import { usePopupActions } from "../../utility/PopupCalling";
import AddHardwareForm from "../../modals/AddHardwareForm";
import Logger from "../../utility/Logger";

// Get Global Variable

const server = import.meta.env.VITE_SERVER_IP;
let removeTarget: ResetScpDto = {
  ScpMac:""
};
let resetTarget:ResetScpDto = {
  ScpMac:""
}

const Hardware: React.FC<PropsWithChildren<HardwareProps>> = ({ onUploadClick }) => {
  const { showPopup } = usePopupActions();
  const [refresh, setRefresh] = useState(false);
  const toggleRefresh = () => setRefresh(!refresh);

  let ScanTableTemplate: ReactNode;


  {/* Modal Handler */ }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false);
  const [isModalSelectDeviceOpen, setIsModalSelectDeviceOpen] = useState<boolean>(false);
  const [isModalAddDetailOpen, setIsModalAddDetailOpen] = useState<boolean>(false);
  const [isRemoveClick, SetIsRemoveClick] = useState<boolean>(false);
  const [isReseting,setIsReseting] = useState<boolean>(false);
  const [isSendingCommand,setIsSendingCommand] = useState<boolean>(false); 

  // Upload Modal
  const [isUploading,setIsUploading] = useState<boolean>(false);
  const [uploadMessage,setUploadMessage] = useState<string>("");
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseAddModal = () => setIsModalAddOpen(false);
  const handleCloseAddDetailModal = () => setIsModalAddDetailOpen(false);
  const handleCloseSelectDevice = () => setIsModalSelectDeviceOpen(false);


  {/* IdReport */ }
  const [idReportList, setIdReportList] = useState<IdReport[]>([]);
  const handleAddIdReport = async (data: IdReport) => {
    setAddScp({
      componentNo: data.scpID,
      name: "",
      model: data.model,
      mac: data.macAddress,
      serialNumber: data.serialNumber.toString(),
      port:0,
      ip:data.ip
    });
    console.log(data);
    setIsModalOpen(false);
    setIsModalAddOpen(true);
  }
  const fetchIdReport = async () => {
    const res = await HttpRequest.send(HttpMethod.GET,IdReportEndPoint.GET_ID_REPORT_LIST)
    Logger.info(res);
    console.log(res);
    if(res && res.data.data){
      setIdReportList(res.data.data);
    }
  }

  ScanTableTemplate = <TableTemplate<IdReport> checkbox={false} tableDatas={idReportList} tableHeaders={ID_REPORT_TABLE_HEADER} tableKeys={ID_REPORT_KEY} status={false} action={true} actionElement={(row) => (
    <Button onClick={() => handleAddIdReport(row)} size="sm" variant="primary">
      Add
    </Button>
  )} />


  {/* Hardware Data */ }
  const [addScp, setAddScp] = useState<AddScpDto>({
    componentNo: 0,
    name: "",
    model: "",
    mac: "",
    ip: "",
    port: 0,
    serialNumber: ""
  })
  const [notifying, setNotifying] = useState(true);
  const [tableDatas, setTableDatas] = useState<ScpDto[]>([]);
  const [status, setStatus] = useState<StatusDto[]>([]);
  const fetchData = async () => {
    const res = await HttpRequest.send(HttpMethod.GET,ScpEndPoint.GET_SCP_LIST);
    Logger.info(res);
    if(res && res.data.data){
        setTableDatas(res.data.data);

      // Batch set state
      const newStatuses = res.data.data.map((a: ScpDto) => ({
        scpMac: a.mac,
        deviceNumber: a.componentNo,
        status: -1
      }));

      console.log(newStatuses);

      setStatus((prev) => [...prev, ...newStatuses]);
      console.log("#####")
      console.log(res.data.data)
      // Fetch status for each
      res.data.data.forEach((a: ScpDto) => {
        fetchStatus(a.mac,a.componentNo);
      });
    }

  }
  const fetchStatus = async (mac: string,id:number) => {
    const res = await HttpRequest.send(HttpMethod.GET,ScpEndPoint.GET_SCP_STATUS + mac+"/"+id)
    Logger.info(res)
    if(res){
            setStatus((prev) => prev.map((a) =>
        a.scpMac == res.data.data["mac"]
          ? {
            ...a,
            status: res.data.data["status"],
          }
          : {
            // scpIp:ScpIp,
            // cpNumber:first,
            // status:status[0]
            ...a
          }
      )
      );
    }
  }

  const resetDevice = async (ScpMac: string) => {
    const res = await HttpRequest.send(HttpMethod.POST,ScpEndPoint.POST_SCP_RESET+ScpMac)
    Helper.handlePopup(res,PopUpMsg.RESET_SCP,showPopup)
    if(res){
      if(res.data.code == 200) setIsReseting(true);
    }
  }

    const uploadConfig = async (ScpMac: string) => {
    const res = await HttpRequest.send(HttpMethod.POST,ScpEndPoint.POST_SCP_UPLOAD+ScpMac)
    Helper.handlePopup(res,PopUpMsg.RESET_SCP,showPopup)
    if(res){
      if(res.data.code == 200) setIsUploading(true);
    }

  }

  const removeScp = async (data: ResetScpDto) => {
    setIsSendingCommand(true);
    const res = await HttpRequest.send(HttpMethod.DELETE,ScpEndPoint.DELETE_SCP+data.ScpMac);
    Helper.handlePopup(res,PopUpMsg.DELETE_SCP,showPopup);
    setIsSendingCommand(false);
    toggleRefresh();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddScp((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async () => {
    const res = await HttpRequest.send(HttpMethod.POST,ScpEndPoint.POST_ADD_SCP,addScp)
          setIsSendingCommand(true);
      setIsModalAddOpen(false);
    Helper.handlePopup(res,PopUpMsg.POST_ADD_SCP,showPopup)
    if(res){
        setIsSendingCommand(false);
        toggleRefresh()
    }
  }

  {/* Handle Action Table*/ }
  const handleOnEditClick = (data: ScpDto) => {
    console.log(data);
    setAddScp({
      componentNo: data.componentNo,
      name: data.name,
      model: data.model,
      mac: data.mac,
      ip: data.ip,
      serialNumber: data.serialNumber,
      port:0
    })
    setIsModalAddDetailOpen(true);
  }
  const handleOnRemoveClick = (data: ScpDto) => {
    removeTarget = {ScpMac: data.mac};
    SetIsRemoveClick(true);
  }
  {/* Handle Click */ }
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.name);
    switch (e.currentTarget.name) {
      case "add":
        setIsModalSelectDeviceOpen(true);
        break;
      case "scan":
        setIsModalOpen(true);
        fetchIdReport();
        break;
      case "reset":
        if (selectedObjects.length != 0) {
          selectedObjects.map((a: ScpDto) => {
            resetDevice(a.mac);
          })
          onUploadClick();
        } else {
          alert("No selected object")
        }
        break;
      case "detail":
        setIsModalAddDetailOpen(true);
        break;
      case "upload":
        if (selectedObjects.length != 0) {
          selectedObjects.map((a: ScpDto) => {
            uploadConfig(a.mac);
          })
          onUploadClick();
        } else {
          alert("No selected object")
        }
        break;
      default:
        break;
    }
  }

  const handleOnClickCloseRemove = () => {
    SetIsRemoveClick(false);

  }
  const handleOnClickConfirmRemove = () => {
    removeScp(removeTarget);
    SetIsRemoveClick(false);
    
  }

  {/* checkBox */ }
  const [selectedObjects, setSelectedObjects] = useState<ScpDto[]>([]);
  const handleCheckedAll = (data: ScpDto[], e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(data)
    console.log(e.target.checked)
    if (setSelectedObjects) {
      if (e.target.checked) {
        setSelectedObjects(data);
      } else {
        setSelectedObjects([]);
      }
    }
  }

  const handleChecked = (data: ScpDto, e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(data)
    console.log(e.target.checked)
    if (setSelectedObjects) {
      if (e.target.checked) {
        setSelectedObjects((prev) => [...prev, data]);
      } else {
        setSelectedObjects((prev) =>
          prev.filter((item) => item.no !== data.no)
        );
      }
    }
  }

  {/* UseEffect */ }
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(server + HubEndPoint.AERO_HUB)
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Connected to SignalR event hub");
    });
    connection.on("CommStatus", (ScpMac: string,CommStatus:number) => {
      console.log(ScpMac);
      console.log(CommStatus);
      //fetchStatus(ScpMac);
      if(resetTarget.ScpMac == ScpMac && CommStatus == 2){
          setIsReseting(false);
      }
      
    });
        connection.on("SyncStatus", () => {
      toggleRefresh();
    });
            connection.on("UploadStatus", (message:string,isFinish:boolean) => {
      setUploadMessage(message);
      console.log(message);
      console.log(isFinish)
      if(isFinish){
        setTimeout(()=>{
          setIsUploading(false);
        },500)
        
      }
      connection.on("UploadFinish",() => {
        setIsUploading(false);
      })
    });
    connection.on("IdReport",(IdReports:IdReport[])=>{
      setIdReportList(IdReports);
    })
    //connection.on
    fetchIdReport();
    fetchData();
    return () => {
      connection.stop();
    };
  }, [refresh]);


  return (
    <>

      {isRemoveClick &&
        <DangerModal header={ModalDetail.REMOVE_HARDWARE.header} body={ModalDetail.REMOVE_HARDWARE.body} onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />
      }
      {isModalSelectDeviceOpen &&
        <Modals header="Hardware Select" body={<SelectDeviceForm />} closeToggle={handleCloseSelectDevice} />
      }
      {isModalOpen &&
        <Modals header="Host List" body={ScanTableTemplate} closeToggle={handleCloseModal} />
      }
      {isModalAddOpen &&
        <Modals header="Add Hardware" body={<AddHardwareForm handleSubmit={handleSubmit} handleChange={handleChange} data={addScp} isDetail={false} />} closeToggle={handleCloseAddModal} />
      }
      {isModalAddDetailOpen &&
        <Modals header="Add Hosts" body={<AddHardwareForm handleSubmit={handleSubmit} handleChange={handleChange} data={addScp} isDetail={true} />} closeToggle={handleCloseAddDetailModal} />
      }
      {isSendingCommand &&
        <LoadingModals isReset={false} header="Processing..."/>
      }
      {isReseting && 
        <LoadingModals isReset={true} header="Reseting..."/>
      }

      {isUploading && 
      <LoadingModals isReset={false} header="Uploading Please wait" body={uploadMessage}/>
      }
      
      <PageBreadcrumb pageTitle="Hardware" />
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button
            name="add"
            onClickWithEvent={handleClick}
            size="sm"
            variant="primary"
            startIcon={<Add className="size-5" />}
          >

            Add

          </Button>
          <div>
            <Button
            //className="animate-bounce"
              name="reset"
              onClickWithEvent={handleClick}
              size="sm"
              variant="primary"
              startIcon={<Reset className="size-5" />}
            >

              Reset & Upload

            </Button>
          </div>
          <div>
            <Button
              name="upload"
              onClickWithEvent={handleClick}
              size="sm"
              variant="primary"
              startIcon={<Upload className="size-5" />}
            >

              Upload Config

            </Button>
          </div>
          <div>
            <Button
              name="transfer"
              onClickWithEvent={handleClick}
              size="sm"
              variant="primary"
              startIcon={<Upload className="size-5" />}
            >

              Transfer Config

            </Button>
          </div>
          <Button
            name="scan"
            onClickWithEvent={handleClick}
            size="sm"
            variant="primary"
            startIcon={<Scan className="size-5" />}
          >

            Scan Hardware

          </Button>
          {idReportList.length != 0 &&
            <span
              className={`relative right-6 -top-2 z-10 h-4 w-4 rounded-full bg-orange-400 ${!notifying ? "hidden" : "flex"
                }`}
            >
              <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
            </span>
          }


        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">

            <TableTemplate<ScpDto> deviceIndicate={1} statusDto={status} selectedObject={selectedObjects} checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={HARDWARE_TABLE_HEADER} tableDatas={tableDatas} tableKeys={HARDWARE_TABLE_KEY} status={true} action={true} isDetail={true} actionElement={(data, isDetail) => (
              <ActionElement isDetail={isDetail} onEditClick={handleOnEditClick} onRemoveClick={handleOnRemoveClick} data={data} />

            )} />

          </div>
        </div>

      </div>
    </>
  );
}


export default Hardware;