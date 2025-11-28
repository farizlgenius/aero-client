import React, { PropsWithChildren, useEffect, useState } from 'react'
import axios from 'axios';
import { Options } from '../../model/Options';
import { HardwareDto } from '../../model/Hardware/HardwareDto';
import { DoorDto } from '../../model/Door/DoorDto';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Select from '../../components/form/Select';
import Button from '../../components/ui/button/Button';
import Spinner from './Spinner';
import { ScanCardDto } from '../../model/CardHolder/ScanCard';
import HttpRequest from '../../utility/HttpRequest';
import { HttpMethod } from '../../enum/HttpMethod';
import { HardwareEndpoint } from '../../endpoint/HardwareEndpoint';
import { DoorEndpoint } from '../../endpoint/DoorEndpoint';
import { CredentialEndpoint } from '../../endpoint/CredentialEndpoint';



// Global 
const server = import.meta.env.VITE_SERVER_IP;

// interface
interface ScanCardProps {
    onStartScan:()=>void
}




const ScanCardModal:React.FC<PropsWithChildren<ScanCardProps>> = ({onStartScan}) => {
    const [doorOption, setDoorOption] = useState<Options[]>([]);
    const [controllerOption, setControllerOption] = useState<Options[]>([]);
    const [spinner,setSpinner] = useState<boolean>(false);
    const [scanData,setScanData] = useState<ScanCardDto>({
        macAddress: "",
        doorId: -1
    })

    const fetchController = async () => {
        const res = await HttpRequest.send(HttpMethod.GET,HardwareEndpoint.GET_SCP_LIST)
        if(res && res.data.data){
            res.data.data.map((a:HardwareDto) => {
                setControllerOption(prev => ([...prev,{
                    value:a.macAddress,
                    label:a.name,
                    isTaken:false,
                    description:a.ipAddress
                }]))
            })
        }
    }

    const fetchDoor = async (macAddress:string) => {
        const res = await HttpRequest.send(HttpMethod.GET,DoorEndpoint.GET_ACR_BY_MAC+macAddress)
        if(res && res.data.data){
            res.data.data.map((a:DoorDto) => {
                setDoorOption(prev => ([...prev,{
                    value:a.componentId,
                    label:a.name,
                    isTaken:false
                }]))
            })
        }
    }

    const handleSelectChange = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.currentTarget.name)
        switch (e.currentTarget.name) {
            case "macAddress":
                console.log(value);
                setScanData(prev => ({...prev,macAddress:e.target.value}));
                fetchDoor(value)
                break;
            case "doorId":
                setScanData(prev => ({...prev,doorId:Number(e.target.value)}));
                break;
            default:
                break;
        }
    }

    const triggerCardRecieve = async () => {
        try{
            const res = await axios.post(server+CredentialEndpoint.POST_SCAN,scanData,{
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
                isString={true}
                    name="macAddress"
                    options={controllerOption}
                    placeholder="Select Option"
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                defaultValue={scanData.macAddress}
                />
                                <Label>Select Reader</Label>
                <Select
                isString={false}
                    name="doorId"
                    options={doorOption}
                    placeholder="Select Option"
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                defaultValue={scanData.doorId}
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

export default ScanCardModal