import { ReactNode, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TableTemplate from "../../components/tables/Tables/TableTemplate";
import Button from "../../components/ui/button/Button";
import { Add, Reset, Scan, Upload } from "../../icons";
import Modals from "../UiElements/Modals";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import ActionElement from "../UiElements/ActionElement";
import AddHostForm from "../../components/form/form-elements/AddHostForm";
import DangerModal from "../UiElements/DangerModal";
import { HARDWARE_TABLE_HEADER, HARDWARE_TABLE_KEY, HubEndPoint, ID_REPORT_KEY, ID_REPORT_TABLE_HEADER, ModalDetail, SCPEndPoint } from "../../constants/constant";
import { FetchScpStatus, IdReport, RemoveScpDto, ResetScpDto, ScpDto, StatusDto } from "../../constants/types";
import SelectDeviceForm from "../../components/form/form-elements/SelectDeviceForm";

// Get Global Variable

const server = import.meta.env.VITE_SERVER_IP;
let removeTarget:RemoveScpDto = {
  scpIp:""
};


export default function Hardware() {

  let ScanTableTemplate: ReactNode;


  {/* Modal Handler */ }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false);
  const [isModalSelectDeviceOpen, setIsModalSelectDeviceOpen] = useState<boolean>(false);
  const [isModalAddDetailOpen, setIsModalAddDetailOpen] = useState<boolean>(false);
  const [isRemoveClick,SetIsRemoveClick] = useState<boolean>(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseAddModal = () => setIsModalAddOpen(false);
  const handleCloseAddDetailModal = () => setIsModalAddDetailOpen(false);
  const handleCloseSelectDevice = () => setIsModalSelectDeviceOpen(false);


  {/* IdReport */ }
  const [idReportList, setIdReportList] = useState<IdReport[]>([]);
  const [idReport, setIdReport] = useState<ScpDto>({
          no: 0,
      scpId: 0,
      name: "",
      model: "",
      mac: "",
      ipAddress: "",
      serialNumber: "",
      status: 0, // 1 -> online , 0 -> offline
  });
  const handleAddIdReport = async (data: IdReport) => {
    setIdReport({
      no: 0,
      scpId: data.scpID,
      name: "",
      model: data.model,
      mac: data.macAddress,
      ipAddress: data.ip,
      serialNumber: data.serialNumber.toString(),
      status: 0, // 1 -> online , 0 -> offline
    });
    console.log(data);
    setIsModalOpen(false);
    setIsModalAddOpen(true);
  }
  const fetchIdReport = async () => {
    try {
      const res = await axios.get(`${server}`+SCPEndPoint.GET_IDREPORT_LIST);
      console.log(res.data.content)
      setIdReportList(res.data.content);

    } catch (e) {
      console.log(e);
    }
  }

  ScanTableTemplate = <TableTemplate<IdReport> checkbox={false} tableDatas={idReportList} tableHeaders={ID_REPORT_TABLE_HEADER} tableKeys={ID_REPORT_KEY} status={false} action={true} actionElement={(row) => (
    <Button onClick={() => handleAddIdReport(row)} size="sm" variant="primary">
      Add
    </Button>
  )} />


  {/* Host Data */ }
  const [notifying, setNotifying] = useState(true);
  const [tableDatas, setTableDatas] = useState<ScpDto[]>([]);
  const [status, setStatus] = useState<StatusDto[]>([]);
  const fetchData = async () => {
    try {
      const res = await axios.get(`${server}`+SCPEndPoint.GET_SCP_LIST);
      console.log(res.data.content);
      setTableDatas(res.data.content);

      // Batch set state
      const newStatuses = res.data.content.map((a: ScpDto) => ({
        scpIp: a.ipAddress,
        deviceNumber: a.scpId,
        status: 0
      }));

      console.log(newStatuses);

      setStatus((prev) => [...prev, ...newStatuses]);

      // Fetch status for each
      res.data.content.forEach((a: ScpDto) => {
        fetchStatus(a.scpId);
      });
    } catch (e) {
      console.log(e);
    }
  }
  const fetchStatus = async (scpId: number) => {
    try {
      const data:FetchScpStatus = {
        ScpId:scpId
      }
      const res = await axios.post(server + SCPEndPoint.POST_SCP_STATUS,data,{
        headers:{
          "Content-Type":"application/json"
        }
      });
      console.log(res.data.content);
      setStatus((prev) => prev.map((a) =>
        a.scpIp == res.data.content["scpIp"] && a.deviceNumber == res.data.content["scpId"]
          ? {
            ...a,
            status: res.data.content["status"],
          }
          : {
            // scpIp:ScpIp,
            // cpNumber:first,
            // status:status[0]
            ...a
          }
      )
      );
    } catch (e) {
      console.log(e);
    }
  }

  const resetDevice = async (ScpIp: string) => {
    try {
      const data: ResetScpDto = {
        ScpIp: ScpIp
      }
      const res = await axios.post(`${server}`+SCPEndPoint.POST_RESET_SCP, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }

  const removeScp = async (data:RemoveScpDto) => {
    try{
      const res = await axios.post(server+SCPEndPoint.POST_REMOVE_SCP,data,{
        headers:{
          "Content-Type":"application/json"
        }
      });
      console.log(res);
    }catch(e){
      console.log(e);
    }
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setIdReport((prev) => ({...prev,[e.target.name]:e.target.value}));
  }
  {/* Handle Action Table*/ }
  const handleOnEditClick = (data: ScpDto) => {
    console.log(data);
    setIdReport({
            no: data.no,
      scpId: data.scpId,
      name: data.name,
      model: data.model,
      mac: data.mac,
      ipAddress: data.ipAddress,
      serialNumber: data.serialNumber,
      status: data.status, // 1 -> online , 0 -> offline
    })
    setIsModalAddDetailOpen(true);
  }
  const handleOnRemoveClick = (data: ScpDto) => {
    removeTarget.scpIp = data.ipAddress;
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
        fetchIdReport();
        setIsModalOpen(true);
        break;
      case "reset":
        console.log(selectedObjects.length);
        if (selectedObjects.length != 0) {
          selectedObjects.map((a: ScpDto) => {
            resetDevice(a.ipAddress);
          })
        } else {
          alert("No selected object")
        }
        break;
      case "detail":
        setIsModalAddDetailOpen(true);
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
      .withUrl(server + HubEndPoint.SCP_HUB)
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Connected to SignalR event hub");
    });
    connection.on("CommStatus", (status: number, id: number) => {
      fetchStatus(id);
    });
    fetchData();
    return () => {
      connection.stop();
    };
  }, []);


  return (
    <>

      {isRemoveClick && 
      <DangerModal header={ModalDetail.REMOVE_HARDWARE.header} body={ModalDetail.REMOVE_HARDWARE.body} onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove}/>
      }
      {isModalSelectDeviceOpen &&
        <Modals header="Hardware Select" body={<SelectDeviceForm/>} closeToggle={handleCloseSelectDevice} />
      }
      {isModalOpen &&
        <Modals header="Host List" body={ScanTableTemplate} closeToggle={handleCloseModal} />
      }
      {isModalAddOpen &&
        <Modals header="Add Host" body={<AddHostForm onChange={handleChange} data={idReport} isDetail={false} />} closeToggle={handleCloseAddModal} />
      }
      {isModalAddDetailOpen &&
        <Modals header="Add Host" body={<AddHostForm onChange={handleChange} data={idReport} isDetail={true} />} closeToggle={handleCloseAddDetailModal} />
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
              name="reset"
              onClickWithEvent={handleClick}
              size="sm"
              variant="primary"
              startIcon={<Reset className="size-5" />}
            >

              Reset

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

          <Button
            name="scan"
            onClickWithEvent={handleClick}
            size="sm"
            variant="primary"
            startIcon={<Scan className="size-5" />}
          >

            Scan Hardware

          </Button>
          <span
            className={`relative right-6 -top-2 z-10 h-4 w-4 rounded-full bg-orange-400 ${!notifying ? "hidden" : "flex"
              }`}
          >
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>

        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">

            <TableTemplate<ScpDto> deviceIndicate={1} statusDto={status} selectedObject={selectedObjects} checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={HARDWARE_TABLE_HEADER} tableDatas={tableDatas} tableKeys={HARDWARE_TABLE_KEY} status={true} action={true} isDetail={true} actionElement={(data,isDetail) => (
              <ActionElement isDetail={isDetail} onEditClick={handleOnEditClick} onRemoveClick={handleOnRemoveClick} data={data} />

            )} />

          </div>
        </div>

      </div>
    </>
  );
}
