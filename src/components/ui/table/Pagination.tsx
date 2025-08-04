import React, { PropsWithChildren } from 'react'


interface PaginationProp {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  onClickFirst:()=>void;
  onClickPrevious:()=>void;
  onClickNext:()=>void;
  onClickLast:()=>void;
}

const Pagination: React.FC<PropsWithChildren<PaginationProp>> = ({ pageSize, pageNumber, totalCount, totalPage,onClickFirst,onClickLast,onClickPrevious,onClickNext }) => {
  return (
    <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
        <div className="pb-3 xl:pb-0">
          <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
           Total {totalCount} Records
          </p>
        </div>
        <div className="flex items-center justify-center">
          {pageNumber == 1 ?
            <>
              <button onClick={onClickFirst} className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm" disabled>
                First
              </button>
              <button  onClick={onClickPrevious} className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm" disabled>
                Previous
              </button>
            </>
            :
            <>
              <button  onClick={onClickFirst} className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm">
                First
              </button>
              <button onClick={onClickPrevious} className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm">
                Previous
              </button>

            </>

          }


          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded bg-brand-500 text-white flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500">
              {pageNumber}
            </button>
          </div>

          {pageNumber == totalPage ?

            <>
              <button onClick={onClickNext} className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]" disabled>
                Next
              </button>
              <button onClick={onClickLast} className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]" disabled>
                Last
              </button>
            </>
            :
            <>
              <button onClick={onClickNext} className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
                Next
              </button>
              <button onClick={onClickLast} className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
                Last
              </button>

            </>
          }

        </div>
      </div>
    </div>
  )
}

export default Pagination