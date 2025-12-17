import { PropsWithChildren, useEffect, useState } from "react"
import Badge from "../../ui/badge/Badge"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table"
import SignalRService from "../../../services/SignalRService"
import { MemoryAllocateDto } from "../../../model/Hardware/MemoryAllocateDto"
import { send } from "../../../api/api"
import { HardwareEndpoint } from "../../../endpoint/HardwareEndpoint"
import Helper from "../../../utility/Helper"
import { ToastMessage } from "../../../model/ToastMessage"
import { useToast } from "../../../context/ToastContext"
import { HardwareDto } from "../../../model/Hardware/HardwareDto"

interface HardwareMemAllocFormInterface {
    data:HardwareDto;
}

export const HardwareMemAllocForm:React.FC<PropsWithChildren<HardwareMemAllocFormInterface>> = ({data}) => {
    const {toggleToast} = useToast();
    const [memAllocs, setMemAllocs] = useState<MemoryAllocateDto[]>([]);

    const fetchData = async () => {
        const res = await send.post(HardwareEndpoint.VERIFY_MEM(data.macAddress))
        if(Helper.handleToastByResCode(res,ToastMessage.GET_SCP_STRUCTURE,toggleToast)){}
    }

    useEffect(() => {
        fetchData();
        var connection = SignalRService.getConnection();
        connection.on("MemoryAllocate", (mac:string,mem: MemoryAllocateDto[]) => {
            console.log(mem)
            setMemAllocs(mem)
        });
        return () => { }
    }, [])

    return (

        <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="space-y-6">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Structure Type
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                HW Record Allocate
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                nRecSize
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                HW Active Record
                            </TableCell>
                                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                SW Record Allocate
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {memAllocs.map((a: MemoryAllocateDto, i: number) => (
                            <TableRow key={i}>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                    {a.strType}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                    {a.nRecord}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                    {a.nRecSize}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                    {a.nActive}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                    {a.nSwAlloc}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                    {a.isSync ?
                                <Badge color="success">Sync</Badge>
                                :
                                <Badge color="error">Not Sync</Badge>
                                }
                                    
                                </TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}