import { PropsWithChildren } from "react";
import { AreaDto } from "../../model/Area/AreaDto";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

export const AREA_TABLE_HEAD:string[] = [
    "Name","Bits","Facility" ,"Action"
]
export const AREA_KEY:string[] = [
    "name","bits","facility", 
];


interface TableContent {
    data: AreaDto[]
    handleEdit: (data: AreaDto) => void
    handleRemove: (data: AreaDto) => void
    handleCheck: (data: AreaDto, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: AreaDto[], e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedObject: AreaDto[];
}


export const AreaTable:React.FC<PropsWithChildren<TableContent>> = ({ selectedObject, data, handleEdit, handleRemove, handleCheck, handleCheckAll }) => {
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
                            {AREA_TABLE_HEAD.map((head: string, i: number) =>
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
                        {data && data.map((data: AreaDto, i: number) => (
                            <TableRow key={i}>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => handleCheck(data, e)} />
                                </TableCell >
                                {AREA_KEY.map((key: string, i: number) =>
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
    )
}