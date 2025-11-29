import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Search from "../../components/ui/table/Search";
import { TableProp } from "../../model/TableProp";
import { PaginationNew } from "../../components/ui/table/PaginationNew";
import { EditIcon, Info2Icon, TrashBinIcon } from "../../icons";
import React, { JSX } from "react";
import { StatusDto } from "../../model/StatusDto";

interface PageProp {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPage: number;
}


export const BaseTable = <T extends Record<string, any>>({ headers, keys, data, handleCheck, handleCheckAll, handleEdit, handleRemove, selectedObject, renderOptionalComponent, specialDisplay, handleClick, permission, action,status }: TableProp<T>) => {

    const handlePageSizeSelect = (data: string) => {
        // setPageSize(Number(data));
    }
   

    console.log(status)
    console.log(data)
    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Search action={action} onClick={handleClick} onSelectPageSize={handlePageSizeSelect} permission={permission} />
                    <div className="max-h-[70vh] overflow-y-auto hidden-scroll">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        <input type="checkbox" onChange={(e) => handleCheckAll(data, e)} />
                                    </TableCell>
                                    {headers && headers.map((head: string, i: number) =>
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
                                {data && data.map((data: T, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            <input checked={selectedObject?.includes(data)} type="checkbox" onChange={(e) => handleCheck(data, e)} />
                                        </TableCell >
                                        {keys && keys.map((key: string, i: number) =>
                                            specialDisplay?.some(a => a.key == key) ?
                                                specialDisplay.find(a => a.key == key)?.content(data, i)
                                                :
                                                <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {String(data[key as keyof typeof data])}
                                                </TableCell>
                                        )}
                                        {status && renderOptionalComponent && renderOptionalComponent(data,status)}


                                        {/* Action */}
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex gap-2">

                                                <a id="detail" onClick={() => handleEdit(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                    <Info2Icon className="w-10 h-5" />
                                                </a>
                                                {permission?.isModify &&
                                                    <a id="edit" onClick={() => handleEdit(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                        <EditIcon className="w-10 h-5" />

                                                    </a>
                                                }
                                                {
                                                    permission?.isDelete &&

                                                    <a id="remove" onClick={() => handleRemove(data)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline"><TrashBinIcon className="w-10 h-5" /></a>
                                                }


                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* <TableRow>23</TableRow> */}
                                {/* <hr/> */}
                            </TableBody>
                        </Table>
                    </div>
                    {/* <Pagination pageNumber={pagination.pageNumber} pageSize={pagination.pageSize} totalCount={pagination.totalCount} totalPage={pagination.totalPage} onClickFirst={handleClickFirst} onClickPrevious={handleClickPrevious} onClickLast={handleClickLast} onClickNext={handleClickNext} /> */}
                    <PaginationNew />
                </div>
            </div>


        </>
    )
}