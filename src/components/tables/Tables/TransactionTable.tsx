
import { PropsWithChildren, useMemo, useState } from "react";
import { TransactionDto } from "../../../model/Transaction/TransactionDto";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { TableSpecialDisplay } from "../../../model/TableSpecialDisplay";


type SortDirection = "asc" | "desc";

interface TableContents {
  tableHeaders: string[];
  tableDatas: TransactionDto[];
  tableKeys: string[];
  specialDisplay?:TableSpecialDisplay<TransactionDto>[];
}

const TransactionTable: React.FC<PropsWithChildren<TableContents>> = ({ tableHeaders, tableDatas, tableKeys, specialDisplay }) => {
  const [sortKey, setSortKey] = useState<string>("dateTime");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedDatas = useMemo(() => {
    const normalizedValue = (value: unknown) => {
      if (value === null || value === undefined) return "";
      if (typeof value === "number") return value;
      return String(value).toLowerCase();
    };

    const data = [...tableDatas];
    data.sort((a, b) => {
      const aValue = normalizedValue(a[sortKey as keyof TransactionDto]);
      const bValue = normalizedValue(b[sortKey as keyof TransactionDto]);

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [tableDatas, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  return (
    <>
      <div className="max-h-[70vh] overflow-auto scrollbar-thin scrollbar-transparent">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
            <TableRow>
              {tableHeaders.map((head: string, i: number) => {
                const key = tableKeys[i];
                const isActive = sortKey === key;
                return (
                <TableCell
                  key={i}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <button
                    type="button"
                    onClick={() => handleSort(key)}
                    className="group inline-flex items-center gap-1.5 transition-colors hover:text-brand-500"
                  >
                    <span>{head}</span>
                    <span className={`inline-flex flex-col leading-none ${isActive ? "text-brand-500" : "text-gray-400 group-hover:text-brand-500"}`}>
                      <svg className={`h-2 w-2 ${isActive && sortDirection === "asc" ? "opacity-100" : "opacity-40"}`} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
                      </svg>
                      <svg className={`h-2 w-2 ${isActive && sortDirection === "desc" ? "opacity-100" : "opacity-40"}`} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 8L2 4H8L5 8Z" fill="currentColor" />
                      </svg>
                    </span>
                  </button>
                </TableCell>
              )})}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {sortedDatas.length === 0 && (
              <TableRow>
                <TableCell className="px-4 py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400" colspan={tableHeaders.length}>
                  No event records found
                </TableCell>
              </TableRow>
            )}
            {sortedDatas && sortedDatas.map((data: TransactionDto, i: number) => (
              <TableRow key={i} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                {tableKeys.map((key: string, i: number) =>
                  key == "transactionFlags" ?
                    <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {/* {data.transactionFlags.map((a: TransactionFlagDto, i: number) => (
                        <TableRow key={i}>
                         { `[${a.topic}] ${a.description}\n`}
                        </TableRow>
                      ))} */}
                      {/* {
                        data.transactionFlags.map((a: TransactionFlagDto, i: number) => (
                          <>
                          <Badge key={i} color="success" variant="light">
                            {a.description}
                          </Badge>
                          <br/>
                          </>
                          
                        ))
                      } */}
                      -
                    </TableCell>
                    :
                    specialDisplay?.some(a => a.key == key) ?
                      specialDisplay.find(a => a.key == key)?.content(data, i)
                      :
                      <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {String(data[key as keyof typeof data])}
                      </TableCell>

                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
export default TransactionTable;
