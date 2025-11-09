import React, { PropsWithChildren, useEffect, useState } from 'react'
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import { CardFormatDto } from '../../model/CardFormat/CardFormatDto';
import { Card } from '../UiElements/Card';
import { CardComponent } from '../../model/CardFormat/CardComponent';


// Global Variable

interface CardFormatFormProp {
  isUpdate: boolean,
  handleClickWithEvent: (e: React.MouseEvent<HTMLButtonElement>) => void,
  setCardFormatDto: React.Dispatch<React.SetStateAction<CardFormatDto>>;
  data: CardFormatDto
}
const defaultDto: CardFormatDto = {
  name: '',
  componentId: 0,
  facility: -1,
  offset: 0,
  functionId: 1,
  flags:0,
  bits: 0,
  peLn: 0,
  peLoc: 0,
  poLn: 0,
  poLoc: 0,
  fcLn: 0,
  fcLoc: 0,
  chLn: 0,
  chLoc: 0,
  icLn: 0,
  icLoc: 0,
  uuid: '',
  locationId: 0,
  locationName: '',
  isActive: false
}

const CardFormatForm: React.FC<PropsWithChildren<CardFormatFormProp>> = ({ handleClickWithEvent, data, setCardFormatDto }) => {
  const [selectObject, setSelectObject] = useState<number[]>([])
  const [cards, setCards] = useState<CardComponent[]>([])
  const [refresh, setRefresh] = useState<boolean>(false);
  const toggleRefresh = () => setRefresh(!refresh);
  var numEven = 0;
  var evenStart = -1;
  var numOdd = 0;
  var oddStart = -1;
  var numFac = 0;
  var facStart = -1;
  var numData = 0;
  var dataStart = -1;

  // Convet cards to cardFormatData
  const handleConvert = () => {

    // var numIssue = 0;
    // var issueStart = -1;
    cards.forEach((a: CardComponent) => {
      if (a.even) {
        numEven += 1;
        if (evenStart == -1) evenStart = a.num
      }
      if (a.odd) {
        numOdd += 1;
        if (oddStart == -1) oddStart = a.num
      }
      if (a.fac) {
        numFac += 1;
        if (facStart == -1) facStart = a.num
      }
      if (a.data) {
        numData += 1;
        if (dataStart == -1) dataStart = a.num
      }
    })

    setCardFormatDto(prev => ({
      ...prev,
      peLn: numEven,
      peLoc: evenStart,
      poLn: numOdd,
      poLoc: oddStart,
      fcLn: numFac,
      fcLoc: facStart,
      chLn: numData,
      chLoc: dataStart
    }))

  }

  const handleCardClick = (data: CardComponent) => {
    setSelectObject(prev => prev.includes(data.num) ? selectObject.filter(a => a !== data.num) : [...prev, data.num]);
    setCards(prev => prev.map(a => a.num === data.num ? { ...a, active: !a.active } : a))
    console.log(selectObject)
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.name) {
      case "odd":
        console.log(selectObject)
        setCards(prevCard => prevCard.map(a => selectObject.includes(a.num) ? { ...a, odd: !a.odd, active: false } : a))
        setSelectObject([])
        handleConvert()
        break;
      case "even":
        console.log(selectObject)
        setCards(prevCard => prevCard.map(a => selectObject.includes(a.num) ? { ...a, even: !a.even, active: false } : a))
        setSelectObject([])
        handleConvert()
        break;
      case "data":
        setCards(prevCard => prevCard.map(a => selectObject.includes(a.num) ? { ...a, data: !a.data, active: false } : a))
        setSelectObject([])
        handleConvert()
        break;
      case "fac":
        setCards(prevCard => prevCard.map(a => selectObject.includes(a.num) ? { ...a, fac: !a.fac, active: false } : a))
        setSelectObject([])
        handleConvert()
        break;
      case "reset":
        setCardFormatDto(defaultDto);
        toggleRefresh();
        break;
      default:
        break;
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardFormatDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  useEffect(() => {
    numEven = 0;
    evenStart = -1;
    numOdd = 0;
    oddStart = -1;
    numFac = 0;
    facStart = -1;
    numData = 0;
    dataStart = -1;
    setCards(Array.from({ length: data.bits }).map((_, i) => ({ num: i, data: false, fac: false, odd: false, even: false, active: false })));
  }, [data.bits, refresh]);
  //className='h-[60vh] overflow-y-auto hidden-scroll'
  return (
    <ComponentCard title="Add Card Format">

      {/* {scanCard && <Modals isWide={false} body={<ScanCard onStartScan={handleStartScan} />} closeToggle={() => setScanCard(false)} />} */}

      <div className="flex justify-center flex-col gap-6 sm:flex-row sm:gap-8">
        <div className='flex flex-col gap-1'>
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="text" id="cardFormatName" onChange={handleChange} value={data.name} />
        </div>
                <div className='flex flex-col gap-1'>
          <Label htmlFor="facility">Facility</Label>
          <Input name="facility" type="text" id="cardFormatName" onChange={handleChange} value={data.facility} />
        </div>
        <div className='flex flex-col gap-1'>
          <Label htmlFor="bits">Bits</Label>
          <Input name="bits" type="number" id="bits" onChange={handleChange} value={data.bits} />
        </div>
      </div >
      <div className='flex justify-center flex-col gap-5 p-5'>
        <div className='flex flex-wrap gap-2 justify-center'>
          {cards.map((data, i) =>
            <Card key={i} data={data} handleCardClick={handleCardClick} />
          )}
        </div>
        <div className="flex justify-center gap-2">
          <Button startIcon={<div
            className={`w-3 h-3 rounded-full bg-blue-500 shadow-sm`}
          ></div>} onClickWithEvent={handleClick} name='odd' className='w-50' variant='outline'>Odd Parity</Button>
          <Button startIcon={<div
            className={`w-3 h-3 rounded-full bg-orange-500 shadow-sm`}
          ></div>} onClickWithEvent={handleClick} name='even' className='w-50' variant='outline'>Even Parity</Button>
          <Button startIcon={
            <div
              className={`w-3 h-3 rounded-full bg-green-500 shadow-sm`}
            ></div>
          } onClickWithEvent={handleClick} name='data' className='w-50' variant='outline'>Card Data</Button>
          <Button startIcon={<div
            className={`w-3 h-3 rounded-full bg-yellow-500 shadow-sm`}
          ></div>} onClickWithEvent={handleClick} name='fac' className='w-50' variant='outline'>Facility</Button>
        </div>
        <div className='flex justify-center gap-4'>
          <Button name='create' onClickWithEvent={handleClickWithEvent} className='w-50'>Create</Button>
          <Button name='cancle' onClickWithEvent={handleClickWithEvent} className='w-50' variant='danger'>Cancle</Button>
          <Button name='reset' onClickWithEvent={handleClick} className='w-50' >Reset</Button>
        </div>

      </div>


    </ComponentCard >
  )
}

export default CardFormatForm