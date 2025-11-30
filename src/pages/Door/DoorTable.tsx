import React, { PropsWithChildren, useEffect, useState } from "react"
import Badge from "../../components/ui/badge/Badge"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"
import { DoorDto } from "../../model/Door/DoorDto"
import { StatusDto } from "../../model/StatusDto"
import SignalRService from "../../services/SignalRService"

interface TableContent {
    data: DoorDto[]
    statusDto: StatusDto[]
    handleEdit: (data: DoorDto) => void
    handleRemove: (data: DoorDto) => void
    handleCheck: (data: DoorDto, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: DoorDto[], e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedObject: DoorDto[];
    setStatus: React.Dispatch<React.SetStateAction<StatusDto[]>>
}


// ACR Page
export const DOOR_TABLE_HEADER: string[] = ["Name", "Mode", "Status", "Action"]
export const DOOR_KEY: string[] = ["name"];

export const DoorTable: React.FC<PropsWithChildren<TableContent>> = ({ selectedObject, data, statusDto, handleEdit, handleRemove, handleCheck, handleCheckAll,setStatus }) => {
        const [refresh, setRefresh] = useState(false);
        const toggleRefresh = () => setRefresh(!refresh);

    return (
        <>
            <div className="max-h-[70vh] overflow-y-auto hidden-scroll">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                <input type="checkbox" onChange={(e) => handleCheckAll(data, e)} />
                            </TableCell>
                            {DOOR_TABLE_HEADER.map((head: string, i: number) =>
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
                        {data.map((data: DoorDto, i: number) => (
                            <TableRow key={i}>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => handleCheck(data, e)} />
                                </TableCell >
                                {DOOR_KEY.map((key: string, i: number) =>
                                    <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {String(data[key as keyof typeof data])}
                                    </TableCell>
                                )}
                                <>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <>
                                            <Badge size="sm" color="dark">{statusDto.find(b => b.componentId == data.componentId)?.tamper}</Badge>
                                        </>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <>
                                            {statusDto.find(b => b.componentId == data.componentId)?.status === "Secure" ? (
                                                <Badge size="sm" color="success">{statusDto.find(b => b.componentId == data.componentId)?.status}</Badge>
                                            ) : statusDto.find(b => b.componentId == data.componentId)?.status === "Forced Open" || statusDto.find(b => b.componentId == data.componentId)?.status === "Locked" ? (
                                                <Badge size="sm" color="error">{statusDto.find(b => b.componentId == data.componentId)?.status}</Badge>
                                            ) : (
                                                <Badge size="sm" color="warning">{statusDto.find(b => b.componentId == data.componentId)?.status === 0 ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.status}</Badge>
                                            )}
                                        </>
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
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}