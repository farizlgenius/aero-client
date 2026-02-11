import { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import TransactionTable from '../../components/tables/Tables/TransactionTable'
import Pagination from '../../components/ui/table/Pagination'
import { send } from '../../api/api'
import { TransactionEndpoint } from '../../endpoint/TransactionEndpoint'
import { TransactionDto } from '../../model/Transaction/TransactionDto'
import SignalRService from '../../services/SignalRService'
import DatePicker from '../../components/form/date-picker'
import { PageProp } from '../../model/PageProp'
import { useLocation } from '../../context/LocationContext'
import { TableCell } from '../../components/ui/table'
import { CalenderIcon, TimeIcon } from '../../icons'
import { Avatar } from '../UiElements/Avatar'



// Define header Table 
const headers: string[] = [
  "Date", "Source", "Device", "Actor", "Decsription", "More Detail", "Remark"
]

// Define kwy Table 
const keys: string[] = [
  "dateTime", "sourceModule", "origin", "actor", "tranCodeDesc", "extendDesc", "remark"
]




const Transaction = () => {
  {/* Pagination */ }
  const { locationId } = useLocation();
  const [search, setSearch] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [pagination, setPagination] = useState<PageProp>({
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
    totalPage: 0
  });
  const handleClickFirst = () => {
    fetchData(1, 10, search, startDate);
  }

  const handleClickPrevious = () => {

    fetchData(pagination.pageNumber - 1, pageSize, search, startDate);
  }

  const handleClickNext = () => {

    fetchData(pagination.pageNumber + 1, pageSize, search, startDate);
  }

  const handleClickLast = () => {

    fetchData(pagination.totalPage, pageSize, search, startDate);
  }

  const handlePageSizeSelect = (data: string) => {
    setPageSize(Number(data));
  }


  {/* Event Data */ }
  const [tableDatas, setTablesData] = useState<TransactionDto[]>([]);
  async function fetchData(pageNumber: number, pageSize: number, search?: string, startDate?: string, endDate?: string) {
    const res = await send.get(TransactionEndpoint.GET(pageNumber, pageSize, locationId, search, startDate, endDate));
    if (res && res.data.data) {
      console.log(res.data.data)
      setTablesData(res.data.data.data);
      setPagination(res.data.data.page);
    }
  }

  {/* UseEffect */ }
  useEffect(() => {
    fetchData(1, pageSize);
    const connection = SignalRService.getConnection();
    connection.on("EVENT.TRIGGER", () => {
      fetchData(1, pageSize);
    });

  }, []);

  useEffect(() => {
    fetchData(1, pageSize, search, startDate)
  }, [pageSize, search, startDate])

  // const toLocalISOWithOffset = (date: Date) => {
  //       const pad = (n: number) => String(n).padStart(2, "0");
  //       const tzOffset = -date.getTimezoneOffset();
  //       const sign = tzOffset >= 0 ? "+" : "-";
  //       const offsetHours = pad(Math.floor(Math.abs(tzOffset) / 60));
  //       const offsetMinutes = pad(Math.abs(tzOffset) % 60);

  //       return (
  //           date.getFullYear() + "-" +
  //           pad(date.getMonth() + 1) + "-" +
  //           pad(date.getDate()) + "T" +
  //           pad(date.getHours()) + ":" +
  //           pad(date.getMinutes()) + ":" +
  //           pad(date.getSeconds()) +
  //           sign + offsetHours + ":" + offsetMinutes
  //       );
  //   }

  const toLocalDateWithOffset = (date: Date): Date => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs);
  };




  return (
    <>
      <PageBreadcrumb pageTitle="Events" />
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            {/* Header */}
            <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center shadow-theme-xs">
                  <DatePicker
                    id="startDate"
                    placeholder="Start date"
                    // value={credentialDto.activeDate}
                    onChange={(dates, currentDateString) => {
                      // Handle your logic
                      console.log({ dates, currentDateString });
                      // setCredentialDto(prev => ({ ...prev, activeDate: toLocalISOWithOffset(dates[0]) }));
                      const date = new Date(dates[0]);
                      const iso = date.toISOString(); // ✅ UTC, ISO
                      setStartDate(iso);

                    }}
                  />
                </div>
                <div className="inline-flex items-center shadow-theme-xs">
                  <DatePicker
                    id="endDate"
                    placeholder="End date"
                    // value={credentialDto.activeDate}
                    onChange={(dates, currentDateString) => {
                      // Handle your logic
                      console.log({ dates, currentDateString });
                      // setCredentialDto(prev => ({ ...prev, activeDate: toLocalISOWithOffset(dates[0]) }));

                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" fill="">
                      </path>
                    </svg>
                  </button>
                  <input onChange={e => {
                    console.log(e.target.value)
                    setSearch(e.target.value)
                  }} placeholder="Search..." className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]" type="text" />
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 ">
                  Download
                  <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.0018 14.083C9.7866 14.083 9.59255 13.9924 9.45578 13.8472L5.61586 10.0097C5.32288 9.71688 5.32272 9.242 5.61552 8.94902C5.90832 8.65603 6.3832 8.65588 6.67618 8.94868L9.25182 11.5227L9.25182 3.33301C9.25182 2.91879 9.5876 2.58301 10.0018 2.58301C10.416 2.58301 10.7518 2.91879 10.7518 3.33301L10.7518 11.5193L13.3242 8.94866C13.6172 8.65587 14.0921 8.65604 14.3849 8.94903C14.6777 9.24203 14.6775 9.7169 14.3845 10.0097L10.5761 13.8154C10.4385 13.979 10.2323 14.083 10.0018 14.083ZM4.0835 13.333C4.0835 12.9188 3.74771 12.583 3.3335 12.583C2.91928 12.583 2.5835 12.9188 2.5835 13.333V15.1663C2.5835 16.409 3.59086 17.4163 4.8335 17.4163H15.1676C16.4102 17.4163 17.4176 16.409 17.4176 15.1663V13.333C17.4176 12.9188 17.0818 12.583 16.6676 12.583C16.2533 12.583 15.9176 12.9188 15.9176 13.333V15.1663C15.9176 15.5806 15.5818 15.9163 15.1676 15.9163H4.8335C4.41928 15.9163 4.0835 15.5806 4.0835 15.1663V13.333Z" fill="currentColor">
                    </path>
                  </svg>
                </button>
              </div>
            </div>
            <TransactionTable tableHeaders={headers} tableDatas={tableDatas} tableKeys={keys} specialDisplay={[
              {
                key: "dateTime",
                content: (data, i) => <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {/* <span className='flex gap-2'>
                    {<CalenderIcon className="w-5 h-5" />} {new Intl.DateTimeFormat("en-GB").format(new Date(data.dateTime))}  {<TimeIcon className="w-5 h-5" />}  {new Date(data.dateTime).toTimeString().split(" ")[0]}
                  </span> */}
                  {/* <span className='flex gap-2'>
                    {<TimeIcon className="w-5 h-5" />} {new Date(data.dateTime).toTimeString().split(" ")[0]}
                  </span> */}
                  <span className='flex gap-2'>
                   {new Intl.DateTimeFormat("en-GB").format(new Date(data.dateTime))}  {new Date(data.dateTime).toTimeString().split(" ")[0]}
                  </span>
                  
                </TableCell>
              }, {
                key: "actor",
                content: (data, i) => <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {
                    !data.image || data.image != "" && (
                      <div className='flex items-center gap-2'>
                        <div className="cursor-pointer w-11 h-11 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                          <Avatar userId={data.image} />
                        </div>
                        {data.actor}
                      </div>
                    )
                  }

                </TableCell>
              }
            ]} />
            <Pagination onSelectPageSize={handlePageSizeSelect} pageNumber={pagination.pageNumber} pageSize={pagination.pageSize} totalCount={pagination.totalCount} totalPage={pagination.totalPage} onClickFirst={handleClickFirst} onClickPrevious={handleClickPrevious} onClickLast={handleClickLast} onClickNext={handleClickNext} />
          </div>
        </div>


      </div>
    </>
  )
}

export default Transaction