import { PropsWithChildren, useEffect, useState } from "react";
import Badge from "../../components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { ControlPointDto } from "../../model/ControlPoint/ControlPointDto";
import SignalRService from "../../services/SignalRService";
import { StatusDto } from "../../model/StatusDto";
import { RelayMode } from "../../model/ControlPoint/RelayMode";


// CP Page
export const OUTPUT_TABLE_HEADER: string[] = ["Name", "Main Controller", "Module", "Mode", "Status", "Action"]
export const OUTPUT_KEY: string[] = ["name", "macAddress", "componentId", "relayMode"];

interface TableContent {
    data: ControlPointDto[]
    statusDto: StatusDto[]
    handleEdit: (data: ControlPointDto) => void
    handleRemove: (data: ControlPointDto) => void
    handleCheck: (data: ControlPointDto, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: ControlPointDto[], e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedObject: ControlPointDto[];
    setStatus: React.Dispatch<React.SetStateAction<StatusDto[]>>
}

export const ControlPointTable: React.FC<PropsWithChildren<TableContent>> = ({ selectedObject, data, statusDto, handleEdit, handleRemove, handleCheck, handleCheckAll,setStatus }) => {
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    // UseEffect 
    useEffect(() => {
            // Initialize SignalR as soon as app starts
        var connection = SignalRService.getConnection();
        connection.on("CpStatus",
            (scpMac: string, first: number, status: string) => {
                console.log(scpMac)
                console.log(first)
                console.log(status)
                setStatus((prev) =>
                    prev.map((a) =>
                        a.macAddress == scpMac && a.componentId == first
                            ? {
                                ...a,
                                status: status,
                            }
                            : {
                                // scpIp:ScpIp,
                                // cpNumber:first,
                                // status:status[0]
                                ...a
                            }
                    )
                );
                console.log(statusDto)
                toggleRefresh();
            });
        return () => {
            //SignalRService.stopConnection()
        };
    }, [refresh]);

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
                            {OUTPUT_TABLE_HEADER.map((head: string, i: number) =>
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
                        {data && data.map((data: ControlPointDto, i: number) => (
                            <TableRow key={i}>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => handleCheck(data, e)} />
                                </TableCell >
                                {OUTPUT_KEY.map((key: string, i: number) =>
                                    <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {key === "relayMode" ? data[key as keyof typeof data] == RelayMode.Normal ? "Normal" : "Inverted"  : String(data[key as keyof typeof data])}
                                    </TableCell>
                                )}
                                {/* Status */}
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Badge
                                        size="sm"
                                        color={
                                            statusDto.find(b => b.componentId == data.componentId)?.status == "Active"
                                                ? "success"
                                                : statusDto.find(b => b.componentId == data.componentId)?.status == "Inactive"
                                                    ? "error"
                                                    : "warning"
                                        }
                                    >
                                        {statusDto.find(b => b.componentId == data.componentId)?.status == "" ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.status}
                                    </Badge>
                                </TableCell>

                                {/* Action */}
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div className="flex gap-2">
                                        {/* <a id="edit" onClick={() => handleEdit(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a> */}
                                        <a id="remove" onClick={() => handleRemove(data)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}