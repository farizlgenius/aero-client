import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import React, { PropsWithChildren, ReactNode } from "react";

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


interface TableContent {
  checkbox: boolean;
  tableHeaders: string[];
  tableDatas: Object[];
  tableKeys: string[];
  status?: boolean;
  action?: boolean;
  actionElement?: (data: Object) => ReactNode;
  onChecked?: (data: Object, e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedAll?: (data: Object[], e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedObject?: Object[];
  statusDto?: StatusDto[];
  deviceIndicate?: number;
}





const TableTemplate: React.FC<PropsWithChildren<TableContent>> = ({ checkbox, tableHeaders, tableDatas, tableKeys, status = false, action = false, actionElement, deviceIndicate = 0, onChecked, onCheckedAll, selectedObject, statusDto }) => {
  {/* Doors */ }
  const renderDoorStatusComponent = (data: Object, indicator: number, statusDto: StatusDto[]) => {
    switch (indicator) {
      case 0:
        const s = statusDto.find(b => b.deviceNumber == data["acrNumber"])?.status;
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
        const d = statusDto.find(b => b.deviceNumber == data["acrNumber"])?.tamper;
        return <>
        <Badge size="sm" color="dark">{d}</Badge>
        </>
    }
  }
  {/* Module */ }
  const renderModuleStatusComponent = (data: Object, indicator: number, statusDto: StatusDto[]) => {
    switch (indicator) {
      case 0:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["sioNumber"])?.status == 5
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["sioNumber"])?.status == 0
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["sioNumber"])?.status == 5 ? "Online" : statusDto.find(b => b.deviceNumber == data["sioNumber"])?.status == 0 ? "Offline" : "Error"}
        </Badge>
      case 1:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["sioNumber"])?.tamper == 0
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["sioNumber"])?.tamper == 1
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["sioNumber"])?.tamper == 0 ? "Normal" : statusDto.find(b => b.deviceNumber == data["sioNumber"])?.tamper == 1 ? "Fail" : "Error"}
        </Badge>
      case 2:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["sioNumber"])?.ac == 0
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["sioNumber"])?.ac == 1
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["sioNumber"])?.ac == 0 ? "Normal" : statusDto.find(b => b.deviceNumber == data["sioNumber"])?.ac == 1 ? "Fail" : "Error"}
        </Badge>
      case 3:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["sioNumber"])?.batt == 0
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["sioNumber"])?.batt == 1
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["sioNumber"])?.batt == 0 ? "Normal" : statusDto.find(b => b.deviceNumber == data["sioNumber"])?.batt == 1 ? "Fail" : "Error"}
        </Badge>
    }

  }

  const renderStatusCompoment = (data: Object, deviceIndicate: number, moduleIndicate: number, statusDto: StatusDto[]) => {
    switch (deviceIndicate) {
      case 1:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["scpId"])?.status == 1
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["scpId"])?.status == 0
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["scpId"])?.status == 1 ? "Online" : data.status === 0 ? "Offline" : "Pending"}
        </Badge>
      case 2:
        return renderModuleStatusComponent(data, moduleIndicate, statusDto)
      case 3:
        return data["mode"] == "Normal" ? <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["cpNumber"])?.status == 1
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["cpNumber"])?.status == 0
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["cpNumber"])?.status == 1 ? "On" : statusDto.find(b => b.deviceNumber == data["cpNumber"])?.status === 0 ? "Off" : "Error"}
        </Badge> :
          <Badge
            size="sm"
            color={
              statusDto.find(b => b.deviceNumber == data["cpNumber"])?.status == 0
                ? "success"
                : statusDto.find(b => b.deviceNumber == data["cpNumber"])?.status == 1
                  ? "error"
                  : "warning"
            }
          >
            {statusDto.find(b => b.deviceNumber == data["cpNumber"])?.status == 0 ? "On" : statusDto.find(b => b.deviceNumber == data["cpNumber"])?.status === 1 ? "Off" : "Error"}
          </Badge>
      case 4:
        return <Badge
          size="sm"
          color={
            statusDto.find(b => b.deviceNumber == data["mpNumber"])?.status == 0
              ? "success"
              : statusDto.find(b => b.deviceNumber == data["mpNumber"])?.status == 1
                ? "error"
                : "warning"
          }
        >
          {statusDto.find(b => b.deviceNumber == data["mpNumber"])?.status == 0 ? "Normal" : statusDto.find(b => b.deviceNumber == data["mpNumber"])?.status == 1 ? "Fail" : "Error"}
        </Badge>
      case 5:
        return renderDoorStatusComponent(data, moduleIndicate, statusDto);

    }
  }

  function isStringArray(data: any): data is string[] {
    return Array.isArray(data) && data.every(item => typeof item === 'string');
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
            {tableDatas.map((data, i) => (
              <TableRow key={i}>
                {checkbox && onChecked &&
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => onChecked(data, e)} />
                  </TableCell >
                }

                {tableKeys.map((key, i) =>
                  <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data[key]}
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
                    {actionElement(data)}
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