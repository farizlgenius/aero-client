import { PropsWithChildren, useEffect, useState } from "react";
import Badge from "../../components/ui/badge/Badge"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"
import { HardwareDto } from "../../model/Hardware/HardwareDto";
import SignalRService from "../../services/SignalRService";
import { StatusDto } from "../../model/StatusDto";

const HARDWARE_TABLE_HEADER = ["Name", "Model", "Mac address", "Ip address", "Status", "Action"];
const HARDWARE_TABLE_KEY = ["name", "model", "macAddress", "ipAddress"];

interface TableContent {
    data: HardwareDto[]
    statusDto: StatusDto[]
    handleEdit:(data:HardwareDto)=>void
    handleRemove:(data:HardwareDto) => void
    handleCheck: (data: HardwareDto, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: HardwareDto[], e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedObject: HardwareDto[];
}

export const HardwareTable: React.FC<PropsWithChildren<TableContent>> = ({ selectedObject,data, statusDto,handleEdit,handleRemove,handleCheck,handleCheckAll }) => {
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    // UseEffect 
    useEffect(() => {
            // Initialize SignalR as soon as app starts
        var connection = SignalRService.getConnection();
        connection.on("SyncStatus",toggleRefresh);
        return () => {
            //SignalRService.stopConnection()
        };
    }, []);

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
                            {HARDWARE_TABLE_HEADER.map((head: string, i: number) =>
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
                        {data && data.map((data: HardwareDto, i: number) => (
                            <TableRow key={i}>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => handleCheck(data, e)} />
                                </TableCell >
                                {HARDWARE_TABLE_KEY.map((key: string, i: number) =>
                                    <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {String(data[key as keyof typeof data])}
                                    </TableCell>
                                )}
                                {/* Status */}
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <>
                                        {data.isReset == true ?
                                            <Badge
                                                size="sm"
                                                color="warning"
                                            >
                                                Pending Restart
                                            </Badge>
                                            : data.isUpload == true ?
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
                                                        statusDto.find(b => b.macAddress == data.macAddress)?.status == 1
                                                            ? "success"
                                                            : statusDto.find(b => b.macAddress == data.macAddress)?.status == 0
                                                                ? "error"
                                                                : "warning"
                                                    }
                                                >
                                                    {statusDto.find(b => b.macAddress == data.macAddress)?.status == 1 ? "Online" : statusDto.find(b => b.macAddress == data.macAddress)?.status == 0 ? "Offline" : statusDto.find(b => b.macAddress == data.macAddress)?.status}
                                                </Badge>
                                        }

                                    </>
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
    )
}