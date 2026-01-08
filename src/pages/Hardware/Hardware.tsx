import { ReactNode, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { HardwareIcon, ResetIcon, ScanIcon, ToggleTranIcon, TransferIcon, UploadIcon } from "../../icons";
import Modals from "../UiElements/Modals";
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
import { HardwareToast, ToastMessage } from "../../model/ToastMessage";
import Badge from "../../components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { HardwareMemAllocForm } from "../../components/form/hardware/HardwareMemAllocForm";
import { useLoading } from "../../context/LoadingContext";
import { HardwareComponentForm } from "../../components/form/hardware/HardwareComponentForm";
import { TranStatusDto } from "../../model/Hardware/TranStatusDto";
import { FormType } from "../../model/Form/FormProp";
import { usePopup } from "../../context/PopupContext";
import { SetTranDto } from "../../model/Hardware/SetTranDto";


const HEADER = ["Name", "Type", "Mac","Firmware", "IP","Port", "Transction", "Configuration", "Status", "Action"];
const KEY = ["name", "hardwareTypeDescription", "macAddress","firmware", "ip","port", "tranStatus"];
// Hardware Page
const ID_REPORT_KEY = [ "componentId",'macAddress','port','ip','serialNumber'];
const ID_REPORT_TABLE_HEADER = ["Id", "Mac", "Port", "Ip","Serial No", "Action"];


const Hardware = () => {
  const { FlashLoading } = useLoading();
  const { locationId } = useLocation();
  const { toggleToast } = useToast();
  const { filterPermission } = useAuth();
  const { setCreate,setRemove,setUpdate,setConfirmCreate,setConfirmRemove,setConfirmUpdate,setMessage,setInfo  } = usePopup();
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
    ip: "",
    serialNumber: "",
    isUpload: false,
    isReset: false,
    hardware_type: 0,
    hardwareTypeDescription: "",
    firmware: "",
    port: "",
    modules: [],
    portOne: false,
    portTwo: false,
    protocolOne: 0,
    protocolOneDescription: "",
    baudRateOne: -1,
    protocolTwo: 0,
    protocolTwoDescription: "",
    baudRateTwo: -1,
    macAddressDescription: ""
  }


  {/* Modal Handler */ }
  const [scan, setScan] = useState<boolean>(false)
  const [form,setForm] = useState<boolean>(false);
  const [formType,setFormType] = useState<FormType>(FormType.Create);

  // Upload Modal
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const handleCloseModal = () => setScan(false);



  {/* IdReport */ }
  const [idReportList, setIdReportList] = useState<IdReport[]>([]);
  const handleAddIdReport = async (data: IdReport) => {
    setHardwareDto({
      // Base
      uuid: "",
      componentId: data.componentId,
      macAddress: data.macAddress,
      macAddressDescription:'',
      locationId: locationId,
      isActive: true,

      // Define
      name: "",
      hardware_type:data.hardwareType,
      hardwareTypeDescription: data.hardwareTypeDescription,
      ip: data.ip,
      firmware:data.firmware,
      modules: [],
      port:data.port,
      serialNumber: data.serialNumber.toString(),
      portOne: false,
      portTwo: false,
      protocolOne:0,
      baudRateOne:-1,
      protocolOneDescription:"",
      protocolTwo:0,
      protocolTwoDescription:"",
      baudRateTwo:-1,
      isUpload: false,
      isReset: false
    });
    console.log(data);
    setScan(false);
    setForm(true);
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

  const setTran = async (data:SetTranDto[]) => {
    var res = await send.post(HardwareEndpoint.TRAN_RANGE,data);
    if(Helper.handleToastByResCode(res,HardwareToast.TOGGLE_TRAN,toggleToast)){
      toggleRefresh();
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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHardwareDto((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }



  {/* Handle Action Table*/ }
  const handleEdit = (data: HardwareDto) => {
    setFormType(FormType.Update)
    setHardwareDto({
      // Base
      uuid: data.uuid,
      componentId: data.componentId,
      macAddressDescription:data.macAddressDescription,
      macAddress: data.macAddress,
      locationId: data.locationId,
      isActive: true,
      // detail

      name: data.name,
      hardware_type: data.hardware_type,
      hardwareTypeDescription: data.hardwareTypeDescription,
      ip: data.ip,
      firmware: data.firmware,
      port: data.port,
      modules: data.modules,
      serialNumber: data.serialNumber,
      portOne: data.portOne,
      portTwo: data.portTwo,
      protocolOne:data.protocolOne,
      baudRateOne:data.baudRateOne,
      protocolOneDescription:data.protocolOneDescription,
      protocolTwo:data.protocolTwo,
      protocolTwoDescription:data.protocolTwoDescription,
      baudRateTwo:data.baudRateTwo,
      isUpload: data.isUpload,
      isReset: data.isReset
    })
    setForm(true);
  }

  const handleRemove = (data: HardwareDto) => {
    setConfirmRemove(() => async () => {
      const res = await send.delete(HardwareEndpoint.DELETE(data.macAddress));
      if(Helper.handleToastByResCode(res,HardwareToast.DELETE,toggleToast)){
        setHardwareDto(defaultDto)
        toggleRefresh();
      }
    })
    setRemove(true);

  }
  const handleInfo = (data:HardwareDto) => {
    setFormType(FormType.Info);
    setHardwareDto(data);
    setForm(true);
  }
  {/* Handle Click */ }
  const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.name);
    switch (e.currentTarget.name) {
      case "add":
        setFormType(FormType.Create);
        setForm(true);
        break;
      case "report":
        if (select.length == 0) {
          setMessage("Please select object")
          setInfo(true);
        } else {
          let data:SetTranDto[] = []
          select.map((a:HardwareDto) => {
            data.push({
              macAddress:a.macAddress,
              param:1
            });
          })
          setTran(data);
          
        }
        break;
      case "delete":
        if (select.length == 0) {
          setMessage("Please select object")
          setInfo(true);
        } else {
          setConfirmRemove(() => async () => {
            var data: number[] = [];
            select.map(async (a: HardwareDto) => {
              data.push(a.componentId)
            })
            var res = await send.post(HardwareEndpoint.DELETE_RANGE, data)
            if (Helper.handleToastByResCode(res, HardwareToast.DELETE_RANGE, toggleToast)) {
              setRemove(false);
              toggleRefresh();
            }
          })
          setRemove(true);
        }
        break;
      case "update":
        setConfirmUpdate(() => async () => {
          const res = await send.put(HardwareEndpoint.UPDATE,hardwareDto);
          if(Helper.handleToastByResCode(res,HardwareToast.UPDATE,toggleToast)){
            setForm(false);
            toggleRefresh();
            setHardwareDto(defaultDto);
          }
        })
        setUpdate(true);
        break;
      case "create":
        setConfirmCreate(() => async () => {
          const res = await send.post(HardwareEndpoint.CREATE,hardwareDto);
          if(Helper.handleToastByResCode(res,HardwareToast.CREATE,toggleToast)){
            toggleRefresh();
            setForm(false);
            setHardwareDto(defaultDto);
          }
        })
        setCreate(true);
        break;
      case "type":
        setForm(true)
        break;
      case "scan":
        setScan(true);
        fetchIdReport();
        break;
      case "close":
        setForm(false)
        break;
      case "reset":
        if (select.length != 0) {
          select.map((a: HardwareDto) => {
            resetDevice(a.macAddress);
          })

        } else {
          alert("No selected object")
        }
        break;
      case "upload":
        if (select.length != 0) {
          select.map((a: HardwareDto) => {
            uploadConfig(a.macAddress);
          })

        } else {
          alert("No selected object")
        }
        break;
      default:
        break;
    }
  }

  {/* checkBox */ }
  const [select, setSelect] = useState<HardwareDto[]>([]);


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
      icon: <TransferIcon />
    },{
      buttonName:"Report Toggle",
      lable:"report",
      icon:<ToggleTranIcon/>
    },
    {
      buttonName: "Scan",
      lable: "scan",
      icon: <>
        <ScanIcon className={idReportList.length != 0 ? "animate-ping" : ""} />
      </>
    }
  ];
  const renderOptional = (data: HardwareDto, statusDto: StatusDto[],index:number) => {
    console.log(data)
    console.log(statusDto)
    console.log(statusDto.find(b => b.macAddress == data.macAddress)?.status)
    return [
      <TableCell key={index} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
      <TableCell key={index+1} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
      content: <HardwareForm handleClick={handleClickWithEvent}  dto={hardwareDto} setDto={setHardwareDto} type={formType} />
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

      {/* {select &&ด
        <Modals header="Hardware Select" body={<SelectDeviceForm setDto={setHardwareType} handleClick={handleClickWithEvent} />} handleClickWithEvent={handleCloseSelectDevice} />
      } */}
      {scan &&
        <Modals header="Host List" body={ScanTableTemplate} handleClickWithEvent={handleCloseModal} />
      }

      <PageBreadcrumb pageTitle="Hardware" />
      <div className="space-y-6">
        {form ?
          <>
            <BaseForm tabContent={tabContent} />
            {/* <HardwareForm handleClickWithEvent={handleClickWithEvent} handleChange={handleChange} data={hardwareDto} isDetail={false} /> */}
          </>

          :
          <BaseTable<HardwareDto> headers={HEADER} keys={KEY} data={data} onEdit={handleEdit} onRemove={handleRemove} onInfo={handleInfo} onClick={handleClickWithEvent} select={select} setSelect={setSelect} permission={filterPermission(FeatureId.DEVICE)} action={actionBtn} renderOptionalComponent={renderOptional} status={status} specialDisplay={[
            {
              key: "tranStatus",
              content: (a, i) => <TableCell key={i} className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                <Badge size="sm" color={tranStatus.find(x => x.macAddress == a.macAddress)?.disabled == 0 && tranStatus.find(x => x.macAddress == a.macAddress)?.status ? "success" : "error"}>
                  {tranStatus.find(x => x.macAddress == a.macAddress)?.status ?? "Unknown"}
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