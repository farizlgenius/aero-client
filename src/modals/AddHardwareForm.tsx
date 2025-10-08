import { PropsWithChildren, useEffect, useState } from "react";

import { AddScpDto } from "../constants/types.ts";
import ComponentCard from "../components/common/ComponentCard.tsx";
import Label from "../components/form/Label.tsx";
import Input from "../components/form/input/InputField.tsx";
import Button from "../components/ui/button/Button.tsx";




interface FormProps {
  data: AddScpDto;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit:() => void
  isDetail:boolean;
}


const AddHardwareForm: React.FC<PropsWithChildren<FormProps>> = ({ data,handleSubmit, handleChange,isDetail=false }) => {


  return (
    <ComponentCard title="Add Host">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Hardware Name</Label>
          <Input name="name" value={data.name} type="text" id="name" onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="componentNo">scpId</Label>
          <Input name="componentNo" value={data.componentNo} type="text" id="componentNo" onChange={handleChange} isReadOnly={true} />
        </div>
        <div>
          <Label htmlFor="mac">Mac Address</Label>
          <Input name="mac" value={data.mac} type="text" id="mac" onChange={handleChange} isReadOnly={true} />
        </div>
        <div>
          <Label htmlFor="Ip">Ip Address</Label>
          <Input name="ip" value={data.ip} type="text" id="Ip" onChange={handleChange} isReadOnly={true} />
        </div>
        <div>
          <Label htmlFor="serialnumber">Serial Number</Label>
          <Input name="serialnumber" value={data.serialNumber} type="text" id="serialnumber" onChange={handleChange} isReadOnly={true} />
        </div>
        <div >
          <Label htmlFor="model">Model</Label>
          <Input name="model" value={data.model} type="text" id="model" onChange={handleChange} isReadOnly={true} />
        </div>
        <div className="flex justify-center">
          {isDetail 
          
          ?
          <Button disabled className="w-50" size="sm">Submit </Button>
           :
           <Button onClick={handleSubmit} className="w-50" size="sm">Submit </Button>
           }
          
        </div>
      </div>
    </ComponentCard>
  );
}

export default AddHardwareForm;