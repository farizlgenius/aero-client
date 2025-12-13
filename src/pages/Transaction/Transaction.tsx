import  { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import TransactionTable from '../../components/tables/Tables/TransactionTable'
import Pagination from '../../components/ui/table/Pagination'
import Search from '../../components/ui/table/Search'
import { send } from '../../api/api'
import { TransactionEndpoint } from '../../endpoint/TransactionEndpoint'
import { TransactionDto } from '../../model/Transaction/TransactionDto'
import SignalRService from '../../services/SignalRService'


// Global Variable 



interface PageProp {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}



// Define header Table 
const headers: string[] = [
  "Date", "Time", "Source","Device","Actor","Decsription","More Detail", "Remark","Flags"
]

// Define kwy Table 
const keys: string[] = [
  "date", "time", "sourceModule","origin","actor","tranCodeDesc","extendDesc", "remark","transactionFlags"
]




const Transaction = () => {
  {/* Pagination */ }
  const [pageSize,setPageSize] = useState<number>(10);
  const [pagination, setPagination] = useState<PageProp>({
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
    totalPage: 0
  });
  const handleClickFirst = () => {
    fetchData(1, 10);
  }

  const handleClickPrevious = () => {

    fetchData(pagination.pageNumber - 1, pageSize);
  }

  const handleClickNext = () => {

    fetchData(pagination.pageNumber + 1, pageSize);
  }

  const handleClickLast = () => {

    fetchData(pagination.totalPage, pageSize);
  }

  const handlePageSizeSelect = (data:string) => {
    setPageSize(Number(data));
  }


  {/* Event Data */ }
  const [tableDatas, setTablesData] = useState<TransactionDto[]>([]);
  async function fetchData(pageNumber: number, pageSize: number) {
    const res = await send.get(TransactionEndpoint.GET_TRANSACTION(pageNumber,pageSize));
    if(res && res.data.data){
      console.log(res.data.data)
            setTablesData(res.data.data.data);
      setPagination(res.data.data.page);
    }
  }

  {/* UseEffect */ }
  useEffect(() => {
    fetchData(1,10);
    const connection = SignalRService.getConnection();
    connection.on("Transaction", () => {
      fetchData(1,10);
    });

  }, []);

  useEffect(()=>{
    fetchData(1,pageSize)
  },[pageSize])


  return (
    <>
      <PageBreadcrumb pageTitle="Events" />
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Search onSelectPageSize={handlePageSizeSelect} />
            <TransactionTable tableHeaders={headers} tableDatas={tableDatas} tableKeys={keys} />
            <Pagination pageNumber={pagination.pageNumber} pageSize={pagination.pageSize} totalCount={pagination.totalCount} totalPage={pagination.totalPage} onClickFirst={handleClickFirst} onClickPrevious={handleClickPrevious} onClickLast={handleClickLast} onClickNext={handleClickNext} />
          </div>
        </div>


      </div>
    </>
  )
}

export default Transaction