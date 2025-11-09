import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Modals from "../UiElements/Modals";
import EditModuleInputs from "../../components/form/form-elements/EditModuleInputs";
import HttpRequest from "../../utility/HttpRequest";
import { usePopupActions } from "../../utility/PopupCalling";
import { ModuleDto } from "../../model/Module/ModuleDto";
import { ModuleTable } from "./ModuleTable";
import { StatusDto } from "../../model/StatusDto";
import { HttpMethod } from "../../enum/HttpMethod";
import { ModuleEndpoint } from "../../enum/endpoint/ModuleEndpoint";



export default function Module() {
  const { showPopup } = usePopupActions();
  {/* Module Data */ }
  const [status, setStatus] = useState<StatusDto[]>([]);
  const [moduleDto, setModuleDto] = useState<ModuleDto[]>([]);
  const fetchModule = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, ModuleEndpoint.GET_SIO_LIST);
    if (res) {
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

  {/* Modals Module */ }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModalToggle = () => setIsModalOpen(false);

  {/* Module Status */ }
  const fetchStatus = async (ScpMac: string, SioNo: number) => {
    await HttpRequest.send(HttpMethod.GET, ModuleEndpoint.GET_SIO_STATUS + ScpMac + "/" + SioNo)
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

  return (
    <>
      {isModalOpen &&
        <Modals header="Edit Module" body={<EditModuleInputs data={moduleDto[0]} />} handleClickWithEvent={closeModalToggle} />
      }
      <PageBreadcrumb pageTitle="Module" />
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <ModuleTable setStatus={setStatus} data={moduleDto} statusDto={status} handleCheck={handleCheck} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} selectedObject={selectedObjects}/>
          </div>
        </div>

      </div>
    </>
  );
}
