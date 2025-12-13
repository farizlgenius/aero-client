
import { PropsWithChildren } from "react";
import { TransactionDto } from "../../../model/Transaction/TransactionDto";
import { TransactionFlagDto } from "../../../model/Transaction/TransactionFlagDto";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";



interface TableContents {
  tableHeaders: string[];
  tableDatas: TransactionDto[];
  tableKeys: string[];
}

const TransactionTable: React.FC<PropsWithChildren<TableContents>> = ({ tableHeaders, tableDatas, tableKeys }) => {
  return (
    <>
      <div className="max-h-[70vh] overflow-y-auto hidden-scroll">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
            <TableRow>
              {tableHeaders.map((head: string, i: number) =>
                <TableCell
                  key={i}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {head}
                </TableCell>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableDatas && tableDatas.map((data: TransactionDto, i: number) => (
              <TableRow key={i}>
                {tableKeys.map((key: string, i: number) =>
                  key == "transactionFlags" ?
                    <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {data.transactionFlags.map((a: TransactionFlagDto, i: number) => (
                        <TableRow>
                         { `[${a.topic}] ${a.description}\n`}
                        </TableRow>
                      ))}
                    </TableCell>
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