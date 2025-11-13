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
  flags: 0,
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
  const [selectObject, setSelectObject] = useState<CardComponent[]>([])
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(0);
  const [cards, setCards] = useState<CardComponent[]>([])
  const [refresh, setRefresh] = useState<boolean>(false);
  const toggleRefresh = () => setRefresh(!refresh);



  const handleAdvanceCardClick = (event: React.MouseEvent<HTMLDivElement>, data: CardComponent, index: number) => {
    //setSelectObject(prev => prev.map(d => d.num == data.num) ? selectObject.filter(a => a.num !== data.num) : [...prev, data]);
    setSelectObject(prev => {
      const exists = prev.some(i => i.num === data.num);
      if (exists) {
        return prev.filter(t => t.num !== data.num)
      } else {
        return [...prev, data]
      }
    })
    setCards(prev => prev.map(a => a.num == data.num ? { ...a, active: !a.active } : a))

  };

  //   const handleAdvanceCardClick = (event:React.MouseEvent<HTMLDivElement>, card:CardComponent, index:number) => {
  //   if (event.shiftKey && lastSelectedIndex !== null) {
  //     // Range selection
  //     const start = Math.min(lastSelectedIndex, index);
  //     const end = Math.max(lastSelectedIndex, index);
  //     const range = cards.slice(start, end + 1).map(c => c.num);

  //     setSelectObject(prev => Array.from(new Set([...prev, ...range])));
  //   } else if (event.ctrlKey || event.metaKey) {
  //     // Toggle single selection (Cmd/Ctrl)
  //     setSelectObject(prev =>
  //       prev.includes(card.num)
  //         ? prev.filter(id => id !== card.num)
  //         : [...prev, card.num]
  //     );
  //     setLastSelectedIndex(index);
  //   } else {
  //     // Normal click → select one
  //     setSelectObject([card.num]);
  //     setLastSelectedIndex(index);
  //   }
  // };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.name) {
      case "odd":
        console.log(selectObject)
        setCards(prev => prev.map(a => selectObject.some(b => b.num == a.num) ? { ...a, odd: !a.odd, active: false } : a))
        setSelectObject([])
        break;
      case "even":
        console.log(selectObject)
        setCards(prev => prev.map(a => selectObject.some(b => b.num == a.num) ? { ...a, even: !a.even, active: false } : a))
        setSelectObject([])
        break;
      case "data":
        setCards(prev => prev.map(a => selectObject.some(b => b.num == a.num) ? { ...a, data: !a.data, active: false } : a))
        setSelectObject(prev => prev.map(a => ({ ...a, data: !a.data, active: false })))
        setSelectObject([])
        break;
      case "fac":
        setCards(prev => prev.map(a => selectObject.some(b => b.num == a.num) ? { ...a, fac: !a.fac, active: false } : a))
        setSelectObject(prev => prev.map(a => ({ ...a, fac: !a.fac, active: false })))
        setSelectObject([])
        break;
      case "reset":
        setCardFormatDto(defaultDto);
        toggleRefresh()
        break;
      default:
        break;
    }
  }


  useEffect(() => {
    setCards(prev => prev.map(a => ({...a, 
      odd: a.num >= Number(data.poLoc) && a.num < Number(data.poLoc) + Number(data.poLn) && data.poLoc > -1 ? true : false,
      even: a.num >= Number(data.peLoc) && a.num < Number(data.peLoc) + Number(data.peLn) && data.peLoc > -1 ? true : false, 
      fac: a.num >= Number(data.fcLoc) && a.num < Number(data.fcLoc) + Number(data.fcLn) && data.fcLoc > -1 ? true : false, 
      data: a.num >= Number(data.chLoc) && a.num < Number(data.chLoc) + Number(data.chLn) && data.chLoc > -1 ? true : false, 
    })))
  }, [data])



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardFormatDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  useEffect(() => {
    setCardFormatDto(prev => ({
      ...prev,
      peLn: 0,
      peLoc: -1,
      poLn: 0,
      poLoc: -1,
      fcLn: 0,
      fcLoc: -1,
      chLn: 0,
      chLoc: -1
    }))
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
      <div className='grid grid-cols-4 gap-4'>
        <div className="flex justify-center flex-col gap-6 sm:flex-row sm:gap-8">
          <div className="flex items-center justify-center bg-gray-100 rounded-xl dark:bg-gray-800 p-5 gap-5">
            <div className='flex flex-col gap-1 justify-center'>
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Odd
              </h3>
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="poLoc">Start</Label>
              <Input className='w-20' name="poLoc" type="number" id="poLoc" onChange={handleChange} value={data.poLoc} />
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="poLn">Length</Label>
              <Input className='w-20' name="poLn" type="number" id="poLn" onChange={handleChange} value={data.poLn} />
            </div>
          </div>
        </div >
        <div className="flex justify-center flex-col gap-6 sm:flex-row sm:gap-8">
          <div className="flex items-center justify-center bg-gray-100 rounded-xl dark:bg-gray-800 p-5 gap-5">
            <div className='flex flex-col gap-1 justify-center'>
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Even
              </h3>
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="peLoc">Start</Label>
              <Input className='w-20' name="peLoc" type="number" id="cardFormatName" onChange={handleChange} value={data.peLoc} />
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="peLn">Length</Label>
              <Input className='w-20' name="peLn" type="number" id="peLn" onChange={handleChange} value={data.peLn} />
            </div>
          </div>
        </div>


        <div className="flex justify-center flex-col gap-6 sm:flex-row sm:gap-8">
          <div className="flex items-center justify-center bg-gray-100 rounded-xl dark:bg-gray-800 p-5 gap-5">
            <div className='flex flex-col gap-1 justify-center'>
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Facility
              </h3>
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="fcLoc">Start</Label>
              <Input className='w-20' name="fcLoc" type="number" id="fcLoc" onChange={handleChange} value={data.fcLoc} />
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="fcLn">Length</Label>
              <Input className='w-20' name="fcLn" type="number" id="fcLn" onChange={handleChange} value={data.fcLn} />
            </div>
          </div>

        </div >
        <div className="flex justify-center flex-col gap-6 sm:flex-row sm:gap-8">
          <div className="flex items-center justify-center bg-gray-100 rounded-xl dark:bg-gray-800 p-5 gap-5">
            <div className='flex flex-col gap-1 justify-center'>
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Data
              </h3>
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="chLoc">Start</Label>
              <Input className='w-20' name="chLoc" type="number" id="chLoc" onChange={handleChange} value={data.chLoc} />
            </div>
            <div className='flex flex-col gap-1'>
              <Label htmlFor="chLn">Length</Label>
              <Input className='w-20' name="chLn" type="number" id="chLn" onChange={handleChange} value={data.chLn} />
            </div>
          </div>

        </div>


      </div>



      <div className='flex justify-center flex-col gap-5 p-5'>
        <div className='flex flex-wrap gap-2 justify-center'>
          {cards.map((data, i) =>
            <Card key={i} data={data} handleCardClick={(e) => handleAdvanceCardClick(e, data, i)} />
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