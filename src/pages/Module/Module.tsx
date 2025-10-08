import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TableTemplate from "../../components/tables/Tables/TableTemplate";
import Modals from "../UiElements/Modals";
import * as signalR from "@microsoft/signalr";
import ActionElement from "../UiElements/ActionElement";
import EditModuleInputs from "../../components/form/form-elements/EditModuleInputs";
import { SioDto, StatusDto } from "../../constants/types";
import { HttpMethod, PopUpMsg, SIO_KEY, SIO_TABLE_HEADER, SioEndPoint } from "../../constants/constant";
import HttpRequest from "../../utility/HttpRequest";
import { usePopupActions } from "../../utility/PopupCalling";
import Helper from "../../utility/Helper";



export default function Module() {
  const { showPopup } = usePopupActions();
  {/* Module Data */ }
  const [status, setStatus] = useState<StatusDto[]>([]);
  const [tableDatas, setTableDatas] = useState<SioDto[]>([]);
  const fetchModule = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, SioEndPoint.GET_SIO_LIST);
    if (res) {
      //Helper.handlePopup(res, PopUpMsg.GET_MODULE_STATUS, showPopup)
        console.log(res.data.data)
        setTableDatas(res.data.data);
        const newStatuses = res.data.data.map((a: SioDto) => ({
          scpMac: a.mac,
          deviceNumber: a.componentNo,
          status: 0,
          tamper: "",
          ac: "",
          batt: ""
        }));

        console.log(newStatuses);

        setStatus((prev) => [...prev, ...newStatuses]);

        // Fetch status for each
        res.data.data.forEach((a: SioDto) => {
          fetchStatus(a.mac, a.componentNo);
        });
        

    }

  }

  {/* Modals Module */ }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModalToggle = () => setIsModalOpen(false);

  {/* Module Status */ }
  const fetchStatus = async (ScpMac: string, SioNo: number) => {
    const res = await HttpRequest.send(HttpMethod.GET, SioEndPoint.GET_SIO_STATUS + ScpMac + "/" + SioNo)
    //Helper.handlePopup(res, PopUpMsg.GET_MODULE_STATUS, showPopup)
  };

  {/* Table Action*/ }
  const handleOnClickEdit = (data: Object) => {
    setIsModalOpen(true);
  }

  const handleOnClickRemove = (data: Object) => {

  }

  {/* checkBox */ }
  const [selectedObjects, setSelectedObjects] = useState<SioDto[]>([]);
  const handleCheckBoxAll =
    (data: SioDto[]) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setSelectedObjects) {
        if (e.target.checked) {
          setSelectedObjects(data);
        } else {
          setSelectedObjects([]);
        }
      }
    };
  const handleCheckBox =
    (data: SioDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setSelectedObjects) {
        if (e.target.checked) {
          setSelectedObjects((prev) => [...prev, data]);
        } else {
          setSelectedObjects((prev) =>
            prev.filter((item) => item.componentNo !== data.componentNo)
          );
        }
      }
    };
  {/* UseEffect */ }
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5031/sioHub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Connected to SignalR event hub");
    });
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
            a.scpMac == ScpMac && a.deviceNumber == SioNo
              ? {
                ...a,
                status: Status,
                tamper: Tamper == null ? a.tamper : Tamper,
                ac: Ac == null ? a.ac : Ac,
                batt: Batt == null ? a.batt : Batt
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
    );
    setTimeout(() => {
      fetchModule();
    }, 250);
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <>
      {isModalOpen &&
        <Modals header="Edit Module" body={<EditModuleInputs data={tableDatas[0]} />} closeToggle={closeModalToggle} />
      }
      <PageBreadcrumb pageTitle="Module" />
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <TableTemplate statusDto={status} checkbox={false} tableHeaders={SIO_TABLE_HEADER} tableDatas={tableDatas} tableKeys={SIO_KEY} status={true} action={true} deviceIndicate={2} actionElement={(row) => (
              <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
            )} />

          </div>
        </div>

      </div>
    </>
  );
}
