import { PropsWithChildren, useEffect, useState } from "react";
import { FormProp } from "../../../model/Form/FormProp";
import { RoleDto } from "../../../model/Role/RoleDto";
import Button from "../../ui/button/Button";
import Label from "../Label";
import Input from "../input/InputField";
import HttpRequest from "../../../utility/HttpRequest";
import { HttpMethod } from "../../../enum/HttpMethod";
import { RoleEndpoint } from "../../../enum/endpoint/RoleEndpoint";
import Switch from "../switch/Switch";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import { FeatureDto } from "../../../model/Role/FeatureDto";

export const RoleForm: React.FC<PropsWithChildren<FormProp<RoleDto>>> = ({ isUpdate, handleClickWithEvent, dto, setDto }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const fetchFeatureList = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, RoleEndpoint.GET_FEATURE_LIST)
        console.log(res?.data.data)
        if (res && res.data.data) {
            // setList(res.data.data)
            if(!isUpdate){
                setDto(prev => ({ ...prev, features: res.data.data }))
            } 
        }
    }

    useEffect(() => {
        fetchFeatureList();
    }, []);
    return (
        <>
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" type="text" id="name" onChange={handleChange} value={dto.name} />
                    </div>
                </div>
                <div className='flex gap-2 mb-3 w-3/4'>

                    <div className='flex-1'>
                        <div >
                            <Table>
                                {/* Table Header */}
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Features
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            <div className="flex gap-2 justify-center item-center">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Read All</label>
                                                <Switch label="Edit All" onChange={(checked) => {
                                                    setDto(prev => ({
                                                        ...prev,
                                                        features: prev.features.map(a => ({
                                                            ...a,
                                                            isWritable: checked
                                                        }))
                                                    }));
                                                }} />
                                            </div>
                                        </TableCell>

                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {dto.features.map((data: FeatureDto, i: number) => (
                                        <TableRow key={i}>
                                            {/* <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                <input name={String(data.value)} type="checkbox" />
                                            </TableCell > */}
                                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                {data.name}
                                            </TableCell>
                                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                <div className="flex gap-2 justify-center item-center">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Read</label>
                                                    <Switch defaultChecked={data.isWritable} label="Edit" onChange={(checked) => {
                                                        setDto(prev => ({
                                                            ...prev,
                                                            features: prev.features.map(a => (
                                                                a.componentId == data.componentId ?
                                                                    {
                                                                        ...a,
                                                                        isWritable: checked
                                                                    }
                                                                    :
                                                                    {
                                                                        ...a
                                                                    }

                                                            ))
                                                        }));
                                                    }} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                    </div>
                </div>
                <div className='mt-3 flex gap-2'>
                    <Button onClickWithEvent={handleClickWithEvent} name={isUpdate ? "update" : "create"} size='sm'>{isUpdate ? "Update" : "Create"}</Button>
                    <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='cancel' size='sm'>Cancel</Button>
                </div>
            </div>
        </>
    )
}