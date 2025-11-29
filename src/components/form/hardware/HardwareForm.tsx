import { PropsWithChildren } from "react";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Button from "../../ui/button/Button.tsx";
import { HardwareDto } from "../../../model/Hardware/HardwareDto.ts";




interface FormProps {
  data: HardwareDto;
  handleClickWithEvent: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isDetail: boolean;
}


const HardwareForm: React.FC<PropsWithChildren<FormProps>> = ({ data, handleChange, isDetail = false, handleClickWithEvent }) => {


  return (
    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Hardware Name</Label>
          <Input name="name" value={data.name} type="text" id="name" onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="componentId">scpId</Label>
          <Input name="componentId" value={data.componentId} type="text" id="componentId" onChange={handleChange} isReadOnly={true} />
        </div>
        <div>
          <Label htmlFor="macAddress">Mac Address</Label>
          <Input name="macAddress" value={data.macAddress} type="text" id="macAddress" onChange={handleChange} isReadOnly={true} />
        </div>
        <div>
          <Label htmlFor="ipAddress">Ip Address</Label>
          <Input name="ipAddress" value={data.ipAddress} type="text" id="ipAddress" onChange={handleChange} isReadOnly={true} />
        </div>
        <div>
          <Label htmlFor="serialnumber">Serial Number</Label>
          <Input name="serialnumber" value={data.serialNumber} type="text" id="serialnumber" onChange={handleChange} isReadOnly={true} />
        </div>
        <div >
          <Label htmlFor="model">Model</Label>
          <Input name="model" value={data.model} type="text" id="model" onChange={handleChange} isReadOnly={true} />
        </div>
        <div className="flex justify-center gap-5">
          {isDetail
            ?
            <>
              <Button name="submit" disabled className="w-50" size="sm">Submit </Button>
              <Button onClickWithEvent={handleClickWithEvent} name="close" variant="danger" className="w-50" size="sm">Cancel</Button>
            </>
            :
            <>
              <Button name="submit" onClickWithEvent={handleClickWithEvent} className="w-50" size="sm">Submit</Button>
              <Button onClickWithEvent={handleClickWithEvent} name="close" variant="danger" className="w-50" size="sm">Cancel</Button>
            </>

          }

        </div>
      </div>

    </div>


  );
}

export default HardwareForm;