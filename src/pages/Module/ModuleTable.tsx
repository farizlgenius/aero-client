import { PropsWithChildren, useEffect, useState } from "react"
import Badge from "../../components/ui/badge/Badge"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"
import { ModuleDto } from "../../model/Module/ModuleDto"
import React from "react"
import SignalRService from "../../services/SignalRService"
import { StatusDto } from "../../model/StatusDto"


// Sio Page
// Define Table Header
const MODULE_TABLE_HEADER: string[] = [
    "Address", "Model", "Tamper", "AC", "Battery", "Status", "Action"
]

// Define Keys
const MODULE_KEY: string[] = [
    "address", "model",
]


interface TableContent {
    data: ModuleDto[]
    statusDto: StatusDto[]
    handleEdit: (data: ModuleDto) => void
    handleRemove: (data: ModuleDto) => void
    handleCheck: (data: ModuleDto, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: ModuleDto[], e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedObject: ModuleDto[];
    setStatus: React.Dispatch<React.SetStateAction<StatusDto[]>>
}

export const ModuleTable: React.FC<PropsWithChildren<TableContent>> = ({ selectedObject, data, statusDto, handleEdit, handleRemove, handleCheck, handleCheckAll, setStatus }) => {
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [childRow, setChildRow] = useState<boolean>(false);
    const handleRowClick = () => {
        setChildRow(!childRow)
    }

    useEffect(() => {
        // Initialize SignalR as soon as app starts
        var connection = SignalRService.getConnection();
        connection.on(
            "SioStatus",
            (
                ScpMac: string,
                SioNo: number,
                Status: string,
                Tamper: string,
                Ac: string,
                Batt: string
            ) => {
                console.log(Status);
                console.log(Tamper);
                console.log(Ac);
                console.log(Batt);
                setStatus((prev) =>
                    prev.map((a) =>
                        a.macAddress == ScpMac && a.componentId == SioNo
                            ? {
                                ...a,
                                status: Status,
                                tamper: Tamper == null ? a.tamper : Tamper,
                                ac: Ac == null ? a.ac : Ac,
                                batt: Batt == null ? a.batt : Batt
                            }
                            : {
                                ...a
                            }
                    )
                );
                        toggleRefresh();
            }
        );

        return () => {
            //SignalRService.stopConnection()
        };
    }, [refresh]);
    return (<>
        <div className="max-h-[70vh] overflow-y-auto hidden-scroll">
            <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                    <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                            <input type="checkbox" onChange={(e) => handleCheckAll(data, e)} />
                        </TableCell>
                        {MODULE_TABLE_HEADER.map((head: string, i: number) =>
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
                    {data && data.map((data: ModuleDto, i: number) => (
                        <React.Fragment key={i}>
                            <TableRow className="cursor-pointer" onClickWithEvent={handleRowClick} key={i}>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => handleCheck(data, e)} />
                                </TableCell >
                                {MODULE_KEY.map((key: string, i: number) =>
                                    <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {String(data[key as keyof typeof data])}
                                    </TableCell>
                                )}
                                {/* Status */}
                                <>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                statusDto.find(b => b.componentId == data.componentId)?.tamper == "Active"
                                                    ? "success"
                                                    : statusDto.find(b => b.componentId == data.componentId)?.tamper == "Inactive"
                                                        ? "error"
                                                        : "warning"
                                            }
                                        >
                                            {statusDto.find(b => b.componentId == data.componentId)?.tamper == "" ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.tamper}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                statusDto.find(b => b.componentId == data.componentId)?.ac == "Active"
                                                    ? "success"
                                                    : statusDto.find(b => b.componentId == data.componentId)?.ac == "Inactive"
                                                        ? "error"
                                                        : "warning"
                                            }
                                        >
                                            {statusDto.find(b => b.componentId == data.componentId)?.ac == "" ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.ac}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                statusDto.find(b => b.componentId == data.componentId)?.batt == "Active"
                                                    ? "success"
                                                    : statusDto.find(b => b.componentId == data.componentId)?.batt == "Inactive"
                                                        ? "error"
                                                        : "warning"
                                            }
                                        >
                                            {statusDto.find(b => b.componentId == data.componentId)?.batt == "" ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.batt}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                statusDto.find(b => b.componentId == data.componentId)?.status == "Online" || statusDto.find(b => b.componentId == data.componentId)?.status == "Active"
                                                    ? "success"
                                                    : statusDto.find(b => b.componentId == data.componentId)?.status == "Offline"
                                                        ? "error"
                                                        : "warning"
                                            }
                                        >
                                            {statusDto.find(b => b.componentId == data.componentId)?.status == "" ? "Offline" : statusDto.find(b => b.componentId == data.componentId)?.status}
                                        </Badge>
                                    </TableCell>
                                </>

                                {/* Action */}
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div className="flex gap-2">
                                        <a id="edit" onClick={() => handleEdit(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                        <a id="remove" onClick={() => handleRemove(data)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {childRow &&
                                <TableRow key={data.uuid}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">123</TableCell>
                                </TableRow>
                            }
                        </React.Fragment>

                    ))}
                </TableBody>
            </Table>
        </div>
    </>)
}