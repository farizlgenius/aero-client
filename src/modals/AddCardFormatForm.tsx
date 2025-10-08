import React, { PropsWithChildren, useState } from 'react'
import { CreateCardFormatDto } from '../constants/types';
import axios from 'axios';
import { CardFormatEndPoint } from '../constants/constant';
import ComponentCard from '../components/common/ComponentCard';
import Label from '../components/form/Label';
import Input from '../components/form/input/InputField';
import Button from '../components/ui/button/Button';


// Global Variable

const server = import.meta.env.VITE_SERVER_IP;


interface AddCardFormatProp {
  onSubmitHandle: () => void
}




const AddCardFormatForm: React.FC<PropsWithChildren<AddCardFormatProp>> = ({ onSubmitHandle }) => {

  const [createCardFormatDto, setCreateCardFormatDto] = useState<CreateCardFormatDto>({
  cardFormatName:"",
  facility:0,
  bits:0,
  peLn:0,
  peLoc:0,
  poLn:0,
  poLoc:0,
  fcLn:0,
  fcLoc:0,
  chLn:0,
  chLoc:0,
  icLn:0,
  icLoc:0,
  })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateCardFormatDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }



  const handleOutsideSubmit = () => {
    addCardFormat(createCardFormatDto)
  }



  const addCardFormat = async (data: CreateCardFormatDto) => {
    try {
      const res = await axios.post(server+CardFormatEndPoint.POST_ADD_CARDFORMAT, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(res)
      if (res.status == 201 || res.status == 200) {
        onSubmitHandle()
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ComponentCard className='h-[60vh] overflow-y-auto hidden-scroll' title="Add Card Format">

      {/* {scanCard && <Modals isWide={false} body={<ScanCard onStartScan={handleStartScan} />} closeToggle={() => setScanCard(false)} />} */}

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">

        <div /* ref={formRef} onSubmit={handleSubmit} */ >
          <div className='w-[60%]'>
            <div className='flex flex-col gap-1 w-100'>
              <div className="flex  flex-col gap-2 ">
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="cardFormatName">Name</Label>
                  <Input name="cardFormatName" type="text" id="cardFormatName" onChange={handleChange} value={createCardFormatDto.cardFormatName} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="bits">Bits</Label>
                  <Input name="bits" type="number" id="bits" onChange={handleChange} value={createCardFormatDto.bits} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="facility">Facility</Label>
                  <Input name="facility" type="number" id="facility" onChange={handleChange} value={createCardFormatDto.facility} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="peLn">Number of Bit Sum For Even Parity</Label>
                  <Input name="peLn" type="number" id="peLn" onChange={handleChange} value={createCardFormatDto.peLn} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="peLoc">Even Parity Start Bit</Label>
                  <Input name="peLoc" type="number" id="peLoc" onChange={handleChange} value={createCardFormatDto.peLoc} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="poLn">Number of Bit Sum For Odd Parity</Label>
                  <Input name="poLn" type="number" id="poLn" onChange={handleChange} value={createCardFormatDto.poLn} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="poLoc">Odd Parity Start Bit</Label>
                  <Input name="poLoc" type="number" id="poLoc" onChange={handleChange} value={createCardFormatDto.poLoc} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="fcLn">Number of Facility Bits</Label>
                  <Input name="fcLn" type="number" id="fcLn" onChange={handleChange} value={createCardFormatDto.fcLn} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="fcLoc">Facility Start Bit</Label>
                  <Input name="fcLoc" type="number" id="fcLoc" onChange={handleChange} value={createCardFormatDto.fcLoc} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="chLn">Number of Card Number Bits</Label>
                  <Input name="chLn" type="number" id="chLn" onChange={handleChange} value={createCardFormatDto.chLn} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="chLoc">Card Number Start Bit</Label>
                  <Input name="chLoc" type="number" id="chLoc" onChange={handleChange} value={createCardFormatDto.chLoc} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="name">Number of Issue Code Bits</Label>
                  <Input name="name" type="number" id="name" onChange={handleChange} value={createCardFormatDto.icLn} />
                </div>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="name">Issue Code Start Bit</Label>
                  <Input name="name" type="number" id="name" onChange={handleChange} value={createCardFormatDto.icLoc} />
                </div>
                <br />
                <Button onClickWithEvent={handleOutsideSubmit} className='w-50'>Add</Button>
              </div>

            </div>
          </div>
        </div >

      </div >

    </ComponentCard >
  )
}

export default AddCardFormatForm