import { StatusDto } from "../../../model/StatusDto";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import React, { ReactNode } from "react";




interface TableContents<T> {
  checkbox: boolean;
  tableHeaders: string[];
  tableDatas: T[];
  tableKeys: string[];
  status?: boolean;
  action?: boolean;
  actionElement?: (data: T, isDetail: boolean) => ReactNode;
  onChecked?: (data: T, e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedAll?: (data: T[], e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedObject?: T[];
  statusDto?: StatusDto[];
  deviceIndicate?: number;
  isDetail?: boolean;
}





const TableTemplate = <T,>({ checkbox, tableHeaders, tableDatas, tableKeys, status = false, action = false, actionElement, deviceIndicate = 0, onChecked, onCheckedAll, selectedObject, statusDto, isDetail = false }: TableContents<T>) => {
return (
        <>
          <div className="max-h-[70vh] overflow-y-auto hidden-scroll">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                <TableRow>
                  {checkbox && onCheckedAll &&
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      <input type="checkbox" onChange={(e) => onCheckedAll(tableDatas, e)} />
                    </TableCell>
                  }
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
                {tableDatas && tableDatas.map((data: any, i: number) => (
                  <TableRow key={i}>
                    {checkbox && onChecked &&
                      <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => onChecked(data, e)} />
                      </TableCell >
                    }
                    {tableKeys.map((key: string, i: number) =>
                      <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {String(data[key as keyof typeof data])}
                      </TableCell>
                    )}
                    {/* Action */}
                    {action && actionElement &&
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {actionElement(data, isDetail)}
                      </TableCell>
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      );
}
export default TableTemplate;