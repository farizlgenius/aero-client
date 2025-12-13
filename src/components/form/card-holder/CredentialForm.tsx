import { PropsWithChildren, useState } from "react";
import ActionElement from "../../../pages/UiElements/ActionElement";
import Button from "../../ui/button/Button";
import DatePicker from "../date-picker";
import Input from "../input/InputField";
import Label from "../Label";
import { FormProp } from "../../../model/Form/FormProp";
import { CardHolderDto } from "../../../model/CardHolder/CardHolderDto";
import { CredentialDto } from "../../../model/CardHolder/CredentialDto";
import ScanCardModal from "../../../pages/UiElements/ScanCardModal";
import Modals from "../../../pages/UiElements/Modals";
import SignalRService from "../../../services/SignalRService";
import { useLocation } from "../../../context/LocationContext";



export const CredentialForm: React.FC<PropsWithChildren<FormProp<CardHolderDto>>> = ({ dto, setDto }) => {
    const {locationId} = useLocation();    
    var defaultCredential: CredentialDto = {
    componentId: 0,
    bits: 0,
    issueCode: 0,
    facilityCode: -1,
    cardNo: 0,
    pin: "",
    activeDate: new Date().toISOString(),
    deactiveDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString(),
    uuid: '',
    locationId: locationId,
    isActive: true
}

    const [addCardForm, setAddCardForm] = useState<boolean>(false);
    const [scanCard, setScanCard] = useState<boolean>(false);
    const [credentialDto, setCredentialDto] = useState<CredentialDto>(defaultCredential);
    const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.currentTarget.name == "pin"){
            setCredentialDto(prev => ({ ...prev, [e.target.name]: String(e.target.value) }))
        }
        setCredentialDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        switch (e.currentTarget.name) {
            case "addCard":
                setDto(prev => ({ ...prev, credentials: [...prev.credentials, credentialDto] }))
                setCredentialDto(defaultCredential)
                setAddCardForm(false);
                break;
            case "cancleCard":
                setCredentialDto(defaultCredential)
                setAddCardForm(false);
                break;
            case "close":
                setScanCard(false)
                break;
                default:
                    break;

        }

    }

    {/* Start Scan Card */ }
    const handleStartScan = () => {
        var connection = SignalRService.getConnection();

        connection.on("CardScanStatus", (ScpMac: string, FormatNumber: number, FacilityCode: number, CardHolderId: number, IssueCode: number, FloorNumber: number) => {
            console.log(FormatNumber);
            console.log(FacilityCode);
            console.log(CardHolderId);
            console.log(IssueCode);
            console.log(FloorNumber);
            setCredentialDto(prev => ({
                ...prev,
                issueCode: IssueCode,
                facilityCode: FacilityCode,
                cardNo: CardHolderId,
            }))
            setScanCard(false);
        });

        return () => {
            //SignalRService.stopConnection()
        };
    }

    const handleClickCredential = () => {
        setAddCardForm(true);
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = () => {

    }

    const handleOnClickRemove = (data: Object) => {
        console.log(data);
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

    return (
        <>
            {scanCard && <Modals isWide={false} body={<ScanCardModal onStartScan={handleStartScan} />} handleClickWithEvent={handleClick} />}
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className='flex flex-col gap-5'>
                    <div className='gap-3'>
                        <div className='flex flex-col gap-1 w-100'>

                            {addCardForm ?
                                <>
                                    <div>
                                        <Button name="scanCard" onClick={() => setScanCard(true)} size='sm'>Scan Card</Button>
                                    </div>
                                    <div>

                                        <div>
                                            <Label>Bit number</Label>
                                            <Input
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
                                                    name="facilityCode"
                                                    onChange={handleCredentialChange}
                                                    value={credentialDto.facilityCode}
                                                />
                                            </div>
                                            <div className='flex-3'>
                                                <Label>Card number</Label>
                                                <Input
                                                    name="cardNo"
                                                    onChange={handleCredentialChange}
                                                    value={credentialDto.cardNo}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Pin</Label>
                                            <Input
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
                                            <Button name='addCard' onClickWithEvent={handleClick} size='sm'>Add Card</Button>
                                            <Button name='cancleCard' onClickWithEvent={handleClick} size='sm' variant='danger'>Cancle</Button>
                                        </div>

                                    </div>

                                </>

                                :

                                <>

                                    <div className="flex flex-col gap-4 swim-lane">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                                                Credentials
                                                <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                                                    {dto.credentials.length}/10
                                                </span>
                                            </h3>
                                            <a onClick={() => handleClickCredential()} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                                        </div>
                                    </div>


                                    <div className='flex flex-col gap-1'>
                                        {/* Card */}
                                        {dto.credentials.map((a: CredentialDto, i: number) => (
                                            <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                                                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                                    <div className="flex items-start w-full gap-4">
                                                        <label htmlFor="taskCheckbox1" className="w-full cursor-pointer">
                                                            <div className="relative flex items-start">
                                                                <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                                                    Card : {a.cardNo}
                                                                </p>
                                                            </div>
                                                        </label>
                                                    </div>

                                                    <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                                                        <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-theme-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                                                            Active
                                                        </span>
                                                        <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={{}} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </>
                            }

                        </div>
                    </div>
                </div>

            </div>

        </>

    )
}