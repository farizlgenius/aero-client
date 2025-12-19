import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { HardwareIcon, ResetIcon, ScanIcon, UploadIcon } from "../../icons";
import Modals from "../UiElements/Modals";
import RemoveModal from "../UiElements/RemoveModal";
import SelectDeviceForm from "../../components/form/form-elements/SelectDeviceForm";
import HttpRequest from "../../utility/HttpRequest";
import Helper from "../../utility/Helper";
import HardwareForm from "../../components/form/hardware/HardwareForm";
import Logger from "../../utility/Logger";
import { HardwareDto } from "../../model/Hardware/HardwareDto";
import { IdReport } from "../../model/IdReport/IdReport";
import SignalRService from "../../services/SignalRService";
import { StatusDto } from "../../model/StatusDto";
import { HttpMethod } from "../../enum/HttpMethod";
import { HardwareEndpoint } from "../../endpoint/HardwareEndpoint";
import { send } from "../../api/api";
import { useLocation } from "../../context/LocationContext";
import { BaseTable } from "../UiElements/BaseTable";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { ActionButton } from "../../model/ActionButton";
import { BaseForm } from "../UiElements/BaseForm";
import { FormContent } from "../../model/Form/FormContent";
import { useToast } from "../../context/ToastContext";
import { ToastMessage } from "../../model/ToastMessage";
import Badge from "../../components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { HardwareMemAllocForm } from "../../components/form/hardware/HardwareMemAllocForm";
import { useLoading } from "../../context/LoadingContext";
import { HardwareComponentForm } from "../../components/form/hardware/HardwareComponentForm";
import { TranStatusDto } from "../../model/Hardware/TranStatusDto";


const HEADER = ["Name", "Model", "Mac","Firmware", "IP","Port", "Transction", "Configuration", "Status", "Action"];
const KEY = ["name", "model", "macAddress","fw", "ipAddress","port", "tranStatus"];
// Hardware Page
const ID_REPORT_KEY = [ "deviceId",'macAddress','scpId','ip'];
const ID_REPORT_TABLE_HEADER = ["Model", "Mac address", "Id", "Ip address", "Action"];

let removeTarget = "";

const Hardware = () => {
  const { FlashLoading } = useLoading();
  const { locationId } = useLocation();
  const { toggleToast } = useToast();
  const { filterPermission } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const toggleRefresh = () => setRefresh(!refresh);

  let ScanTableTemplate: ReactNode;

  const defaultDto: HardwareDto = {
    // Base
    uuid: "",
    componentId: -1,
    macAddress: "",
    locationId: locationId,
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


  {/* Modal Handler */ }
  const [scan, setScan] = useState<boolean>(false)
  const [create, setCreate] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [select, setSelect] = useState<boolean>(false);
  const [isRemoveClick, SetIsRemoveClick] = useState<boolean>(false);
  const [hardwareType, setHardwareType] = useState<number>(-1);

  // Upload Modal
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const handleCloseModal = () => setScan(false);
  const handleCloseSelectDevice = () => setSelect(false);


  {/* IdReport */ }
  const [idReportList, setIdReportList] = useState<IdReport[]>([]);
  const handleAddIdReport = async (data: IdReport) => {
    setHardwareDto({
      // Base
      uuid: "",
      componentId: data.scpId,
      macAddress: data.macAddress,
      locationId: locationId,
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
    setScan(false);
    setCreate(true);
  }
  const fetchIdReport = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, HardwareEndpoint.ID_REPORT)
    Logger.info(res);
    console.log(res);
    if (res && res.data.data) {
      setIdReportList(res.data.data);
    }
  }

  ScanTableTemplate = (
    <>
      <div className="max-h-[70vh] overflow-y-auto hidden-scroll">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
            <TableRow>
              {ID_REPORT_TABLE_HEADER.map((head: string, i: number) =>
                <TableCell
                  key={i}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {head}
                </TableCell>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {idReportList.map((data: any, i: number) => (
              <TableRow key={i}>
                {ID_REPORT_KEY.map((key: string, i: number) =>
                  <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {String(data[key as keyof typeof data])}
                  </TableCell>
                )}
                <TableCell>
                  <Button onClick={() => handleAddIdReport(data)} size="sm" variant="primary">
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </div>

    </>
  );



  {/* Hardware Data */ }
  const [hardwareDto, setHardwareDto] = useState<HardwareDto>(defaultDto)
  const [data, setData] = useState<HardwareDto[]>([]);
  const [status, setStatus] = useState<StatusDto[]>([]);
  const [tranStatus, setTranStatus] = useState<TranStatusDto[]>([]);
  const fetchData = async () => {
    const res = await send.get(HardwareEndpoint.GET(locationId))
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

      const newTranStatuses = res.data.data.map((a: HardwareDto) => ({
        macAddress: a.macAddress,
        capacity: 0,
        oldest: 0,
        lastReport: 0,
        lastLog: 0,
        disabled: 0,
      }));

      console.log(newStatuses);

      setTranStatus((prev) => [...prev, ...newTranStatuses])
      setStatus((prev) => [...prev, ...newStatuses]);
      console.log(res.data.data)
      // Fetch status for each
      res.data.data.forEach((a: HardwareDto) => {
        fetchStatus(a.macAddress);
        fetchTransactionStatus(a.macAddress);
      });
    }

  }
  const fetchStatus = async (mac: string) => {
    const res = await send.get(HardwareEndpoint.STATUS(mac));
    console.log(res)
    if (res && res.data.data) {
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

  const fetchTransactionStatus = async (mac: string) => {
    const res = await send.get(HardwareEndpoint.TRAN(mac));
    if (res && res.data.data) {
      setTranStatus((prev) => prev.map((a: TranStatusDto) =>
        a.macAddress == res.data.data.macAddress ? {
          ...a,
        } : {
          ...a
        }
      ))
    }
  }

  const resetDevice = async (ScpMac: string) => {
    const res = await send.post(HardwareEndpoint.RESET(ScpMac))
    if (Helper.handleToastByResCode(res, ToastMessage.RESET_SCP, toggleToast)) {
      toggleRefresh();
    }
  }

  const uploadConfig = async (ScpMac: string) => {
    const res = await send.post(HardwareEndpoint.UPLOAD(ScpMac))
    if (Helper.handleToastByResCode(res, ToastMessage.UPLOAD_SCP, toggleToast)) {
      toggleRefresh();
    }
  }

  const removeScp = async (mac: string) => {
    const res = await send.delete(HardwareEndpoint.DELETE(mac))
    if (Helper.handleToastByResCode(res, ToastMessage.DELETE_SCP, toggleToast)) {
      toggleRefresh();
    }

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHardwareDto((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const createHardware = async () => {
    const res = await send.post(HardwareEndpoint.CREATE, hardwareDto)
    setCreate(false);
    if (Helper.handleToastByResCode(res, ToastMessage.CREATE_HARDWARE, toggleToast)) {
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
    setEdit(true);
  }
  const handleRemove = (data: HardwareDto) => {
    removeTarget = data.macAddress;
    SetIsRemoveClick(true);
  }
  const handleInfo = (data:HardwareDto) => {

  }
  {/* Handle Click */ }
  const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.name);
    switch (e.currentTarget.name) {
      case "add":
        setSelect(true);
        break;
      case "type":
        setCreate(true)
        setSelect(false)
        break;
      case "submit":
        createHardware()
        break;
      case "scan":
        setScan(true);
        fetchIdReport();
        break;
      case "close":
        setCreate(false)
        setEdit(false)
        break;
      case "reset":
        if (selectedObjects.length != 0) {
          selectedObjects.map((a: HardwareDto) => {
            resetDevice(a.macAddress);
          })

        } else {
          alert("No selected object")
        }
        break;
      case "upload":
        if (selectedObjects.length != 0) {
          selectedObjects.map((a: HardwareDto) => {
            uploadConfig(a.macAddress);
          })

        } else {
          alert("No selected object")
        }
        break;
      case "remove-cancel":
        SetIsRemoveClick(false);
        break;
      case "remove-confirm":
        removeScp(removeTarget);
        SetIsRemoveClick(false);
        break;
      default:
        break;
    }
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
      fetchStatus(ScpMac);

    });

    connection.on("TranStatus", (data: TranStatusDto) => {
      console.log(data)
      setTranStatus((prev) => prev.map((a) =>
        a.macAddress == data.macAddress
          ? {
            ...a,
            macAddress: data.macAddress,
            capacity: data.capacity,
            oldest: data.oldest,
            lastReport: data.lastReport,
            lastLog: data.lastLog,
            disabled: data.disabled,
            status: data.status
          }
          : {
            ...a
          }
      )
      );
    })

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


  const actionBtn: ActionButton[] = [
    {
      buttonName: "Reset",
      lable: "reset",
      icon: <ResetIcon />
    }, {
      buttonName: "Upload",
      lable: "upload",
      icon: <UploadIcon />
    },
    {
      buttonName: "Transfer",
      lable: "transfer",
      icon: <UploadIcon />
    },
    {
      buttonName: "Scan",
      lable: "scan",
      icon: <>
        <ScanIcon className={idReportList.length != 0 ? "animate-ping" : ""} />
      </>
    }
  ];
  const renderOptional = (data: HardwareDto, statusDto: StatusDto[]) => {
    console.log(data)
    console.log(statusDto)
    console.log(statusDto.find(b => b.macAddress == data.macAddress)?.status)
    return [
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <>
          {
            data.isReset == true && statusDto.find(b => b.macAddress == data.macAddress)?.status == 0 ?
              <FlashLoading />
              :
              data.isReset == true ?
                <Badge
                  variant="solid"
                  size="sm"
                  color="error"
                >
                  Reset Require
                </Badge>
                : data.isUpload == true ?
                  <Badge
                    variant="solid"
                    size="sm"
                    color="warning"
                  >
                    Upload Require
                  </Badge>
                  :
                  <Badge
                    variant="solid"
                    size="sm"
                    color="success"
                  >
                    Synced
                  </Badge>
          }

        </>
      </TableCell>,
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {data.isReset || data.isUpload ?
          <Badge
            size="sm"
            color="error"
          >
            Error
          </Badge>
          :
          <Badge
            size="sm"
            color={
              statusDto.find(b => b.macAddress == data.macAddress)?.status == 1
                ? "success"
                : statusDto.find(b => b.macAddress == data.macAddress)?.status == 0
                  ? "error"
                  : "warning"
            }
          >
            {statusDto.find(b => b.macAddress == data.macAddress)?.status == 1 ? "Online" : statusDto.find(b => b.macAddress == data.macAddress)?.status == 0 ? "Offline" : statusDto.find(b => b.macAddress == data.macAddress)?.status}
          </Badge>

        }
      </TableCell>
    ]
  }

  {/* Form */ }
  const tabContent: FormContent[] = [
    {
      icon: <HardwareIcon />,
      label: "Hardware",
      content: <HardwareForm handleClickWithEvent={handleClickWithEvent} handleChange={handleChange} data={hardwareDto} isDetail={false} />
    }, {
      icon: <HardwareIcon />,
      label: "Memory Allocate",
      content: <HardwareMemAllocForm data={hardwareDto} />
    }, {
      icon: <HardwareIcon />,
      label: "Component",
      content: <HardwareComponentForm data={hardwareDto} />
    }
  ];


  return (
    <>

      {isRemoveClick &&
        <RemoveModal  handleClick={handleClickWithEvent} />
      }
      {select &&
        <Modals header="Hardware Select" body={<SelectDeviceForm setDto={setHardwareType} handleClick={handleClickWithEvent} />} handleClickWithEvent={handleCloseSelectDevice} />
      }
      {scan &&
        <Modals header="Host List" body={ScanTableTemplate} handleClickWithEvent={handleCloseModal} />
      }

      <PageBreadcrumb pageTitle="Hardware" />
      <div className="space-y-6">
        {create || edit ?
          <>
            <BaseForm tabContent={tabContent} />
            {/* <HardwareForm handleClickWithEvent={handleClickWithEvent} handleChange={handleChange} data={hardwareDto} isDetail={false} /> */}
          </>

          :
          <BaseTable<HardwareDto> headers={HEADER} keys={KEY} data={data} onEdit={handleEdit} onRemove={handleRemove} onInfo={handleInfo} onClick={handleClickWithEvent} select={selectedObjects} setSelect={setSelectedObjects} permission={filterPermission(FeatureId.DEVICE)} action={actionBtn} renderOptionalComponent={renderOptional} status={status} specialDisplay={[
            {
              key: "tranStatus",
              content: (a, i) => <TableCell key={i} className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                <Badge size="sm" color={tranStatus.find(x => x.macAddress == a.macAddress)?.disabled == 0 ? "success" : "error"}>
                  {tranStatus.find(x => x.macAddress == a.macAddress)?.status}
                </Badge>
              </TableCell>
            }
          ]} />
        }
      </div>
    </>
  );
}


export default Hardware;