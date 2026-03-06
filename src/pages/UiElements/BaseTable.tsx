import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Search from "../../components/ui/table/Search";
import { TableProp } from "../../model/TableProp";
import { EditIcon, Info2Icon, TrashBinIcon } from "../../icons";
import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/ui/table/Pagination";
import { usePagination } from "../../context/PaginationContext";
import React from "react";
import { useLocation } from "../../context/LocationContext";



export const BaseTable = <T extends Record<string, any>>({ headers, keys, data, onEdit, onInfo, onRemove, setSelect, renderOptionalComponent, specialDisplay, onClick: handleClick, permission, action, status, select, subTable, fetchData,refresh,locationId }: TableProp<T>) => {
    const {search,startDate,endDate,pageSize,pagination,setPageSize} = usePagination();
    const [show, setShow] = useState<number>(-1)
    const [sortKey, setSortKey] = useState<string>(keys?.[0] ?? "");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const toSortableValue = (value: unknown): number | string => {
        if (value === null || value === undefined) return "";
        if (typeof value === "number") return value;
        if (typeof value === "boolean") return value ? 1 : 0;
        if (value instanceof Date) return value.getTime();

        const str = String(value).trim();
        const parsedDate = Date.parse(str);
        if (!Number.isNaN(parsedDate) && /[\d]/.test(str)) {
            return parsedDate;
        }
        return str.toLowerCase();
    };

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        const next = [...data];
        next.sort((a, b) => {
            const aValue = toSortableValue(a[sortKey as keyof T]);
            const bValue = toSortableValue(b[sortKey as keyof T]);

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
            }

            const result = String(aValue).localeCompare(String(bValue));
            return sortDirection === "asc" ? result : -result;
        });
        return next;
    }, [data, sortKey, sortDirection]);

    const handleSort = (key: string) => {
        if (!key) return;
        if (sortKey === key) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
        setShow(-1);
    };

     const handleClickFirst = () => {
            fetchData(1, 10,locationId,search, startDate,endDate);
      }

      const handleClickPrevious = () => {
            fetchData(pagination.pageNumber - 1, pageSize,locationId,search, startDate,endDate);
      }

      const handleClickNext = () => {

            fetchData(pagination.pageNumber + 1, pageSize,locationId,search, startDate,endDate);
      }

      const handleClickLast = () => {

            fetchData(pagination.totalPage, pageSize,locationId,search, startDate,endDate);
      }

      const handlePageSizeSelect = (data: string) => {
            setPageSize(Number(data));
      }


    const handleCheckAll = (data: T[], e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelect(data);
        } else {
            setSelect([]);
        }

    }

    const handleCheck = (data: T, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelect((prev) => [...prev, data]);
        } else {
            setSelect((prev) =>
                prev.filter((item) => item.componentId !== data.componentId)
            );
        }

    }

     useEffect(() => {
        fetchData(1, pageSize, locationId,search, startDate)
    }, [refresh,pageSize,search,startDate,locationId])


    return (
        <>
            <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Search action={action} onClick={handleClick} permission={permission} />
                    <div className="max-h-[70vh] overflow-y-auto hidden-scroll">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        <input type="checkbox" onChange={(e) => handleCheckAll(sortedData, e)} />
                                    </TableCell>
                                    {headers && headers.map((head: string, i: number) => {
                                        const key = keys?.[i] ?? "";
                                        const isActive = sortKey === key;
                                        return (
                                        <TableCell
                                            key={i}
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleSort(key)}
                                                className="group inline-flex items-center gap-1.5 transition-colors hover:text-brand-500"
                                            >
                                                <span>{head}</span>
                                                <span className={`text-[10px] tracking-wide ${isActive ? "text-brand-500" : "text-gray-400 group-hover:text-brand-500"}`}>
                                                    {isActive ? (sortDirection === "asc" ? "ASC" : "DESC") : "SORT"}
                                                </span>
                                            </button>
                                        </TableCell>
                                    )})}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {sortedData && sortedData.map((data: T, i: number) => (
                                    <React.Fragment key={i}>
                                        <TableRow key={i} className="cursor-pointer hover:bg-gray-900 active:bg-gray-800" onClickWithEvent={() => {
                                            if (show !== i) {
                                                setShow(i);
                                            } else {
                                                setShow(-1);
                                            }

                                        }}>
                                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                <input checked={select?.includes(data)} type="checkbox" onChange={(e) => handleCheck(data, e)} />
                                            </TableCell >
                                            {keys && keys.map((key: string, i: number) =>
                                                specialDisplay?.some(a => a.key == key) ?
                                                    specialDisplay.find(a => a.key == key)?.content(data, i)
                                                    :
                                                    <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {String(data[key as keyof typeof data])}
                                                    </TableCell>
                                            )}
                                            {status && renderOptionalComponent && renderOptionalComponent(data, status, i)}


                                            {/* Action */}
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="flex gap-2">

                                                    <a id="detail" onClick={() => onInfo(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                        <Info2Icon className="w-10 h-5" />
                                                    </a>
                                                    {permission?.isModify  &&
                                                        <a id="edit" onClick={() => onEdit(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                            <EditIcon className="w-10 h-5" />

                                                        </a>
                                                    }
                                                    {
                                                        permission?.isDelete  &&

                                                        <a id="remove" onClick={() => onRemove(data)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline"><TrashBinIcon className="w-10 h-5" /></a>
                                                    }


                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {show == i && subTable && subTable(i + 1)}
                                    </React.Fragment>


                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Pagination onSelectPageSize={handlePageSizeSelect} pageNumber={pagination.pageNumber} pageSize={pagination.pageSize} totalCount={pagination.totalCount} totalPage={pagination.totalPage} onClickFirst={handleClickFirst} onClickPrevious={handleClickPrevious} onClickLast={handleClickLast} onClickNext={handleClickNext} />
                    {/* <PaginationNew /> */}
                </div>
            </div>


        </>
    )
}
