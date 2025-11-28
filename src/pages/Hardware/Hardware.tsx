import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TableTemplate from "../../components/tables/Tables/TableTemplate";
import Button from "../../components/ui/button/Button";
import { AddIcon, ResetIcon, ScanIcon, UploadIcon } from "../../icons";
import Modals from "../UiElements/Modals";
import DangerModal from "../UiElements/DangerModal";
import {  ID_REPORT_KEY, ID_REPORT_TABLE_HEADER, IdReportEndPoint, ModalDetail } from "../../constants/constant";
import { HardwareProps, ResetScpDto } from "../../constants/types";
import SelectDeviceForm from "../../components/form/form-elements/SelectDeviceForm";
import LoadingModals from "../UiElements/LoadingModals";
import HttpRequest from "../../utility/HttpRequest";
import Helper from "../../utility/Helper";
import { usePopupActions } from "../../utility/PopupCalling";
import HardwareForm from "./HardwareForm";
import Logger from "../../utility/Logger";
import { HardwareDto } from "../../model/Hardware/HardwareDto";
import { IdReport } from "../../model/IdReport/IdReport";
import { HardwareTable } from "./HardwareTable";
import SignalRService from "../../services/SignalRService";
import { StatusDto } from "../../model/StatusDto";
import { AxiosResponse } from "axios";
import { ResponseDto } from "../../model/ResponseDto";
import { HttpMethod } from "../../enum/HttpMethod";
import { HardwareEndpoint } from "../../endpoint/HardwareEndpoint";

// Get Global Variable
let removeTarget: ResetScpDto = {
  ScpMac: ""
};
let resetTarget: ResetScpDto = {
  ScpMac: ""
}

const defaultDto: HardwareDto = {
  // Base
  uuid: "",
  componentId: -1,
  macAddress: "",
  locationId: 1,
  locationName: "Main Location",
  isActive: true,

  // Define
  name: "",
  model: "",
  ipAddress: "",
  modules: [],
  serialNumber: "",
  isUpload: false,
  isReset: false
}

const Hardware: React.FC<PropsWithChildren<HardwareProps>> = ({ onUploadClick }) => {
  const { showPopup } = usePopupActions();
  const [refresh, setRefresh] = useState(false);
  const toggleRefresh = () => setRefresh(!refresh);

  let ScanTableTemplate: ReactNode;


  {/* Modal Handler */ }
  const [scanModal, setScanModal] = useState<boolean>(false)
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [isModalSelectDeviceOpen, setIsModalSelectDeviceOpen] = useState<boolean>(false);
  const [isModalAddDetailOpen, setIsModalAddDetailOpen] = useState<boolean>(false);
  const [isRemoveClick, SetIsRemoveClick] = useState<boolean>(false);
  const [isReseting, setIsReseting] = useState<boolean>(false);
  const [isSendingCommand, setIsSendingCommand] = useState<boolean>(false);

  // Upload Modal
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const handleCloseModal = () => setScanModal(false);
  const handleCloseAddDetailModal = () => setIsModalAddDetailOpen(false);
  const handleCloseSelectDevice = () => setIsModalSelectDeviceOpen(false);


  {/* IdReport */ }
  const [idReportList, setIdReportList] = useState<IdReport[]>([]);
  const handleAddIdReport = async (data: IdReport) => {
    setHardwareDto({
      // Base
      uuid: "",
      componentId: data.scpId,
      macAddress: data.macAddress,
      locationId: 1,
      locationName: "Main Location",
      isActive: true,

      // Define
      name: "",
      model: data.model,
      ipAddress: data.ip,
      modules: [],
      serialNumber: data.serialNumber.toString(),
      isUpload: false,
      isReset: false
    });
    console.log(data);
    setScanModal(false);
    setCreateModal(true);
  }
  const fetchIdReport = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, IdReportEndPoint.GET_ID_REPORT_LIST)
    Logger.info(res);
    console.log(res);
    if (res && res.data.data) {
      setIdReportList(res.data.data);
    }
  }

  ScanTableTemplate = <TableTemplate<IdReport> checkbox={false} tableDatas={idReportList} tableHeaders={ID_REPORT_TABLE_HEADER} tableKeys={ID_REPORT_KEY} status={false} action={true} actionElement={(row) => (
    <Button onClick={() => handleAddIdReport(row)} size="sm" variant="primary">
      Add
    </Button>
  )} />

  {/* Hardware Data */ }
  const [hardwareDto, setHardwareDto] = useState<HardwareDto>(defaultDto)
  const [notifying, setNotifying] = useState(true);
  const [data, setData] = useState<HardwareDto[]>([]);
  const [status, setStatus] = useState<StatusDto[]>([]);
  const fetchData = async () => {
    const res: AxiosResponse<ResponseDto<HardwareDto[]>, any> | null | undefined = await HttpRequest.send(HttpMethod.GET, HardwareEndpoint.GET_SCP_LIST);
    if (res && res.data.data) {
      setData(res.data.data);

      // Batch set state
      const newStatuses = res.data.data.map((a: HardwareDto) => ({
        macAddress: a.macAddress,
        componentId: a.componentId,
        status: -1,
        tamper: -1,
        ac: -1,
        batt: -1
      }));

      console.log(newStatuses);

      setStatus((prev) => [...prev, ...newStatuses]);
      console.log(res.data.data)
      // Fetch status for each
      res.data.data.forEach((a: HardwareDto) => {
        fetchStatus(a.macAddress, a.componentId);
      });
    }

  }
  const fetchStatus = async (mac: string, id: number) => {
    const res: AxiosResponse<ResponseDto<StatusDto>, any> | null | undefined = await HttpRequest.send(HttpMethod.GET, HardwareEndpoint.GET_SCP_STATUS + mac + "/" + id)
    if (res?.data.data) {
      setStatus((prev) => prev.map((a) =>
        a.macAddress == res.data.data.macAddress
          ? {
            ...a,
            status: res.data.data.status,
          }
          : {
            ...a
          }
      )
      );
    }
  }

  const resetDevice = async (ScpMac: string) => {
    const res = await HttpRequest.send(HttpMethod.POST, HardwareEndpoint.POST_SCP_RESET + ScpMac)
    if (Helper.handlePopupByResCode(res, showPopup)) setIsReseting(true)
  }

  const uploadConfig = async (ScpMac: string) => {
    const res = await HttpRequest.send(HttpMethod.POST, HardwareEndpoint.POST_SCP_UPLOAD + ScpMac)
    if (Helper.handlePopupByResCode(res, showPopup)) setIsUploading(true);
  }

  const removeScp = async (data: ResetScpDto) => {
    setIsSendingCommand(true);
    const res = await HttpRequest.send(HttpMethod.DELETE, HardwareEndpoint.DELETE_SCP + data.ScpMac);
    if (Helper.handlePopupByResCode(res, showPopup)) {
      setIsSendingCommand(false);
      toggleRefresh();
    }

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHardwareDto((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const createHardware = async () => {
    const res = await HttpRequest.send(HttpMethod.POST, HardwareEndpoint.POST_ADD_SCP, hardwareDto)
    setIsSendingCommand(true);
    setCreateModal(false);
    if (Helper.handlePopupByResCode(res, showPopup)) {
      setIsSendingCommand(false);
      toggleRefresh()
    }
  }

  {/* Handle Action Table*/ }
  const handleEdit = (data: HardwareDto) => {
    console.log(data);
    setHardwareDto({
      // Base
      uuid: data.uuid,
      componentId: data.componentId,
      macAddress: data.macAddress,
      locationId: data.locationId,
      locationName: data.locationName,
      isActive: true,
      // detail

      name: data.name,
      model: data.model,
      ipAddress: data.ipAddress,
      modules: data.modules,
      serialNumber: data.serialNumber,
      isUpload: data.isUpload,
      isReset: data.isReset
    })
    setEditModal(true);
  }
  const handleRemove = (data: HardwareDto) => {
    removeTarget = { ScpMac: data.macAddress };
    SetIsRemoveClick(true);
  }
  {/* Handle Click */ }
  const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.name);
    switch (e.currentTarget.name) {
      case "add":
        setIsModalSelectDeviceOpen(true);
        break;
      case "submit":
        createHardware()
        break;
      case "scan":
        setScanModal(true);
        fetchIdReport();
        break;
      case "close":
        setCreateModal(false)
        setEditModal(false)
        break;
      case "reset":
        if (selectedObjects.length != 0) {
          selectedObjects.map((a: HardwareDto) => {
            resetDevice(a.macAddress);
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
          selectedObjects.map((a: HardwareDto) => {
            uploadConfig(a.macAddress);
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
  const [selectedObjects, setSelectedObjects] = useState<HardwareDto[]>([]);
  const handleCheckedAll = (data: HardwareDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleChecked = (data: HardwareDto, e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(data)
    console.log(e.target.checked)
    if (setSelectedObjects) {
      if (e.target.checked) {
        setSelectedObjects((prev) => [...prev, data]);
      } else {
        setSelectedObjects((prev) =>
          prev.filter((item) => item.componentId !== data.componentId)
        );
      }
    }
  }

  {/* UseEffect */ }
  useEffect(() => {
    var connection = SignalRService.getConnection();
    connection.on("CommStatus", (ScpMac: string, CommStatus: number) => {
      console.log(ScpMac);
      console.log(CommStatus);
      //fetchStatus(ScpMac);
      if (resetTarget.ScpMac == ScpMac && CommStatus == 2) {
        setIsReseting(false);
      }

    });

    connection.on("UploadStatus", (message: string, isFinish: boolean) => {
      setUploadMessage(message);
      console.log(message);
      console.log(isFinish)
      if (isFinish) {
        setTimeout(() => {
          setIsUploading(false);
        }, 500)

      }
      connection.on("UploadFinish", () => {
        setIsUploading(false);
      })
    });
    connection.on("IdReport", (IdReports: IdReport[]) => {
      setIdReportList(IdReports);
    })
    //connection.on
    fetchIdReport();
    fetchData();
    return () => {
      //SignalRService.stopConnection()
    };
  }, [refresh]);


  return (
    <>

      {isRemoveClick &&
        <DangerModal header={ModalDetail.REMOVE_HARDWARE.header} body={ModalDetail.REMOVE_HARDWARE.body} onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />
      }
      {isModalSelectDeviceOpen &&
        <Modals header="Hardware Select" body={<SelectDeviceForm />} handleClickWithEvent={handleCloseSelectDevice} />
      }
      {scanModal &&
        <Modals header="Host List" body={ScanTableTemplate} handleClickWithEvent={handleCloseModal} />
      }
      {isSendingCommand &&
        <LoadingModals isReset={false} header="Processing..." />
      }
      {isReseting &&
        <LoadingModals isReset={true} header="Reseting..." />
      }
      {isUploading &&
        <LoadingModals isReset={false} header="Uploading Please wait" body={uploadMessage} />
      }

      <PageBreadcrumb pageTitle="Hardware" />
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button
            name="add"
            onClickWithEvent={handleClickWithEvent}
            size="sm"
            variant="primary"
            startIcon={<AddIcon className="size-5" />}
          >

            Add

          </Button>
          <div>
            <Button
              //className="animate-bounce"
              name="reset"
              onClickWithEvent={handleClickWithEvent}
              size="sm"
              variant="primary"
              startIcon={<ResetIcon className="size-5" />}
            >

              Reset & Upload

            </Button>
          </div>
          <div>
            <Button
              name="upload"
              onClickWithEvent={handleClickWithEvent}
              size="sm"
              variant="primary"
              startIcon={<UploadIcon className="size-5" />}
            >

              Upload Config

            </Button>
          </div>
          <div>
            <Button
              name="transfer"
              onClickWithEvent={handleClickWithEvent}
              size="sm"
              variant="primary"
              startIcon={<UploadIcon className="size-5" />}
            >

              Transfer Config

            </Button>
          </div>
          <Button
            name="scan"
            onClickWithEvent={handleClickWithEvent}
            size="sm"
            variant="primary"
            startIcon={<ScanIcon className="size-5" />}
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
        {createModal || editModal ?
          <HardwareForm handleClickWithEvent={handleClickWithEvent} handleChange={handleChange} data={hardwareDto} isDetail={false} />
          :
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <HardwareTable data={data} statusDto={status} handleEdit={handleEdit} handleRemove={handleRemove} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} selectedObject={selectedObjects} />
            </div>
          </div>
        }


      </div>
    </>
  );
}


export default Hardware;