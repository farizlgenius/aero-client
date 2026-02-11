import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Modals from "../UiElements/Modals";
import EditModuleInputs from "../../components/form/form-elements/EditModuleInputs";
import { ModuleDto } from "../../model/Module/ModuleDto";
import { StatusDto } from "../../model/StatusDto";
import { ModuleEndpoint } from "../../endpoint/ModuleEndpoint";
import { send } from "../../api/api";
import { useLocation } from "../../context/LocationContext";
import { BaseTable } from "../UiElements/BaseTable";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import SignalRService from "../../services/SignalRService";
import { Table, TableBody, TableCell, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import ResponsiveImage from "../../components/ui/images/ResponsiveImage";
import { SioStatus } from "../../model/Module/SioStatus";
import { usePagination } from "../../context/PaginationContext";

const HEADER: string[] = [
  "Model","Address", "Tamper", "AC", "Battery", "Status", "Action"
]

// Define Keys
const KEY: string[] = [
   "model","address"
]



export default function Module() {
  const { locationId } = useLocation();
  const {setPagination} = usePagination();
  const { filterPermission } = useAuth();
  {/* Module Data */ }
  const [status, setStatus] = useState<StatusDto[]>([]);
  const [moduleDto, setModuleDto] = useState<ModuleDto[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const toggleRefresh = () => setRefresh(prev => !prev)
  const fetchModule = async (pageNumber: number, pageSize: number,locationId?:number,search?: string, startDate?: string, endDate?: string) => {
    console.log(locationId)
    const res = await send.get(ModuleEndpoint.PAGINATION(pageNumber,pageSize,locationId,search, startDate, endDate))
    if (res && res.data.data) {
      //Helper.handlePopup(res, PopUpMsg.GET_MODULE_STATUS, showPopup)
      console.log(res.data.data)
      setModuleDto(res.data.data.data);
      setPagination(res.data.data.page)
      const newStatuses = res.data.data.data.map((a: ModuleDto) => ({
        macAddress: a.mac,
        componentId: a.componentId,
        status: 0,
        tamper: "",
        ac: "",
        batt: ""
      }));

      console.log(newStatuses);

      setStatus((prev) => [...prev, ...newStatuses]);

      // Fetch status for each
      res.data.data.data.forEach((a: ModuleDto) => {
        fetchStatus(a.mac, a.componentId);
      });
    }

  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { }

  {/* Modals Module */ }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModalToggle = () => setIsModalOpen(false);

  {/* Module Status */ }
  const fetchStatus = async (ScpMac: string, SioNo: number) => {
    await send.get(ModuleEndpoint.STATUS(ScpMac, SioNo))
    //Helper.handlePopup(res, PopUpMsg.GET_MODULE_STATUS, showPopup)
  };

  {/* Table Action*/ }
  const handleEdit = (data: ModuleDto) => {
    setIsModalOpen(true);
  }

  const handleRemove = (data: ModuleDto) => {

  }

  const handleInfo = (data:ModuleDto) => {

  }

  {/* checkBox */ }
  const [selectedObjects, setSelectedObjects] = useState<ModuleDto[]>([]);
 
  useEffect(() => {
    // Initialize SignalR as soon as app starts
    var connection = SignalRService.getConnection();
    connection.on(
      "SIO.STATUS",
      (
       status:SioStatus
      ) => {
        setStatus((prev) =>
          prev.map((a) =>
            a.macAddress == status.mac && a.componentId == status.sioNo
              ? {
                ...a,
                status: status.status,
                tamper: status.tamper == null ? a.tamper : status.tamper,
                ac: status.ac == null ? a.ac : status.ac,
                batt: status.batt == null ? a.batt : status.batt
              }
              : {
                ...a
              }
          )
        );
        toggleRefresh();
      }
    );

    return () => {
      //SignalRService.stopConnection()
    };
  }, [refresh]);

  const filterComponent = (data: any, statusDto: StatusDto[]) => {
    return [
      <>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <Badge
            size="sm"
            color={
              statusDto.find(b => b.componentId == data.componentId)?.tamper == "Active"
                ? "success"
                : statusDto.find(b => b.componentId == data.componentId)?.tamper == "Inactive"
                  ? "error"
                  : "warning"
            }
          >
            {statusDto.find(b => b.componentId == data.componentId)?.tamper == "" ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.tamper}
          </Badge>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <Badge
            size="sm"
            color={
              statusDto.find(b => b.componentId == data.componentId)?.ac == "Active"
                ? "success"
                : statusDto.find(b => b.componentId == data.componentId)?.ac == "Inactive"
                  ? "error"
                  : "warning"
            }
          >
            {statusDto.find(b => b.componentId == data.componentId)?.ac == "" ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.ac}
          </Badge>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <Badge
            size="sm"
            color={
              statusDto.find(b => b.componentId == data.componentId)?.batt == "Active"
                ? "success"
                : statusDto.find(b => b.componentId == data.componentId)?.batt == "Inactive"
                  ? "error"
                  : "warning"
            }
          >
            {statusDto.find(b => b.componentId == data.componentId)?.batt == "" ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.batt}
          </Badge>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <Badge
            size="sm"
            color={
              statusDto.find(b => b.componentId == data.componentId)?.status == "Online" || statusDto.find(b => b.componentId == data.componentId)?.status == "Active"
                ? "success"
                : statusDto.find(b => b.componentId == data.componentId)?.status == "Offline"
                  ? "error"
                  : "warning"
            }
          >
            {statusDto.find(b => b.componentId == data.componentId)?.status == "" ? "Offline" : statusDto.find(b => b.componentId == data.componentId)?.status}
          </Badge>
        </TableCell>
      </>
    ]
  }

  const subTable = () => {
    return <TableRow >
      <TableCell colspan={8} >
        {/* <img src="https://www.dfsme.ae/wp-content/uploads/2023/11/HID-Aero%C2%AE-X100.png" width={40}/> */}
        <div className="flex w-1/2">
          <ResponsiveImage/>
        </div>

      </TableCell>

    </TableRow>
    
  }


  return (
    <>
      {isModalOpen &&
        <Modals header="Edit Module" body={<EditModuleInputs data={moduleDto[0]} />} handleClickWithEvent={closeModalToggle} />
      }
      <PageBreadcrumb pageTitle="Module" />
      <BaseTable<ModuleDto> subTable={subTable} headers={HEADER} keys={KEY} data={moduleDto} status={status} select={selectedObjects} setSelect={setSelectedObjects} onEdit={handleEdit} onInfo={handleInfo} onRemove={handleRemove} onClick={handleClick} permission={filterPermission(FeatureId.DEVICE)} renderOptionalComponent={filterComponent} fetchData={fetchModule} locationId={locationId} />
    </>
  );
}
