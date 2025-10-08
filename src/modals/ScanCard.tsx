import React, { PropsWithChildren, useEffect, useState } from 'react'
import { DoorDto, ScanCardDto, ScpDto,Option } from '../constants/types';
import { ACREndPoint, CredentialEndPoin, GET_SCP_LIST } from '../constants/constant';
import axios from 'axios';
import Button from '../components/ui/button/Button';
import ComponentCard from '../components/common/ComponentCard';
import Spinner from '../pages/UiElements/Spinner';
import Select from '../components/form/Select';
import Label from '../components/form/Label';


// Global 
const server = import.meta.env.VITE_SERVER_IP;

// interface
interface ScanCardProps {
    onStartScan:()=>void
}




const ScanCard:React.FC<PropsWithChildren<ScanCardProps>> = ({onStartScan}) => {
    const [doorOption, setDoorOption] = useState<Option[]>([]);
    const [controllerOption, setControllerOption] = useState<Option[]>([]);
    const [spinner,setSpinner] = useState<boolean>(false);
    const [scanData,setScanData] = useState<ScanCardDto>({
        scpMac: "",
        acrNo: 0
    })

    const fetchController = async () => {
                try {
            const res = await axios.get(GET_SCP_LIST);
            res.data.content.map((a: ScpDto) => {
                setControllerOption(prev => ([...prev, {
                    value: a.mac,
                    label: a.name
                }]))
            })

        } catch (e) {
            console.log(e)
        }
    }

    const fetchDoor = async (ScpMac:string) => {
        try {
            const res = await axios.get(server+ACREndPoint.GET_ACR_BY_MAC+`${ScpMac}`);
            res.data.content.map((a: DoorDto) => {
                setDoorOption(prev => ([...prev, {
                    value: a.acrNo,
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
            case "scpMac":
                console.log(value);
                setScanData(prev => ({...prev,scpMac:e.target.value}));
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
            const res = await axios.post(server+CredentialEndPoin.POST_TRIGGER_SCAN_CARD,scanData,{
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
                    name="scpMac"
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