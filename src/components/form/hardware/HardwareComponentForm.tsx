import { PropsWithChildren, useEffect, useState } from "react"
import Badge from "../../ui/badge/Badge"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table"
import SignalRService from "../../../services/SignalRService";
import { useToast } from "../../../context/ToastContext";
import { HardwareEndpoint } from "../../../endpoint/HardwareEndpoint";
import { send } from "../../../api/api";
import Helper from "../../../utility/Helper";
import { ToastMessage } from "../../../model/ToastMessage";
import { VerifyHardwareDeviceConfigDto } from "../../../model/Hardware/VerifyHardwareDeviceConfigDto";
import { HardwareDto } from "../../../model/Hardware/HardwareDto";

interface HardwareComponentFormInterface {
    data: HardwareDto;
}

export const HardwareComponentForm:React.FC<PropsWithChildren<HardwareComponentFormInterface>> = ({data}) => {
    const { toggleToast } = useToast();
    const [deviceConfig, setDeviceConfig] = useState<VerifyHardwareDeviceConfigDto[]>([]);

    const fetchData = async () => {
        const res = await send.post(HardwareEndpoint.VERIFY_COM(data.macAddress))
        if(res && res.data.data){
             setDeviceConfig(res.data.data)
        }
    }

    useEffect(() => {
        fetchData();
        var connection = SignalRService.getConnection();
        connection.on("DeviceConfiguration", (mac: string, location: number, mem: VerifyHardwareDeviceConfigDto[]) => {
            console.log(mem)
            setDeviceConfig(mem)
        });
        return () => { }
    }, [])
    useEffect(() => {

    })

    return (

        <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            {
                data.hardware_type == 1 ? 
                <div className="space-y-6">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Components
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                nMismatch Record
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {deviceConfig.map((a: VerifyHardwareDeviceConfigDto, i: number) => (
                            <TableRow key={i}>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                    {a.componentName}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                    {a.nMismatchRecord}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                    {a.isUpload ?
                                        <Badge color="error">Upload Require</Badge>
                                        :
                                        <Badge color="success">Sync</Badge>
                                    }

                                </TableCell>
                            </TableRow>

                        ))}

                    </TableBody>
                </Table>
            </div>

                :

                <div className="space-y-6">

                    <h1>Only Aero</h1>
                </div>


            }
        </div>
    )
}