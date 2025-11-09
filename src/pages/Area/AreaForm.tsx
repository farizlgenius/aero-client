import React, { PropsWithChildren } from "react";
import { AreaDto } from "../../model/Area/AreaDto";
import ComponentCard from "../../components/common/ComponentCard";

interface AreaFormProp {
  isUpdate: boolean,
  handleClickWithEvent: (e: React.MouseEvent<HTMLButtonElement>) => void,
  setAreaDto: React.Dispatch<React.SetStateAction<AreaDto>>;
  data: AreaDto
}

export const AreaForm:React.FC<PropsWithChildren<AreaFormProp>> = ({handleClickWithEvent,setAreaDto,data}) => {
     return (
    <ComponentCard title="Add Area">
        <></>
    </ComponentCard >
  )
}