import { PropsWithChildren, useState } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Button from "../../ui/button/Button.tsx";
import axios from "axios";
import { useNavigate } from "react-router";

const server = import.meta.env.VITE_SERVER_IP;

// Interface
interface Object {
  [key: string]: any
}

interface FormProps {
  data:Object;
}


const EditModuleInputs:React.FC<PropsWithChildren<FormProps>> = ({data}) => {
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget);
    const form = e.currentTarget;
    const data = new FormData(form);
    try{
      const res = await axios.post(`${server}/api/v1/scp/create`,data,{
         headers:{
          'Content-Type':'multipart/form-data'
        }
      });
      if(res.status == 201 || res.status == 200){
        navigate("/host");
      }
    }catch(e){
      console.log(e);
    }
  }
  return (
    <ComponentCard title="Edit Module">
      <form onSubmit={handleSubmit}  className="space-y-6">
        <div>
          <Label htmlFor="name">Host Name</Label>
          <Input name="name" type="text" id="name" />
        </div>
                <div>
          <Label htmlFor="scpID">scpID</Label>
          <Input name="scpID" value={data["scpID"]} type="text" id="scpID" isReadOnly={true}/>
        </div>
                <div>
          <Label htmlFor="mac">Mac Address</Label>
          <Input name="mac" value={data["macAddress"]} type="text" id="mac" isReadOnly={true}/>
        </div>
                        <div>
          <Label htmlFor="Ip">Ip Address</Label>
          <Input name="ip" value={data["ip"]} type="text" id="Ip" isReadOnly={true}/>
        </div>
                        <div>
          <Label htmlFor="SerialNumber">Serial Number</Label>
          <Input name="serialNumber" value={data["serialNumber"]} type="text" id="SerialNumber" isReadOnly={true}/>
        </div>
         <div className="hidden">
          <Label htmlFor="model">Model</Label>
          <Input name="model" value={data["model"]} type="text" id="model" isReadOnly={true}/>
        </div>
        <div className="flex justify-center">
          <Button className="w-50" size="sm">Submit </Button>
        </div>
      </form>
    </ComponentCard>
  );
}

export default EditModuleInputs;