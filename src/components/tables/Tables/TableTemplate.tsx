import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import React, { ReactNode } from "react";
interface Object {
  [key: string]: any
}

interface StatusDto {
  scpIp: string;
  deviceNumber: number;
  status: number | string;
  tamper: number | string;
  ac: number;
  batt: number;
}


interface TableContent<T> {
  checkbox: boolean;
  tableHeaders: string[];
  tableDatas: T[];
  tableKeys: string[];
  status?: boolean;
  action?: boolean;
  actionElement?: (data:T,isDetail:boolean) => ReactNode;
  onChecked?: (data:T, e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedAll?: (data: T[], e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedObject?: T[];
  statusDto?: StatusDto[];
  deviceIndicate?: number;
  isDetail?:boolean;
}





const TableTemplate = <T,>({ checkbox, tableHeaders, tableDatas, tableKeys, status = false, action = false, actionElement, deviceIndicate = 0, onChecked, onCheckedAll, selectedObject, statusDto,isDetail=false }:TableContent<T>) => {
  {/* Doors */ }
  const renderDoorStatusComponent = (data: T, indicator: number, statusDto: StatusDto[]) => {
    switch (indicator) {
      case 0:
        const s = statusDto.find(b => b.deviceNumber == data["acrNumber" as keyof T])?.status;
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
        const d = statusDto.find(b => b.deviceNumber == data["acrNumber" as keyof T])?.tamper;
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
            statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.status == 5
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.status == 0
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.status == 5 ? "Online" : statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.status == 0 ? "Offline" : "Error"}
        </Badge>
      case 1:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.tamper == 0
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.tamper == 1
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.tamper == 0 ? "Normal" : statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.tamper == 1 ? "Fail" : "Error"}
        </Badge>
      case 2:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.ac == 0
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.ac == 1
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.ac == 0 ? "Normal" : statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.ac == 1 ? "Fail" : "Error"}
        </Badge>
      case 3:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.batt == 0
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.batt == 1
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.batt == 0 ? "Normal" : statusDto.find(b => b.deviceNumber == data["sioNumber" as keyof T])?.batt == 1 ? "Fail" : "Error"}
        </Badge>
    }

  }

  const renderStatusCompoment = (data: T, deviceIndicate: number, moduleIndicate: number, statusDto: StatusDto[]) => {
    switch (deviceIndicate) {
      // SCP Controller
      case 1:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["scpId" as keyof T])?.status == 1
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["scpId" as keyof T])?.status == 0
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["scpId" as keyof T])?.status == 1 ? "Online" : statusDto.find(b => b.deviceNumber == data["scpId" as keyof T])?.status === 0 ? "Offline" : "Pending"}
        </Badge>
      case 2:
        // Module
        return renderModuleStatusComponent(data, moduleIndicate, statusDto)
      case 3:
        // Control Point
        return data["mode" as keyof T] == "Normal" ? <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["cpNumber" as keyof T])?.status == 1
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["cpNumber" as keyof T])?.status == 0
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["cpNumber" as keyof T])?.status == 1 ? "On" : statusDto.find(b => b.deviceNumber == data["cpNumber" as keyof T])?.status === 0 ? "Off" : "Error"}
        </Badge> :
          <Badge
            size="sm"
            color={
              statusDto.find(b => b.deviceNumber == data["cpNumber" as keyof T])?.status == 0
                ? "success"
                : statusDto.find(b => b.deviceNumber == data["cpNumber" as keyof T])?.status == 1
                  ? "error"
                  : "warning"
            }
          >
            {statusDto.find(b => b.deviceNumber == data["cpNumber" as keyof T])?.status == 0 ? "On" : statusDto.find(b => b.deviceNumber == data["cpNumber" as keyof T])?.status === 1 ? "Off" : "Error"}
          </Badge>
      case 4:
        // Monitor Point
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["mpNumber" as keyof T])?.status == 0
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["mpNumber" as keyof T])?.status == 1
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["mpNumber" as keyof T])?.status == 0 ? "Normal" : statusDto.find(b => b.deviceNumber == data["mpNumber" as keyof T])?.status == 1 ? "Fail" : "Error"}
        </Badge>
      case 5:
        // Door
        return renderDoorStatusComponent(data, moduleIndicate, statusDto);

    }
  }


  return (
    <>
      <div className="max-h-[70vh] overflow-y-auto">
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
            {tableDatas.map((data, i:number) => (
              <TableRow key={i}>
                {checkbox && onChecked &&
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => onChecked(data, e)} />
                  </TableCell >
                }
                

                {tableKeys.map((key:string, i:number) =>
                  <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {String(data[key as keyof typeof data])}
                  </TableCell>
                )}

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



                {action && actionElement &&
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {actionElement(data,isDetail)}
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