import { PropsWithChildren } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { IntervalDto } from "../../model/Interval/IntervalDto";


// Interval Page
export const INTERVAL_TABLE_HEAD: string[] = ["Start Time", "End Time", "Days", "Action"]
export const INTERVAL_KEY: string[] = ["startTime", "endTime", "days"];

interface TableContent {
    data: IntervalDto[]
    handleEdit: (data: IntervalDto) => void
    handleRemove: (data: IntervalDto) => void
    handleCheck: (data: IntervalDto, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: IntervalDto[], e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedObject: IntervalDto[];
}


export const IntervalTable: React.FC<PropsWithChildren<TableContent>> = ({ selectedObject, data, handleEdit, handleRemove, handleCheck, handleCheckAll }) => {
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
                            {INTERVAL_TABLE_HEAD.map((head: string, i: number) =>
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
                        {data && data.map((data: IntervalDto, i: number) => (
                            <TableRow key={i}>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => handleCheck(data, e)} />
                                </TableCell >
                                {INTERVAL_KEY.map((key: string, i: number) =>
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