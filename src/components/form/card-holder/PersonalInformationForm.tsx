import { useState } from "react"
import { CamIcon, EnvelopeIcon, FileIcon } from "../../../icons"
import Button from "../../ui/button/Button"
import DatePicker from "../date-picker"
import DropzoneComponent from "../form-elements/DropZone"
import Input from "../input/InputField"
import Radio from "../input/Radio"
import Label from "../Label"
import { FormProp } from "../../../model/Form/FormProp"
import { CardHolderDto } from "../../../model/CardHolder/CardHolderDto"
import TextArea from "../input/TextArea"
import { Gender } from "../../../enum/Sex"
import { ImageFileDto } from "../../../model/CardHolder/ImageFileDto"
import { NativeWebcam } from "../../../pages/UiElements/NativeWebcam"


var defaultImageFileDto: ImageFileDto = {
    fileData: "",
    fileName: "",
    fileSize: 0,
    contentType: ""
}


export const PersonalInformationForm: React.FC<FormProp<CardHolderDto>> = ({ setDto, dto }) => {
    const [file, setFile] = useState<boolean>(false);
    const [cam, setCam] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>(Gender.M);
    const [imageFileDto, setImageFileDto] = useState<ImageFileDto>(defaultImageFileDto)

    function generateEmployeeId(): string {
        return `${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name)
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }


    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
        setDto(prev => ({ ...prev, sex: value }))
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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

    return (
        <div className='flex flex-col gap-4'>

            <Label>User Image</Label>
            {/* Image */}
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                {file || cam ?
                    file ?
                        <DropzoneComponent setImageFileDto={setImageFileDto} handleClick={handleClick} />
                        :
                        <NativeWebcam setImageFileDto={setImageFileDto} modelStatus={cam} handleClick={handleClick} />
                    :
                    <>
                        <div className="cursor-pointer w-50 h-50 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <img src={imageFileDto.fileData == "" ? "/images/user/default.jpg" : imageFileDto.fileData} alt="user" />
                        </div>
                        <div className='flex gap-5'>
                            <Button name='file' onClickWithEvent={handleClick} startIcon={<FileIcon />}>Browse</Button>
                            <Button name='cam' onClickWithEvent={handleClick} startIcon={<CamIcon />}>Take Picture</Button>
                        </div>
                    </>

                }

            </div>
            {/* Personal Information */}
            <Label>Personal Information</Label>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className='flex gap-2 mb-3'>
                    <div className='flex-5'>
                        <Label htmlFor="userId">Cardholder ID / Employee ID</Label>
                        <Input name="userId" type="text" id="cardHolderId" onChange={handleChange} value={dto.userId} />
                    </div>
                    <div className='flex-1 flex items-end'>
                        <Button onClick={() => setDto((prev) => ({ ...prev, userId: generateEmployeeId() }))}>Auto</Button>
                    </div>
                </div>
                <div className='flex gap-2 mb-3'>
                    <div className='flex-1'>
                        <Label>Identification ( ID Card | Passport )</Label>
                        <Input type='text' name='identification' onChange={handleChange} value={dto.identification} />
                    </div>

                </div>
                <div className='flex gap-2 mb-3'>
                    <div className='flex-1'>
                        <Label htmlFor="title">Title</Label>
                        <Input name="title" type='text' id="title" onChange={handleChange} value={dto.title} />
                    </div>
                    <div className='flex-2'>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input name="firstName" type="text" id="firstName" onChange={handleChange} value={dto.firstName} />
                    </div>
                    <div className='flex-2'>
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input name="middleName" type="text" id="middleName" onChange={handleChange} value={dto.middleName} />
                    </div>
                    <div className='flex-2'>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input name="lastName" type="text" id="lastName" onChange={handleChange} value={dto.lastName} />
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
                                    value="Male"
                                    checked={selectedValue === "Male"}
                                    onChange={handleRadioChange}
                                    label="Male"
                                />
                            </div>

                            <div className="flex flex-col flex-wrap gap-8">
                                <Radio
                                    id="gender2"
                                    name="gender"
                                    value="Female"
                                    checked={selectedValue === "Female"}
                                    onChange={handleRadioChange}
                                    label="Female"
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
                        />
                    </div>
                </div>

                <div className='flex gap-2 mb-3'>
                    <div className='flex-1'>
                        <Label>Email</Label>
                        <div className="relative">
                            <Input
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
                            onChange={handleChange}
                            value={dto.phone}
                            name="phone"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                </div>
                <div>
                    <Label>Address</Label>
                    <TextArea value={dto.address} onChange={(e: string) => setDto(prev => ({ ...prev, address: e }))} />
                </div>
            </div>
            <Label>Company Information</Label>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

                <div className='flex gap-2 mb-3'>
                    <div className='flex-1'>
                        <Label>Company</Label>
                        <Input
                            onChange={handleChange}
                            value={dto.company}
                            name="company"
                            placeholder="Company Co.,Ltd."
                        />
                    </div>

                </div>
                <div className='flex gap-2 mb-3'>
                    <div className='flex-1'>
                        <Label>Position</Label>
                        <Input
                            onChange={handleChange}
                            value={dto.position}
                            name="position"
                            placeholder="Engineer"
                        />
                    </div>
                </div>

                <div className='flex gap-2 mb-3'>
                    <div className='flex-1'>
                        <Label>Department</Label>
                        <Input
                            onChange={handleChange}
                            value={dto.department}
                            name="department"
                            placeholder="Engineering Department"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <Label>Additionals Field</Label>
                <a onClick={() => setDto(prev => ({...prev,additionals:[...prev.additionals,""]}))} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
            </div>
            
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                {dto.additionals.map((a: string, i: number) => {
                    return (<div className="mb-3" key={i}>
                        <Label>Additionals {i + 1}</Label>
                        <Input
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
    )
}