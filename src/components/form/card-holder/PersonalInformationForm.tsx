import { useEffect, useState } from "react"
import { CamIcon, EnvelopeIcon, FileIcon } from "../../../icons"
import Button from "../../ui/button/Button"
import DatePicker from "../date-picker"
import DropzoneComponent from "../form-elements/DropZone"
import Input from "../input/InputField"
import Radio from "../input/Radio"
import Label from "../Label"
import { FormProp, FormType } from "../../../model/Form/FormProp"
import { UserDto } from "../../../model/User/UserDto"
import TextArea from "../input/TextArea"
import { NativeWebcam } from "../../../pages/UiElements/NativeWebcam"
import Modals from "../../../pages/UiElements/Modals"
import { Avatar } from "../../../pages/UiElements/Avatar"
import { Gender } from "../../../enum/Gender"
import { send } from "../../../api/api"
import { CompanyEndpoint } from "../../../endpoint/CompanyEndpoint"
import { useLocation } from "../../../context/LocationContext"
import { CompanyDto } from "../../../model/Company/CompanyDto"
import { Options } from "../../../model/Options"
import { DepartmentEndpoint } from "../../../endpoint/DepartmentEndpoint"
import { DepartmentDto } from "../../../model/Department/DepartmentDto"
import { PositionEndpoint } from "../../../endpoint/PositionEndpoint"
import { PositionDto } from "../../../model/Position/PositionDto"
import Select from "../Select"

interface PersonalInformationFormProp extends FormProp<UserDto> {
    image: File | undefined
    setImage: React.Dispatch<React.SetStateAction<File | undefined>>
    section?: "all" | "image" | "personal"
}


export const PersonalInformationForm: React.FC<PersonalInformationFormProp> = ({ dto, setDto, type, handleClick, image, setImage, section = "all" }) => {
    const {locationId} = useLocation();
    const [newImage, setNewImage] = useState<File | undefined>();
    const [file, setFile] = useState<boolean>(false);
    const [cam, setCam] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<Gender | string>(Gender.Male.toString());
    const [com,setCom] = useState<Options[]>([]);
    const [dep,setDep] = useState<Options[]>([]);
    const [pos,setPos] = useState<Options[]>([]);
    const showImageSection = section === "all" || section === "image";
    const showPersonalSection = section === "all" || section === "personal";

    function generateEmployeeId(): string {
        return `${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name)
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }


    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
        setDto(prev => ({ ...prev, gender: value }))
    }

    const handleClickInternal = (e: React.MouseEvent<HTMLButtonElement>) => {
        switch (e.currentTarget.name) {
            case "file":
                setFile(true)
                break;
            case "cam":
                setCam(true)
                break;
            case 'close':
                setCam(false)
                setFile(false)
                break;
            case 'cancle':
                setCam(false)
                setFile(false)
                break;
        }
    }

    const fetchCompany = async () => {
        const res = await send.get(CompanyEndpoint.GET_BY_LOCATION(locationId));
        if(res.data.data != null){
            res.data.data.data.map((a:CompanyDto) => {
                setCom(prev => ([...prev,{
                    label:a.name,
                    value:a.id,
                    description:a.description,
                    isTaken:false
                }]))
            })
        }
    }

    const fetchDepartment = async () => {
        const res = await send.get(DepartmentEndpoint.GET_BY_LOCATION(locationId));
        console.log(res);
        if(res.data.data != null){
            res.data.data.data.map((a:DepartmentDto) => {
                setDep(prev => ([...prev,{
                    label:a.name,
                    value:a.id,
                    description:a.description,
                    isTaken:false
                }]))
            })
        }
    }

    const fetchPosition = async () => {
        const res = await send.get(PositionEndpoint.GET_BY_LOCATION(locationId));
        if(res.data.data != null){
            res.data.data.data.map((a:PositionDto) => {
                setPos(prev => ([...prev,{
                    label:a.name,
                    value:a.id,
                    description:a.description,
                    isTaken:false
                }]))
            })
        }
    }

    useEffect(() => {
        fetchCompany();
        fetchDepartment();
        fetchPosition();
    },[]);

    return (
        <div className='flex justify-center items-center flex-col gap-4'>
            <div className="flex justify-center gap-10">
                {showImageSection &&
                    <div className="flex-1">
                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/60">
                            <div className="mb-6 text-center">
                                <Label>Cardholder Photo</Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Upload from file or take a live picture with webcam.</p>
                            </div>
                            <div className="flex flex-col items-center gap-6">
                                {file || cam ?
                                    file ?
                                        <Modals handleClickWithEvent={handleClickInternal} body={<DropzoneComponent newImage={newImage} setNewImage={setNewImage} image={image} setImage={setImage} setFile={setFile} />} />
                                        :
                                        <Modals isWide={true} handleClickWithEvent={handleClickInternal} body={<NativeWebcam setNewImage={setNewImage} image={image} setImage={setImage} modelStatus={cam} handleClick={handleClickInternal} />} />
                                    :
                                    <>
                                        <div className="h-56 w-56 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg ring-1 ring-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:ring-gray-700">
                                            <Avatar userId={dto.userId} newImage={newImage} image={image} />
                                        </div>
                                        <div className='flex flex-wrap justify-center gap-3'>
                                            <Button disabled={type == FormType.INFO} name='file' onClickWithEvent={handleClickInternal} startIcon={<FileIcon />}>Browse</Button>
                                            <Button disabled={type == FormType.INFO} name='cam' onClickWithEvent={handleClickInternal} startIcon={<CamIcon />}>Take Picture</Button>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                }

                {showPersonalSection &&
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Personal Information</Label>
                            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                <div className='flex gap-2 mb-3'>
                                    <div className='flex-5'>
                                        <Label htmlFor="userId">Cardholder ID / Employee ID</Label>
                                        <Input disabled={type == FormType.INFO} name="userId" type="text" id="cardHolderId" onChange={handleChange} value={dto.userId} />
                                    </div>
                                    <div className='flex-1 flex items-end'>
                                        <Button disabled={type == FormType.INFO} onClick={() => setDto((prev) => ({ ...prev, userId: generateEmployeeId() }))}>Auto</Button>
                                    </div>
                                </div>
                                <div className='flex gap-2 mb-3'>
                                    <div className='flex-1'>
                                        <Label>Identification ( ID Card | Passport )</Label>
                                        <Input disabled={type == FormType.INFO} type='text' name='identification' onChange={handleChange} value={dto.identification} />
                                    </div>
                                </div>
                                <div className='flex gap-2 mb-3'>
                                    <div className='flex-1'>
                                        <Label htmlFor="title">Title</Label>
                                        <Input disabled={type == FormType.INFO} name="title" type='text' id="title" onChange={handleChange} value={dto.title} />
                                    </div>
                                    <div className='flex-2'>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input disabled={type == FormType.INFO} name="firstName" type="text" id="firstName" onChange={handleChange} value={dto.firstName} />
                                    </div>
                                    <div className='flex-2'>
                                        <Label htmlFor="middleName">Middle Name</Label>
                                        <Input disabled={type == FormType.INFO} name="middleName" type="text" id="middleName" onChange={handleChange} value={dto.middleName} />
                                    </div>
                                    <div className='flex-2'>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input disabled={type == FormType.INFO} name="lastName" type="text" id="lastName" onChange={handleChange} value={dto.lastName} />
                                    </div>
                                </div>
                                <div className='flex gap-2 mb-3'>
                                    <div className='flex-1'>
                                        <Label htmlFor='gender'>Gender</Label>
                                        <div className="flex justify-around gap-3 pb-3">
                                            <div className="flex flex-col flex-wrap gap-8">
                                                <Radio
                                                    id="gender1"
                                                    name="gender"
                                                    value={Gender.Male.toString()}
                                                    checked={selectedValue === Gender.Male.toString()}
                                                    onChange={handleRadioChange}
                                                    label="Male"
                                                />
                                            </div>

                                            <div className="flex flex-col flex-wrap gap-8">
                                                <Radio
                                                    id="gender2"
                                                    name="gender"
                                                     value={Gender.Female.toString()}
                                                    checked={selectedValue === Gender.Female.toString()}
                                                    onChange={handleRadioChange}
                                                    label="Female"
                                                />
                                            </div>
                                            <div className="flex flex-col flex-wrap gap-8">
                                                <Radio
                                                    id="gender3"
                                                    name="gender"
                                                     value={Gender.Other.toString()}
                                                    checked={selectedValue === Gender.Other.toString()}
                                                    onChange={handleRadioChange}
                                                    label="Other"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex gap-2 mb-3'>
                                    <div className='flex-1'>
                                        <DatePicker
                                            isTime={false}
                                            id="Date"
                                            label="Date of birth"
                                            placeholder="Select a date"
                                            onChange={(date) => setDto((prev) => ({ ...prev, dateOfBirth: date[0].toISOString() }))}
                                            value={dto.dateOfBirth}
                                        />
                                    </div>
                                </div>

                                <div className='flex gap-2 mb-3'>
                                    <div className='flex-1'>
                                        <Label>Email</Label>
                                        <div className="relative">
                                            <Input
                                                disabled={type == FormType.INFO}
                                                name="email"
                                                placeholder="info@gmail.com"
                                                type="text"
                                                className="pl-[62px]"
                                                onChange={handleChange}
                                                value={dto.email}
                                            />
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                                <EnvelopeIcon className="size-6" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex-1'>
                                        <Label>Phone</Label>
                                        <Input
                                            disabled={type == FormType.INFO}
                                            onChange={handleChange}
                                            value={dto.phone}
                                            name="phone"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Address</Label>
                                    <TextArea disabled={type == FormType.INFO} value={dto.address} onChange={(e: string) => setDto(prev => ({ ...prev, address: e }))} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label>Company Information</Label>
                            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

                                <div className='flex gap-2 mb-3'>
                                    <div className='flex-1'>
                                        <Label>Company</Label>
                                        {/* <Input
                                            disabled={type == FormType.INFO}
                                            onChange={handleChange}
                                            value={dto.company}
                                            name="company"
                                            placeholder="Company Co.,Ltd."
                                        /> */}
                                        <Select name={"Company"} 
                                        onChange={e => setDto(prev => ({...prev,companyId:Number(e),company:com.find(x => x.value == Number(e))?.label ?? ""}))} 
                                        defaultValue={dto.companyId} 
                                        options={com}/>
                                    </div>

                                </div>
                                 <div className='flex gap-2 mb-3'>
                                    <div className='flex-1'>
                                        <Label>Department</Label>
                                        {/* <Input
                                            disabled={type == FormType.INFO}
                                            onChange={handleChange}
                                            value={dto.department}
                                            name="department"
                                            placeholder="Engineering Department"
                                        /> */}
                                        <Select name={"Department"} defaultValue={dto.departmentId}
                                         onChange={e => setDto(prev => ({...prev,departmentId:Number(e),department:dep.find(x => x.value == Number(e))?.label ?? ""}))} 
                                         options={dep}/>
                                    </div>
                                </div>
                                <div className='flex gap-2 mb-3'>
                                    <div className='flex-1'>
                                        <Label>Position</Label>
                                        {/* <Input
                                            disabled={type == FormType.INFO}
                                            onChange={handleChange}
                                            value={dto.position}
                                            name="position"
                                            placeholder="Engineer"
                                        /> */}
                                        <Select name={"Position"} 
                                        onChange={e => setDto(prev => ({...prev,positionId:Number(e),position:pos.find(x => x.value == Number(e))?.label ?? ""}))} 
                                        defaultValue={dto.positionId} options={pos}/>
                                    </div>
                                </div>

                               
                            </div>
                            <div className="flex justify-between mt-5">
                                <Label>Additionals Field</Label>
                                <a onClick={() => setDto(prev => ({ ...prev, additionals: [...prev.additionals, ""] }))} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                            </div>
                            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                {dto.additionals.map((a: string, i: number) => {
                                    return (<div className="mb-3" key={i}>
                                        <Label>Additionals {i + 1}</Label>
                                        <Input
                                            disabled={type == FormType.INFO}
                                            key={i}
                                            onChange={(e) => {
                                                const newAdditional = [...dto.additionals]
                                                newAdditional[i] = e.target.value;
                                                setDto({ ...dto, additionals: newAdditional })
                                            }}
                                            value={a}
                                            name={String(i)}
                                            placeholder="Engineering Department"
                                        />
                                    </div>)
                                })}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
