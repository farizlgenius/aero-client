import React, { PropsWithChildren } from 'react'


interface PaginationProp {
  onSelectPageSize: (data: string) => void;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  onClickFirst: () => void;
  onClickPrevious: () => void;
  onClickNext: () => void;
  onClickLast: () => void;
}

const Pagination: React.FC<PropsWithChildren<PaginationProp>> = ({ onSelectPageSize,pageSize, pageNumber, totalCount, totalPage, onClickFirst, onClickLast, onClickPrevious, onClickNext }) => {
  return (
    <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 pb-3 xl:pb-0">

          <span className="text-gray-500 dark:text-gray-400">
            Show
          </span>
          <div className="relative z-20 bg-transparent">
            <select onChange={(e) => onSelectPageSize(e.target.value)} className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
              <option value="10" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                10
              </option>
              <option value="25" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                25
              </option>
              <option value="50" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                50
              </option>
              <option value="75" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                75
              </option>
              <option value="100" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                100
              </option>
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg className="stroke-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                </path>
              </svg>
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">
            entries
          </span>
        </div>
        <div className='flex items-center'>
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
              <button onClick={onClickPrevious} className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm" disabled>
                Previous
              </button>
            </>
            :
            <>
              <button onClick={onClickFirst} className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm">
                First
              </button>
              <button onClick={onClickPrevious} className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm">
                Previous
              </button>

            </>

          }

          {/* {pageNumber == 1
            &&
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded bg-brand-500 text-white flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500">
                {pageNumber - 1}
              </button>
            </div>
          } */}
          
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded bg-brand-500 text-white flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500">
              {pageNumber}
            </button>
          </div>
          {/* <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded bg-brand-500 text-white flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500">
              {pageNumber + 1}
            </button>
          </div> */}

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