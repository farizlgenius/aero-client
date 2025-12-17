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
import { TableCell } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

const MODULE_TABLE_HEADER: string[] = [
  "Model","Address", "Tamper", "AC", "Battery", "Status", "Action"
]

// Define Keys
const MODULE_KEY: string[] = [
   "model","address"
]



export default function Module() {
  const { locationId } = useLocation();
  const { filterPermission } = useAuth();
  {/* Module Data */ }
  const [status, setStatus] = useState<StatusDto[]>([]);
  const [moduleDto, setModuleDto] = useState<ModuleDto[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const toggleRefresh = () => setRefresh(prev => !prev)
  const fetchModule = async () => {
    console.log(locationId)
    const res = await send.get(ModuleEndpoint.GET_MODULE(locationId))
    if (res && res.data.data) {
      //Helper.handlePopup(res, PopUpMsg.GET_MODULE_STATUS, showPopup)
      console.log(res.data.data)
      setModuleDto(res.data.data);
      const newStatuses = res.data.data.map((a: ModuleDto) => ({
        macAddress: a.macAddress,
        componentId: a.componentId,
        status: 0,
        tamper: "",
        ac: "",
        batt: ""
      }));

      console.log(newStatuses);

      setStatus((prev) => [...prev, ...newStatuses]);

      // Fetch status for each
      res.data.data.forEach((a: ModuleDto) => {
        fetchStatus(a.macAddress, a.componentId);
      });
    }

  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { }

  {/* Modals Module */ }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModalToggle = () => setIsModalOpen(false);

  {/* Module Status */ }
  const fetchStatus = async (ScpMac: string, SioNo: number) => {
    await send.get(ModuleEndpoint.GET_MODULE_STATUS(ScpMac, SioNo))
    //Helper.handlePopup(res, PopUpMsg.GET_MODULE_STATUS, showPopup)
  };

  {/* Table Action*/ }
  const handleEdit = (data: ModuleDto) => {
    setIsModalOpen(true);
  }

  const handleRemove = (data: ModuleDto) => {

  }

  {/* checkBox */ }
  const [selectedObjects, setSelectedObjects] = useState<ModuleDto[]>([]);
  const handleCheckedAll =
    (data: ModuleDto[]) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setSelectedObjects) {
        if (e.target.checked) {
          setSelectedObjects(data);
        } else {
          setSelectedObjects([]);
        }
      }
    };
  const handleCheck =
    (data: ModuleDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setSelectedObjects) {
        if (e.target.checked) {
          setSelectedObjects((prev) => [...prev, data]);
        } else {
          setSelectedObjects((prev) =>
            prev.filter((item) => item.componentId !== data.componentId)
          );
        }
      }
    };
  {/* UseEffect */ }
  useEffect(() => {
    fetchModule();
  }, []);

  useEffect(() => {
    // Initialize SignalR as soon as app starts
    var connection = SignalRService.getConnection();
    connection.on(
      "SioStatus",
      (
        ScpMac: string,
        SioNo: number,
        Status: string,
        Tamper: string,
        Ac: string,
        Batt: string
      ) => {
        console.log(Status);
        console.log(Tamper);
        console.log(Ac);
        console.log(Batt);
        setStatus((prev) =>
          prev.map((a) =>
            a.macAddress == ScpMac && a.componentId == SioNo
              ? {
                ...a,
                status: Status,
                tamper: Tamper == null ? a.tamper : Tamper,
                ac: Ac == null ? a.ac : Ac,
                batt: Batt == null ? a.batt : Batt
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


  return (
    <>
      {isModalOpen &&
        <Modals header="Edit Module" body={<EditModuleInputs data={moduleDto[0]} />} handleClickWithEvent={closeModalToggle} />
      }
      <PageBreadcrumb pageTitle="Module" />
      <BaseTable<ModuleDto> headers={MODULE_TABLE_HEADER} keys={MODULE_KEY} data={moduleDto} status={status} handleCheck={handleCheck} handleCheckAll={handleCheckedAll} selectedObject={selectedObjects} handleEdit={handleEdit} handleRemove={handleRemove} handleClick={handleClick} permission={filterPermission(FeatureId.DEVICE)} renderOptionalComponent={filterComponent} />
    </>
  );
}
