import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { FormContent } from "../../model/Form/FormContent";
import { BaseForm } from "../UiElements/BaseForm";
import { BaseTable } from "../UiElements/BaseTable";
import { TriggerDto } from "../../model/Trigger/TriggerDto";

export const Trigger = () => {
const [create,setCreate] = useState<boolean>(false);
    const [update,setUpdate] = useState<boolean>(false);
    const [selectedObject,setSelectedObjects] = useState<TriggerDto[]>([]);
    const [triggerDtos,setTriggerDtos] = useState<TriggerDto[]>([]);

    const handleEdit = (data:TriggerDto) => {

    }

    const handleCheck = (data: TriggerDto, e: React.ChangeEvent<HTMLInputElement>) => {

    }

    const handleCheckAll = (data: TriggerDto[], e: React.ChangeEvent<HTMLInputElement>) => {

    }

        const handleRemove = (data:TriggerDto) => {

    }

    const handleClick = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {

    }

    const tabContent:FormContent[] = []

    return (
    <>
    <PageBreadcrumb pageTitle="Trigger"/>
    {
        create || update ? 
        <BaseForm tabContent={tabContent}/>
        :
        <BaseTable<TriggerDto> data={triggerDtos} handleEdit={handleEdit} handleRemove={handleRemove} handleCheck={handleCheck} handleCheckAll={handleCheckAll} handleClick={handleClick} selectedObject={selectedObject}  />

    }

    </>
)
}