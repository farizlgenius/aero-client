import { PropsWithChildren, useEffect, useState } from "react";
import Label from "../Label";
import { FormProp, FormType } from "../../../model/Form/FormProp";
import { CardHolderDto } from "../../../model/CardHolder/CardHolderDto";
import Button from "../../ui/button/Button";
import DatePicker from "../date-picker";
import Input from "../input/InputField";
import Select from "../Select";
import Spinner from "../../../pages/UiElements/Spinner";
import { CredentialDto } from "../../../model/CardHolder/CredentialDto";
import { useLocation } from "../../../context/LocationContext";
import { Options } from "../../../model/Options";
import SignalRService from "../../../services/SignalRService";
import { ScanCardStatus } from "../../../model/CardHolder/ScanCardStatus";
import { CredentialEndpoint } from "../../../endpoint/CredentialEndpoint";
import { send } from "../../../api/api";
import { HardwareEndpoint } from "../../../endpoint/HardwareEndpoint";
import { HardwareDto } from "../../../model/Hardware/HardwareDto";
import { DoorEndpoint } from "../../../endpoint/DoorEndpoint";
import { DoorDto } from "../../../model/Door/DoorDto";
import { ScanCardDto } from "../../../model/CardHolder/ScanCard";
import { CardIcon } from "../../../icons";





export const CredentialForm: React.FC<PropsWithChildren<FormProp<CardHolderDto>>> = ({ dto, setDto, type, handleClick }) => {
    const { locationId } = useLocation();
    const [addCard, setAddCard] = useState<boolean>(false);
    const [doorOption, setDoorOption] = useState<Options[]>([]);
    const [controllerOption, setControllerOption] = useState<Options[]>([]);
    const [spinner, setSpinner] = useState<boolean>(false);
    const [scanForm, setScanForm] = useState<boolean>(false);
    const [scanData, setScanData] = useState<ScanCardDto>({
        mac: "",
        doorId: -1
    })
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setDto(prev => ({
            ...prev,
            credentials: prev.credentials.filter(
                x => Number(x.cardNo) !== id
            )
        }));
    };
    var defaultCredential: CredentialDto = {
        componentId: 0,
        bits: 0,
        issueCode: 0,
        facilityCode: -1,
        cardNo: 0,
        pin: "",
        activeDate: new Date().toISOString(),
        deactiveDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString(),
        locationId: locationId,
        isActive: true,
        hardwareName: ""
    }
    const [credentialDto, setCredentialDto] = useState<CredentialDto>(defaultCredential);

    const handleClickInternal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        switch (e.currentTarget.name) {
            case "add":
                setDto(prev => ({ ...prev, credentials: [...prev.credentials, credentialDto] }))
                setCredentialDto(defaultCredential)
                break;
            case "close":
                setAddCard(false)
                break;
            default:
                break;

        }

    }

    const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.name == "pin") {
            setCredentialDto(prev => ({ ...prev, [e.target.name]: String(e.target.value) }))
        }
        setCredentialDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }



    {/* Start Scan Card */ }
    const handleStartScan = () => {
        var connection = SignalRService.getConnection();

        connection.on("CRED.STATUS", (status: ScanCardStatus) => {
            console.log(status.formatNumber);
            console.log(status.fac);
            console.log(status.cardId);
            console.log(status.issue);
            console.log(status.floor);
            setCredentialDto(prev => ({
                ...prev,
                issueCode: status.issue,
                facilityCode: status.fac,
                cardNo: status.cardId,
            }))
            setScanForm(false);
        });

        return () => {
            //SignalRService.stopConnection()
        };
    }

    const handleSelectChange = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.currentTarget.name)
        switch (e.currentTarget.name) {
            case "macAddress":
                console.log(value);
                setScanData(prev => ({ ...prev, mac: e.target.value }));
                fetchDoor(value)
                break;
            case "doorId":
                setScanData(prev => ({ ...prev, doorId: Number(e.target.value) }));
                break;
            default:
                break;
        }
    }

    const triggerCardRecieve = async () => {
        try {
            const res = await send.post(CredentialEndpoint.POST_SCAN, scanData);
            // onStartScan();
        } catch (e) {
            console.log(e)
        }
    }

    const handleClickStartScan = () => {
        handleStartScan();
        triggerCardRecieve();
        setSpinner(true);
    }

    const toLocalISOWithOffset = (date: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0");
        const tzOffset = -date.getTimezoneOffset();
        const sign = tzOffset >= 0 ? "+" : "-";
        const offsetHours = pad(Math.floor(Math.abs(tzOffset) / 60));
        const offsetMinutes = pad(Math.abs(tzOffset) % 60);

        return (
            date.getFullYear() + "-" +
            pad(date.getMonth() + 1) + "-" +
            pad(date.getDate()) + "T" +
            pad(date.getHours()) + ":" +
            pad(date.getMinutes()) + ":" +
            pad(date.getSeconds()) +
            sign + offsetHours + ":" + offsetMinutes
        );
    }

    const fetchController = async () => {
        const res = await send.get(HardwareEndpoint.GET(locationId))
        if (res && res.data.data) {
            res.data.data.map((a: HardwareDto) => {
                setControllerOption(prev => ([...prev, {
                    value: a.mac,
                    label: a.name,
                    isTaken: false,
                    description: a.ip
                }]))
            })
        }
    }

    const fetchDoor = async (macAddress: string) => {
        const res = await send.get(DoorEndpoint.GET_ACR_BY_MAC(macAddress))
        if (res && res.data.data) {
            res.data.data.map((a: DoorDto) => {
                setDoorOption(prev => ([...prev, {
                    value: a.componentId,
                    label: a.name,
                    isTaken: false
                }]))
            })
        }
    }

    const Info = ({ label, value }: { label: string; value: any }) => (
        <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {label}
            </span>
            <span className="font-medium text-gray-800 dark:text-white/90">
                {value}
            </span>
        </div>
    );

    {/* useEffect */ }
    useEffect(() => {
        fetchController();
    }, [])


    return (
        <>
            <div className="flex gap-5 justify-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className='flex flex-1 flex-col w-3/4'>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                            Cards
                            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                                {dto.credentials.length}/10
                            </span>
                        </h3>

                    </div>

                    <>
                        <div className="flex items-center justify-center p-6 w-full">
                            <div className="grid grid-cols-[1fr] gap-5 items-center w-full ">
                                {/* Left Box */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <Label>Cards</Label>

                                    </div>

                                    <div className="overflow-auto scrollbar-thin scrollbar-transparent h-64 w-full rounded-lg border px-4 py-3 text-sm shadow-theme-xs bg-transparent">
                                        <div className="space-y-3">
                                            {dto.credentials.map((item) => {
                                                const id = Number(item.cardNo);
                                                const isSelected = selectedId === id;

                                                return (
                                                    <div
                                                        key={id}
                                                        onClick={() => setSelectedId(id)}
                                                        onDoubleClick={() => handleDelete(id)}
                                                        className={`flex gap-4 rounded-lg border p-4 cursor-pointer transition select-none
            ${isSelected
                                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                                                                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                                                            }
            hover:shadow-md
          `}
                                                    >
                                                        {/* Icon */}
                                                        <div className="pt-1">
                                                            <CardIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 grid grid-cols-2 gap-y-1 gap-x-4">
                                                            <Info label="Bits" value={item.bits} />
                                                            <Info label="Facility" value={item.facilityCode} />
                                                            <Info label="Card No" value={item.cardNo} />
                                                            <Info label="PIN" value={item.pin || "-"} />
                                                            <Info
                                                                label="Active"
                                                                value={new Date(item.activeDate).toLocaleDateString()}
                                                            />
                                                            <Info
                                                                label="Deactive"
                                                                value={new Date(item.deactiveDate).toLocaleDateString()}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                </div>
                <div className="flex-1">
                    {scanForm ?
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4" >
                                <div>
                                    <Label>Select Controller</Label>
                                    <Select
                                    disabled={type == FormType.INFO}
                                        isString={true}
                                        name="macAddress"
                                        options={controllerOption}
                                        placeholder="Select Option"
                                        onChangeWithEvent={handleSelectChange}
                                        className="dark:bg-dark-900"
                                        defaultValue={scanData.mac}
                                    />
                                </div>
                                <div>

                                    <Label>Select Reader</Label>
                                    <Select
                                    disabled={type == FormType.INFO}
                                        isString={false}
                                        name="doorId"
                                        options={doorOption}
                                        placeholder="Select Option"
                                        onChangeWithEvent={handleSelectChange}
                                        className="dark:bg-dark-900"
                                        defaultValue={scanData.doorId}
                                    />
                                </div>

                            </div>
                            <div>
                                {spinner
                                    ?
                                    <Button disabled={type == FormType.INFO} startIcon={<Spinner />} onClick={handleClickStartScan}>Waiting....</Button>
                                    :

                                    <Button disabled={type == FormType.INFO} onClick={handleClickStartScan}>Scan Card</Button>

                                }

                            </div>
                        </div>
                        :
                        <div className="flex flex-col justify-center gap-4">
                            <div>
                                <Button disabled={type == FormType.INFO} name="scanCard" onClick={() => setScanForm(true)} size='sm'>Scan Card</Button>
                            </div>
                            <div className='flex flex-col gap-4'>

                                <div>
                                    <Label>Bit number</Label>
                                    <Input
                                    disabled={type == FormType.INFO}
                                        name="bits"
                                        placeholder="26"
                                        onChange={handleCredentialChange}
                                        value={credentialDto.bits}
                                    />

                                </div>
                                <div className='flex gap-2'>
                                    <div className='flex-1'>
                                        <Label>Facility Code</Label>
                                        <Input
                                        disabled={type == FormType.INFO}
                                            name="facilityCode"
                                            onChange={handleCredentialChange}
                                            value={credentialDto.facilityCode}
                                        />
                                    </div>
                                    <div className='flex-3'>
                                        <Label>Card number</Label>
                                        <Input
                                        disabled={type == FormType.INFO}
                                            name="cardNo"
                                            onChange={handleCredentialChange}
                                            value={credentialDto.cardNo}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Pin</Label>
                                    <Input
                                    disabled={type == FormType.INFO}
                                        name="pin"
                                        type="number"
                                        onChange={handleCredentialChange}
                                        value={credentialDto.pin}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <div>
                                        <DatePicker
                                            id="date-picker1"
                                            label="Activate Date"
                                            placeholder="Select a date"
                                            value={credentialDto.activeDate}
                                            onChange={(dates, currentDateString) => {
                                                // Handle your logic
                                                console.log({ dates, currentDateString });
                                                setCredentialDto(prev => ({ ...prev, activeDate: toLocalISOWithOffset(dates[0]) }));

                                            }}
                                        />
                                    </div>
                                    <div>
                                        <DatePicker
                                            id="date-picker2"
                                            label="Deactivate Date"
                                            placeholder="Select a date"
                                            value={credentialDto.deactiveDate}
                                            onChange={(dates, currentDateString) => {
                                                // Handle your logic
                                                console.log({ dates, currentDateString });
                                                setCredentialDto(prev => ({ ...prev, deactiveDate: toLocalISOWithOffset(dates[0]) }));
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='flex gap-4 justify-center mt-5'>
                                    <Button disabled={type == FormType.INFO} name='add' onClickWithEvent={handleClickInternal} size='sm'>Add Card</Button>
                                </div>

                            </div>

                        </div>




                    }
                </div>

            </div>

        </>

    )
}