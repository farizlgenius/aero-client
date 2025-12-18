import { PropsWithChildren, useEffect, useState } from "react";
import { FormProp, FormType } from "../../../model/Form/FormProp";
import { RoleDto } from "../../../model/Role/RoleDto";
import Button from "../../ui/button/Button";
import Label from "../Label";
import Input from "../input/InputField";
import HttpRequest from "../../../utility/HttpRequest";
import { HttpMethod } from "../../../enum/HttpMethod";
import { RoleEndpoint } from "../../../endpoint/RoleEndpoint";
import Switch from "../switch/Switch";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import { FeatureDto } from "../../../model/Role/FeatureDto";
import Checkbox from "../input/Checkbox";

export const RoleForm: React.FC<PropsWithChildren<FormProp<RoleDto>>> = ({ type, handleClick: handleClickWithEvent, dto, setDto }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const fetchFeatureList = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, RoleEndpoint.GET_FEATURE_LIST)
        console.log(res?.data.data)
        if (res && res.data.data) {
            // setList(res.data.data)
            if (type == FormType.Create) {
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
                        <Input disabled={type==FormType.Info} name="name" type="text" id="name" onChange={handleChange} value={dto.name} />
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
                                            <div className="flex gap-2 justify-center item-center">
                                                <Switch disabled={type==FormType.Info} label={""} onChange={(checked) => {
                                                    setDto(prev => ({
                                                        ...prev,
                                                        features: prev.features.map(a => ({
                                                            ...a,
                                                            isAllow: checked
                                                        }))
                                                    }));
                                                }} />
                                            </div>
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Features
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            <div className="flex justify-center item-center gap-2">

                                                <p>Create</p>
                                            </div>

                                        </TableCell >
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            <div className="flex justify-center item-center gap-2">

                                                <p>Modify</p>
                                            </div>
                                        </TableCell >
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            <div className="flex justify-center item-center gap-2">

                                                <p>Delete</p>
                                            </div>
                                        </TableCell >
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            <div className="flex justify-center item-center gap-2">

                                                <p>Action</p>
                                            </div>
                                        </TableCell >
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {dto.features.map((data: FeatureDto, i: number) => (
                                        <TableRow key={i}>
                                            {/* <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                <input name={String(data.value)} type="checkbox" />
                                            </TableCell > */}
                                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                <div className="flex gap-2 justify-center item-center">
                                                    <Switch disabled={type==FormType.Info} defaultChecked={data.isAllow} label={""} onChange={(checked) => {
                                                        setDto(prev => ({
                                                            ...prev,
                                                            features: prev.features.map(a => (
                                                                a.componentId == data.componentId ?
                                                                    {
                                                                        ...a,
                                                                        isAllow: checked,
                                                                        isCreate: !a.isAllow && false,
                                                                        isDelete: !a.isAllow && false,
                                                                        isModify: !a.isAllow && false,

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
                                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                {data.name}
                                            </TableCell>
                                            {data.isAllow &&
                                                <>
                                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                        <div className="flex justify-center item-center gap-2">
                                                            <Checkbox disabled={type==FormType.Info} name="isCreate" checked={data.isCreate} onChange={(e) => {
                                                                setDto(prev => ({
                                                                    ...prev,
                                                                    features: prev.features.map(a => (
                                                                        a.componentId == data.componentId ?
                                                                            {
                                                                                ...a,
                                                                                isCreate: e.target.checked
                                                                            }
                                                                            :
                                                                            {
                                                                                ...a
                                                                            }

                                                                    ))
                                                                }));
                                                            }} />
                                                        </div>

                                                    </TableCell >
                                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                        <div className="flex justify-center item-center gap-2">
                                                            <Checkbox disabled={type==FormType.Info} name="isModify" checked={data.isModify} onChange={(e) => {
                                                                setDto(prev => ({
                                                                    ...prev,
                                                                    features: prev.features.map(a => (
                                                                        a.componentId == data.componentId ?
                                                                            {
                                                                                ...a,
                                                                                isModify: e.target.checked
                                                                            }
                                                                            :
                                                                            {
                                                                                ...a
                                                                            }

                                                                    ))
                                                                }));
                                                            }} />
                                                        </div>


                                                    </TableCell >
                                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                        <div className="flex justify-center item-center gap-2">
                                                            <Checkbox disabled={type==FormType.Info} name="isDelete" checked={data.isDelete} onChange={(e) => {
                                                                setDto(prev => ({
                                                                    ...prev,
                                                                    features: prev.features.map(a => (
                                                                        a.componentId == data.componentId ?
                                                                            {
                                                                                ...a,
                                                                                isDelete: e.target.checked
                                                                            }
                                                                            :
                                                                            {
                                                                                ...a
                                                                            }

                                                                    ))
                                                                }));
                                                            }} />
                                                        </div>
                                                    </TableCell >
                                                                                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                        <div className="flex justify-center item-center gap-2">
                                                            <Checkbox disabled={type==FormType.Info} name="isAction" checked={data.isAction} onChange={(e) => {
                                                                setDto(prev => ({
                                                                    ...prev,
                                                                    features: prev.features.map(a => (
                                                                        a.componentId == data.componentId ?
                                                                            {
                                                                                ...a,
                                                                                isAction: e.target.checked
                                                                            }
                                                                            :
                                                                            {
                                                                                ...a
                                                                            }

                                                                    ))
                                                                }));
                                                            }} />
                                                        </div>
                                                    </TableCell >
                                                </>
                                            }

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                    </div>
                </div>
                <div className='mt-3 flex gap-2'>
                    <Button disabled={type == FormType.Info} onClickWithEvent={handleClickWithEvent} name={type == FormType.Update ? "update" : "create"} size='sm'>{type == FormType.Update ? "Update" : "Create"}</Button>
                    <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='cancel' size='sm'>Cancel</Button>
                </div>
            </div>
        </>
    )
}