import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import React, { ReactNode } from "react";
import { IntervalDto, StatusDto } from "../../../constants/types";
import { TableContent } from "../../../constants/constant";



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
  let tableData: any;
  {/* Doors */ }
  const renderDoorStatusComponent = (data: T, indicator: number, statusDto: StatusDto[]) => {
    switch (indicator) {
      case 0:
        const s = statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status;
        return <>
          {s === "Secure" ? (
            <Badge size="sm" color="success">{s}</Badge>
          ) : s === "Forced Open" || s === "Locked" ? (
            <Badge size="sm" color="error">{s}</Badge>
          ) : (
            <Badge size="sm" color="warning">{s}</Badge>
          )}
        </>

      case 1:
        const d = statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.tamper;
        return <>
          <Badge size="sm" color="dark">{d}</Badge>
        </>
    }
  }
  {/* Module */ }
  const renderModuleStatusComponent = (data: T, indicator: number, statusDto: StatusDto[]) => {
    switch (indicator) {
      case 0:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status == "Online" || statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status == "Active"
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status == "Offline"
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status == "" ? "Offline" : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status}
        </Badge>
      case 1:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.tamper == "Active"
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.tamper == "Inactive"
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.tamper == "" ? "Error" : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.tamper}
        </Badge>
      case 2:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.ac == "Active"
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.ac == "Inactive"
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.ac == "" ? "Error" : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.ac}
        </Badge>
      case 3:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.batt == "Active"
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.batt == "Inactive"
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.batt == "" ? "Error" : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.batt}
        </Badge>
    }

  }

  const renderStatusCompoment = (data: T, deviceIndicate: number, moduleIndicate: number, statusDto: StatusDto[]) => {
    switch (deviceIndicate) {
      // SCP Controller
      case 1:
        return <>{data["isReset" as keyof T] == true ?
          <Badge
            size="sm"
            color="warning"
          >
            Pedning Restart
          </Badge>
          : data["isUpload" as keyof T] == true ?
            <Badge
              size="sm"
              color="warning"
            >
              Pending Upload
            </Badge>
            :
            <Badge
              size="sm"
              color={
                statusDto.find(b => b.scpMac == data["mac" as keyof T])?.status == 1
                  ? "success"
                  : statusDto.find(b => b.scpMac == data["mac" as keyof T])?.status == 0
                    ? "error"
                    : "warning"
              }
            >
              {statusDto.find(b => b.scpMac == data["mac" as keyof T])?.status == 1 ? "Online" : statusDto.find(b => b.scpMac == data["mac" as keyof T])?.status === 0 ? "Offline" : "Pending"}
            </Badge>

        }

        </>
      case 2:
        // Module
        return renderModuleStatusComponent(data, moduleIndicate, statusDto)
      case 3:
      case 4:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status == "Active"
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status == "Inactive"
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status == "" ? "Error" : statusDto.find(b => b.deviceNumber == data["componentNo" as keyof T])?.status}
        </Badge>
      case 5:
        // Door
        return renderDoorStatusComponent(data, moduleIndicate, statusDto);

    }
  }
  
  switch (deviceIndicate) {
    case TableContent.INTERVAL:
      tableData = tableDatas as unknown as IntervalDto[];
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
                {tableData && tableData.map((data: any, i: number) => (
                  <TableRow key={i}>
                    {tableKeys.map((key: string, i: number) =>
                      key == "days" ?
                        <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex gap-5">
                            <p className={data.days.sunday ? "text-green-500" : "text-gray-700"} >
                              Sun
                            </p>
                            <p className={data.days.monday ? "text-green-500" : "text-gray-700"}>
                              Mon
                            </p>
                            <p className={data.days.tuesday ? "text-green-500" : "text-gray-700"}>
                              Tue
                            </p>
                            <p className={data.days.wednesday ? "text-green-500" : "text-gray-700"}>
                              Wed
                            </p>
                            <p className={data.days.thursday ? "text-green-500" : "text-gray-700"}>
                              Thu
                            </p>
                            <p className={data.days.friday ? "text-green-500" : "text-gray-700"}>
                              Fri
                            </p>
                            <p className={data.days.saturday ? "text-green-500" : "text-gray-700"}>
                              Sat
                            </p>
                          </div>
                        </TableCell>
                        :
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
    default:
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
                    {/* Status */}
                    {status && statusDto && deviceIndicate == 2 &&
                      <>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {renderStatusCompoment(data, deviceIndicate, 1, statusDto)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {renderStatusCompoment(data, deviceIndicate, 2, statusDto)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {renderStatusCompoment(data, deviceIndicate, 3, statusDto)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {renderStatusCompoment(data, deviceIndicate, 0, statusDto)}
                        </TableCell>
                      </>
                    }
                    {status && statusDto && deviceIndicate == 5 &&
                      <>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {renderStatusCompoment(data, deviceIndicate, 1, statusDto)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {renderStatusCompoment(data, deviceIndicate, 0, statusDto)}
                        </TableCell>

                      </>
                    }
                    {status && statusDto && deviceIndicate != 2 && deviceIndicate != 5 &&
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {renderStatusCompoment(data, deviceIndicate, 0, statusDto)}
                      </TableCell>
                    }
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
}
export default TableTemplate;