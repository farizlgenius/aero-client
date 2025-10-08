import { PropsWithChildren, useEffect, useState } from "react";
import { usePopupActions } from "../utility/PopupCalling";
import HttpRequest from "../utility/HttpRequest";
import { HttpMethod, MPEndPoint, PopUpMsg, ScpEndPoint, SioEndPoint } from "../constants/constant";
import { MpDto, ScpDto, SioDto,Option } from "../constants/types";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Select from "../components/form/Select";
import Radio from "../components/form/input/Radio";
import Button from "../components/ui/button/Button";




interface AddMpFormProps {
  onSubmitHandle:()=>void;
}


const AddMpForm:React.FC<PropsWithChildren<AddMpFormProps>> = ({onSubmitHandle}) => {
  const {showPopup} = usePopupActions();
  const handleSubmit = async () => {
    const res = await HttpRequest.send(HttpMethod.POST,MPEndPoint.POST_ADD_MP,data);
    console.log(res)
    if(res){
      if(res.data.code == 201 || res.data.code == 200){
        onSubmitHandle();
        showPopup(true,[PopUpMsg.CREATE_MP]);   
      }else{
        onSubmitHandle();
        showPopup(false,res.data.errors);
      }
    }
  }

  {/*Input */ }
  const [data, setData] = useState<MpDto>({
    componentNo: -1,
    name: "",
    mac: "",
    sioNo: -1,
    sioName: "",
    ipNo: -1,
    modeNo: -1,
    mode: "",
    latchingMode: 0,
    delayEntry: -1,
    delayExit: -1,
    status: -1,
    isMask:false,
    isActive:false
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({...prev,[e.target.name]:e.target.value}))
  }

  {/* Select */ }
  const [moduleOption, setModuleOption] = useState<Option[]>([]);
  const [controllerOption,setControllerOption] = useState<Option[]>([]);
  const [relayOption, setRelayOption] = useState<Option[]>([]);

  const handleSelectChange = async (value:string,e:React.ChangeEvent<HTMLSelectElement>) => {
    setData((prev) => ({...prev,[e.target.name]:value}))
    switch(e.target.name){
      case "mac":
        const res1 = await HttpRequest.send(HttpMethod.GET,SioEndPoint.GET_SIO_BY_MAC + value);
        if(res1?.data.data){
          res1.data.data.map((a:SioDto) => {
            setModuleOption((prev) => [...prev,{label:a.name,value:a.componentNo}])
          })
        }
        break;
        case "sioNo":
          const res2 = await HttpRequest.send(HttpMethod.GET,MPEndPoint.GET_IP_LIST + data.mac + "/" + value)
          if(res2?.data.data){
            res2.data.data.map((a:number) => {
                      setRelayOption((prev) => [...prev, {
          label: `Input ${a + 1}`,
          value: a.toString()
        }]);
            })
          }
          break;
        default:
          break;
    }


  };
  const handleSelectChangeRelay = (value: string) => {
    console.log("Selected value:", value);
    setData((prev) => ({...prev,ipNo:Number(value)}))
  };
  {/* Radio */ }
  const [selectedValue, setSelectedValue] = useState<string>("0");

  const handleRadioChange = (value: string) => {
    setData((prev) => ({...prev,modeNo:Number(value),mode:Number(value) == 0 ? "NC" : "NO" }))
    setSelectedValue(value);
  };

    const [selectedValueMode, setSelectedValueMode] = useState<string>("0");

  const handleRadioChangeMode = (value: string) => {
    setData((prev) => ({...prev,modeNo:Number(value)}))
    setSelectedValueMode(value);
  };

  {/* Controller Data */}
  const fetchController = async () => {
    let res = await HttpRequest.send(HttpMethod.GET,ScpEndPoint.GET_SCP_LIST);
    if(res?.data.data){
      res.data.data.map((a:ScpDto) => {
        setControllerOption((prev) => [...prev,{label:a.name,value:a.mac}])
      })
    }
  }


  {/* UseEffect */ }
  useEffect(() => {
    fetchController();
  }, []);

  return (
    <ComponentCard title="Add Monitor Point">
      <div className="space-y-6 max-h-[60vh] overflow-y-auto overflow-y-auto hidden-scroll">
        <div>
          <Label htmlFor="name">Monitor Point Name</Label>
          <Input value={data.name} name="name" type="text" id="name" onChange={handleChange} />
        </div>
                <div>
          <Label>Controller</Label>
          <Select
            name="mac"
            options={controllerOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Module</Label>
          <Select
            name="sioNo"
            options={moduleOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Input</Label>
          <Select
            name="ipNo"
            options={relayOption}
            placeholder="Select Option"
            onChange={handleSelectChangeRelay}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label className="pb-3">Mode</Label>
          <div className="flex justify-around">
            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="mode1"
                name="modeNo"
                value="0"
                checked={selectedValue === "0"}
                onChange={handleRadioChange}
                label="Normally closed"
              />
            </div>

            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="mode2"
                name="modeNo"
                value="1"
                checked={selectedValue === "1"}
                onChange={handleRadioChange}
                label="Normally open"
              />
            </div>

          </div>

        </div>
         <div>
          <Label className="pb-3">Latching Mode</Label>
          <div className="flex justify-around flex-col gap-4">
            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="latch1"
                name="mode"
                value="0"
                checked={selectedValueMode === "0"}
                onChange={handleRadioChangeMode}
                label="Normal mode (no exit or entry delay)"
              />
            </div>

            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="latch2"
                name="mode"
                value="1"
                checked={selectedValueMode === "1"}
                onChange={handleRadioChangeMode}
                label="Non-latching mode"
              />
            </div>
            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="latch3"
                name="mode"
                value="2"
                checked={selectedValueMode === "2"}
                onChange={handleRadioChangeMode}
                label="Latching mode"
              />
            </div>

          </div>

        </div>
       
        <div className={selectedValueMode === "0" ? "hidden": ""}>
          <Label htmlFor="delayEntry">Delay Entry(s)</Label>
          <Input value={data.delayEntry} min="0" max="65535" name="delayEntry" type="number" id="delayEntry" onChange={handleChange} />
        </div>
        <div className={selectedValueMode === "0" ? "hidden": ""} >
          <Label htmlFor="delayExit">Delay Exit(s)</Label>
          <Input value={data.delayExit} min="0" max="65535" name="delayExit" type="number" id="delayExit" onChange={handleChange} />
        </div>
        <div className="hidden">
          <Label htmlFor="mac">Scp Mac</Label>
          <Input name="scpMac" type="text" id="scpMac" value={data.mac} onChange={handleChange} />
        </div>
        <div className="flex justify-center">
          <Button onClick={handleSubmit} className="w-50" size="sm">Submit </Button>
        </div>
      </div>
    </ComponentCard>
  );
}

export default AddMpForm;