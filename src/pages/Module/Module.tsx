import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TableTemplate from "../../components/tables/Tables/TableTemplate";
import Modals from "../UiElements/Modals";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import ActionElement from "../UiElements/ActionElement";
import EditModuleInputs from "../../components/form/form-elements/EditModuleInputs";

// Get Global Variable

const server = import.meta.env.VITE_SERVER_IP;

// interface
interface Object {
  [key: string]: any
}

interface Sio {
  no: number;
  name: string;
  acFail: number;
  address: number;
  battFail: number;
  baudRate: number;
  model: string;
  protocol: number;
  scpIp: string;
  scpName: string;
  status: number;
  tamper: number;
  sioNumber: number;
}

interface StatusDto {
    scpIp: string;
    deviceNumber: number;
    status: number;
    tamper:number;
    ac:number;
    batt:number;
}


// Define Table Header
const headers: string[] = [
  "Name", "Hardware", "Model", "Tamper", "AC status", "Battery status", "Status", "Action"
]

// Define Keys
const keys: string[] = [
  "name", "scpName", "model", 
]

export default function Module() {
  {/* Module Data */ }
  const [status, setStatus] = useState<StatusDto[]>([]);
  const [tableDatas, setTableDatas] = useState<Sio[]>([]);
  const fetchModule = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/sio/all`);
      console.log(res.data.content)
      setTableDatas(res.data.content);
      res.data.content.map((a: Sio) => {
        setStatus(prev => [...prev, {
          scpIp: a.scpIp,
          deviceNumber: a.sioNumber,
          status: a.status,
          tamper: a.tamper,
          ac: a.acFail,
          batt: a.battFail
        }])
        fetchStatus(a.scpIp, a.sioNumber);
      });

    } catch (e) {
      console.log(e);
    }
  }

  {/* Modals Module */ }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModalToggle = () => setIsModalOpen(false);

  {/* Module Status */ }
  const fetchStatus = async (ScpIp: string, SioNo: number) => {
    const res = await axios.get(
      `http://localhost:5031/api/v1/sio/status?ScpIp=${ScpIp}&SioNo=${SioNo}`
    );
    console.log(res);
  };

  {/* Table Action*/ }
  const handleOnClickEdit = (data: Object) => {
    setIsModalOpen(true);
  }

  const handleOnClickRemove = (data: Object) => {

  }

  {/* checkBox */ }
  const [selectedObjects, setSelectedObjects] = useState<Object[]>([]);
  const handleCheckBoxAll =
    (data: Object[]) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setSelectedObjects) {
        if (e.target.checked) {
          setSelectedObjects(data);
        } else {
          setSelectedObjects([]);
        }
      }
    };
  const handleCheckBox =
    (data: Object) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setSelectedObjects) {
        if (e.target.checked) {
          setSelectedObjects((prev) => [...prev, data]);
        } else {
          setSelectedObjects((prev) =>
            prev.filter((item) => item.no !== data.no)
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
        ScpIp: string,
        SioNo: number,
        Status: number,
        Tamper: number,
        Ac: number,
        Batt: number
      ) => {
        console.log(Status);
        console.log(Tamper);
        console.log(Ac);
        console.log(Batt);
          setStatus((prev) =>
                    prev.map((a) =>
                        a.scpIp == ScpIp && a.deviceNumber == SioNo
                            ? {
                                ...a,
                                status: Status,
                                tamper:Tamper,
                                ac:Ac,
                                batt:Batt
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
            <TableTemplate statusDto={status} checkbox={false} tableHeaders={headers} tableDatas={tableDatas} tableKeys={keys} status={true} action={true} deviceIndicate={2} actionElement={(row) => (
              <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
            )} />

          </div>
        </div>

      </div>
    </>
  );
}
