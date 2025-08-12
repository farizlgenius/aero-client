import React, { PropsWithChildren, useEffect, useState } from 'react'
import ComponentCard from '../../common/ComponentCard'
import Label from '../Label'
import Select from '../Select'
import axios from 'axios';
import Button from '../../ui/button/Button';
import Spinner from '../../../pages/UiElements/Spinner';

// Global 
const server = import.meta.env.VITE_SERVER_IP;

// interface
interface ScanCardProps {
    onStartScan:()=>void
}

interface ScanCardDto {
    scpIp:string;
    acrNo:number;
}

interface ScpDto {
  no: number;
  scpId: number;
  name: string;
  model: string;
  mac: string;
  ipAddress: string;
  serialnumber: string;
  status: number; // 1 -> online , 0 -> offline
}


interface DoorDto {
    name: string;
    scpIp: string;
    acrNumber: number;
    mode: number;
    acrModeDesc: string;
}

interface Option {
    value: string | number;
    label: string;
}


const ScanCard:React.FC<PropsWithChildren<ScanCardProps>> = ({onStartScan}) => {
    const [doorOption, setDoorOption] = useState<Option[]>([]);
    const [controllerOption, setControllerOption] = useState<Option[]>([]);
    const [spinner,setSpinner] = useState<boolean>(false);
    const [scanData,setScanData] = useState<ScanCardDto>({
        scpIp: "",
        acrNo: 0
    })

    const fetchController = async () => {
                try {
            const res = await axios.get(`${server}/api/v1/scp/all`);
            res.data.content.map((a: ScpDto) => {
                setControllerOption(prev => ([...prev, {
                    value: a.ipAddress,
                    label: a.name
                }]))
            })

        } catch (e) {
            console.log(e)
        }
    }

    const fetchDoor = async (ScpIp:string) => {
        try {
            const res = await axios.get(`${server}/api/v1/acr/${ScpIp}`);
            res.data.content.map((a: DoorDto) => {
                setDoorOption(prev => ([...prev, {
                    value: a.acrNumber,
                    label: a.name
                }]))
            })

        } catch (e) {
            console.log(e)
        }
    }

    const handleSelectChange = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.currentTarget.name)
        switch (e.currentTarget.name) {
            case "scpIp":
                console.log(value);
                setScanData(prev => ({...prev,scpIp:e.target.value}));
                fetchDoor(value)
                break;
            case "doors":
                setScanData(prev => ({...prev,acrNo:Number(e.target.value)}));
                break;
            default:
                break;
        }
    }

    const triggerCardRecieve = async () => {
        try{
            const res = await axios.post(`${server}/api/v1/credential/scan`,scanData,{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            console.log(res);
            onStartScan();
        }catch(e){
            console.log(e)
        }
    } 

    const handleClick = () => {
        triggerCardRecieve();
        setSpinner(true);
    }

    {/* useEffect */ }
    useEffect(() => {
        fetchController();
    }, [])
    return (
        <ComponentCard title='Scan Card'>
            <div>
                <Label>Select Controller</Label>
                <Select
                    name="scpIp"
                    options={controllerOption}
                    placeholder="Select Option"
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                //defaultValue={formData.readerSioNumber}
                />
                                <Label>Select Reader</Label>
                <Select
                    name="doors"
                    options={doorOption}
                    placeholder="Select Option"
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                //defaultValue={formData.readerSioNumber}
                />
            </div>
            <div>
                {spinner 
                ?
                <Button startIcon={<Spinner/>} onClick={handleClick}>Waiting....</Button>
                 :
                 
                 <Button onClick={handleClick}>Scan Card</Button>
                 
                 }
                
            </div>
        </ComponentCard>
    )
}

export default ScanCard