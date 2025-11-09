import { PropsWithChildren, useEffect, useState } from "react";
import { MonitorPointDto } from "../../model/MonitorPoint/MonitorPointDto";
import SignalRService from "../../services/SignalRService";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { StatusDto } from "../../model/StatusDto";

// MP Page
export const MP_TABLE_HEADER:string[] = [ "Name", "Main Controller", "Module" ,"Mode","Masked", "Status", "Action"]
export const MP_KEY:string[] = ["name", "macAddress", "moduleId","monitorPointMode","isMask"];

interface TableContent {
    data: MonitorPointDto[]
    statusDto: StatusDto[]
    handleEdit: (data: MonitorPointDto) => void
    handleRemove: (data: MonitorPointDto) => void
    handleCheck: (data: MonitorPointDto, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: MonitorPointDto[], e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedObject: MonitorPointDto[];
    setStatus: React.Dispatch<React.SetStateAction<StatusDto[]>>
}


export const MonitorPointTable: React.FC<PropsWithChildren<TableContent>> = ({ selectedObject, data, statusDto, handleEdit, handleRemove, handleCheck, handleCheckAll,setStatus })  => {
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    // UseEffect 
    useEffect(() => {
            // Initialize SignalR as soon as app starts
        var connection = SignalRService.getConnection();
        connection.on( "MpStatus",
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
                            {MP_TABLE_HEADER.map((head: string, i: number) =>
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
                        {data && data.map((data: MonitorPointDto, i: number) => (
                            <TableRow key={i}>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => handleCheck(data, e)} />
                                </TableCell >
                                {MP_KEY.map((key: string, i: number) =>
                                    <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {String(data[key as keyof typeof data])}
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
    );
} 