import { ReactNode, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TableTemplate from "../../components/tables/Tables/TableTemplate";
import Button from "../../components/ui/button/Button";
import { Scan } from "../../icons";
import Modals from "../UiElements/Modals";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import ActionElement from "../UiElements/ActionElement";
import AddHostForm from "../../components/form/form-elements/AddHostForm";

// Get Global Variable

const server = import.meta.env.VITE_SERVER_IP;

// Interface
interface Object {
  [key: string]: any
}

interface IdReport {
  deviceID: number;
  serialNumber: number;
  scpID: number;
  configFlag: number;
  macAddress: string;
  ip: string;
  model: string;
}

interface ScpDto {
  no: number;
  scpId: number;
  name: string;
  model: string;
  mac: string;
  ipAdress: string;
  serialnumber: string;
  status: number; // 1 -> online , 0 -> offline
}

interface StatusDto {
    scpIp: string;
    deviceNumber: number;
    status: number;
    tamper:number;
    ac:number;
    batt:number;
}

// Define IdReport Parameter
const IdReportKeys: string[] = [
  "deviceID",
  'macAddress',
  'scpID',
  'ip'
]

const IdReportHeaders: string[] = [
  "Model", "Mac address", "Id", "Ip address", "Action"
]

// Define Table Header
const headers: string[] = [
  "Name", "Model", "Mac address", "Ip address", "Status", "Action"
]

// Define Table Keys
const keys: string[] = [
  "name", "model", "mac", "ipAdress"
]



export default function Hardware() {

  let ScanTableTemplate: ReactNode;
  

  {/* UseEffect */ }
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5031/scpHub")
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

  useEffect(() => {

  },[])

  {/* Modal Handler */ }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseAddModal = () => setIsModalAddOpen(false);
  const handleOpenModal = () => {
    fetchIdReport();
    setIsModalOpen(true);
  };

  {/* IdReport */ }
  const [idReportList, setIdReportList] = useState<IdReport[]>([]);
  const [idReport, setIdReport] = useState<Object>({});
  const handleAddIdReport = async (data: Object) => {
    setIdReport(data);
    console.log(data);
    setIsModalOpen(false);
    setIsModalAddOpen(true);
  }
  const fetchIdReport = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/scp/report/all`);
      console.log(res.data.content)
      setIdReportList(res.data.content);

    } catch (e) {
      console.log(e);
    }
  }
  ScanTableTemplate = <TableTemplate checkbox={false} tableDatas={idReportList} tableHeaders={IdReportHeaders} tableKeys={IdReportKeys} status={false} action={true} actionElement={(row) => (
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
      const res = await axios.get(`${server}/api/v1/scp/all`);
      console.log(res.data.content);
      setTableDatas(res.data.content);

      // Batch set state
      const newStatuses = res.data.content.map((a: ScpDto) => ({
        scpIp: a.ipAdress,
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
  const fetchStatus = async (scpId:number) => {
    try {
      const res = await axios.get(`${server}/api/v1/scp/status/${scpId}`);
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
  {/* Handle Action Table*/ }
  const handleOnEditClick = (data: Object) => {

  }
  const handleOnRemoveClick = (data: Object) => {

  }

  return (
    <>
      {isModalOpen &&
        <Modals header="Host List" body={ScanTableTemplate} closeToggle={handleCloseModal} />
      }
      {isModalAddOpen &&
        <Modals header="Add Host" body={<AddHostForm data={idReport} />} closeToggle={handleCloseAddModal} />
      }

      <PageBreadcrumb pageTitle="Hardware" />
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button
            onClick={handleOpenModal}
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

            <TableTemplate deviceIndicate={1} statusDto={status} checkbox={false} tableHeaders={headers} tableDatas={tableDatas} tableKeys={keys} status={true} action={true} actionElement={(data) => (
              <ActionElement onEditClick={handleOnEditClick} onRemoveClick={handleOnRemoveClick} data={data} />

            )} />

          </div>
        </div>

      </div>
    </>
  );
}
