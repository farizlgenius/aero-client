import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import Button from '../../components/ui/button/Button'
import TableTemplate from '../../components/tables/Tables/TableTemplate'
import ActionElement from '../UiElements/ActionElement'
import axios from 'axios'
import Pagination from '../../components/ui/table/Pagination'
import Search from '../../components/ui/table/Search'
import * as signalR from '@microsoft/signalr'


// Global Variable 
const server = import.meta.env.VITE_SERVER_IP;

// interface 
interface Object {
  [key: string]: any;
}
interface PageProp {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}



// Define header Table 
const headers: string[] = [
  "Date", "Time", "Source", "Source Number", "Description", "Additional"
]

// Define kwy Table 
const keys: string[] = [
  "date", "time", "source", "sourceNumber", "description", "additional"
]




const Event = () => {
  {/* Pagination */ }
  const [pageSize,setPageSize] = useState<number>(10);
  const [pagination, setPagination] = useState<PageProp>({
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
    totalPage: 0
  });
  const handleClickFirst = () => {
    fetchDataWithParams(1, 10);
  }

  const handleClickPrevious = () => {

    fetchDataWithParams(pagination.pageNumber - 1, pageSize);
  }

  const handleClickNext = () => {

    fetchDataWithParams(pagination.pageNumber + 1, pageSize);
  }

  const handleClickLast = () => {

    fetchDataWithParams(pagination.totalPage, pageSize);
  }

  const handlePageSizeSelect = (data:string) => {
    setPageSize(Number(data));
  }

  {/* Event Data */ }
  const [tableDatas, setTablesData] = useState<Object[]>([]);
  async function fetchData() {
    try {
      const res = await axios.get(`${server}/api/v1/event?PageNumber=1&PageSize=10`);
      console.log(res.data.data);
      setTablesData(res.data.data.data);
      setPagination(res.data.data.page);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchDataWithParams(pageNumber: number, pageSize: number) {
    try {
      const res = await axios.get(`${server}/api/v1/event?PageNumber=${pageNumber}&PageSize=${pageSize}`);
      console.log(res.data.data);
      setTablesData(res.data.data.data);
      setPagination(res.data.data.page);
    } catch (e) {
      console.log(e);
    }
  }

  {/* UseEffect */ }
  useEffect(() => {
    fetchData();
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5031/eventHub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Connected to SignalR event hub");
    });

    connection.on("eventTrig", (trig: boolean) => {
      fetchData();
    });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(()=>{
    fetchDataWithParams(1,pageSize)
  },[pageSize])


  return (
    <>
      <PageBreadcrumb pageTitle="Host Controller" />
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Search onSelectPageSize={handlePageSizeSelect} />
            <TableTemplate checkbox={false} tableHeaders={headers} tableDatas={tableDatas} tableKeys={keys} />
            <Pagination pageNumber={pagination.pageNumber} pageSize={pagination.pageSize} totalCount={pagination.totalCount} totalPage={pagination.totalPage} onClickFirst={handleClickFirst} onClickPrevious={handleClickPrevious} onClickLast={handleClickLast} onClickNext={handleClickNext} />

          </div>
        </div>


      </div>
    </>
  )
}

export default Event