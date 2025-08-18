import { ChangeEvent, PropsWithChildren, useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Button from "../../ui/button/Button.tsx";
import axios from "axios";
import { useNavigate } from "react-router";

const server = import.meta.env.VITE_SERVER_IP;

// Interface

interface ScpDto {
  no: number;
  scpId: number;
  name: string;
  model: string;
  mac: string;
  ipAddress: string;
  serialNumber: string;
  status: number; // 1 -> online , 0 -> offline
}

interface FormProps {
  data: ScpDto;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isDetail:boolean;
}


const AddHostForm: React.FC<PropsWithChildren<FormProps>> = ({ data, onChange,isDetail=false }) => {
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await axios.post(`${server}/api/v1/scp/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status == 201 || res.status == 200) {
        navigate("/host");
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    console.log(data.serialNumber);
  })
  return (
    <ComponentCard title="Add Host">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Host Name</Label>
          <Input name="name" value={data.name} type="text" id="name" onChange={onChange} />
        </div>
        <div>
          <Label htmlFor="scpID">scpID</Label>
          <Input name="scpID" value={data.scpId} type="text" id="scpID" onChange={onChange} isReadOnly={true} />
        </div>
        <div>
          <Label htmlFor="mac">Mac Address</Label>
          <Input name="mac" value={data.mac} type="text" id="mac" onChange={onChange} isReadOnly={true} />
        </div>
        <div>
          <Label htmlFor="Ip">Ip Address</Label>
          <Input name="ip" value={data.ipAddress} type="text" id="Ip" onChange={onChange} isReadOnly={true} />
        </div>
        <div>
          <Label htmlFor="serialnumber">Serial Number</Label>
          <Input name="serialnumber" value={data.serialNumber} type="text" id="serialnumber" onChange={onChange} isReadOnly={true} />
        </div>
        <div className="hidden">
          <Label htmlFor="model">Model</Label>
          <Input name="model" value={data.model} type="text" id="model" onChange={onChange} isReadOnly={true} />
        </div>
        <div className="flex justify-center">
          {isDetail 
          
          ?
          <Button disabled className="w-50" size="sm">Submit </Button>
           :
           <Button className="w-50" size="sm">Submit </Button>
           }
          
        </div>
      </form>
    </ComponentCard>
  );
}

export default AddHostForm;