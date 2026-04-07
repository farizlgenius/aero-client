import { useEffect, useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import Input from "../../components/form/input/InputField"
import Label from "../../components/form/Label"
import Select from "../../components/form/Select"
import { Options } from "../../model/Options"
import { LedDto } from "../../model/Led/LedDto"
import { useLocation } from "../../context/LocationContext"
import React from "react"
import { send } from "../../api/api"
import { SettingEndpoint } from "../../endpoint/SettingEndpoint"
import { DoorIcon } from "../../icons"
import Button from "../../components/ui/button/Button"
import Helper from "../../utility/Helper"
import { useToast } from "../../context/ToastContext"
import { AuthToast, SettingToast } from "../../model/ToastMessage"

const mode = [
    {
        id: 1,
        mode: "Disabled"
    },
    {
        id: 2,
        mode: "Unlocked"
    },
    {
        id: 3,
        mode: "Locked"
    },
    {
        id: 4,
        mode: "Facility"
    },
    {
        id: 5,
        mode: "Card Only"
    },
    {
        id: 6,
        mode: "PIN Only"
    },
    {
        id: 7,
        mode: "Card and PIN"
    },
    {
        id: 8,
        mode: "PIN or Card"
    },
    {
        id: 11,
        mode: "Reject"
    },
    {
        id: 12,
        mode: "Grant"
    },
    {
        id: 13,
        mode: "Prompt for User Command"
    },
    {
        id: 14,
        mode: "Second User"
    },
    {
        id: 15,
        mode: "Second PIN"
    },
    {
        id: 16,
        mode: "Wait (for host response)"
    }
]


const LedModeTable: Options[] = [
    {
        label: "Table 1",
        value: 1,
    }, {
        label: "Table 2",
        value: 2
    }, {
        label: "Table 3",
        value: 3
    }
]

const color: Options[] = [
    {
        label: "Off",
        value: 0,
        additionalInfo: <div className="w-3 h-3 rounded-full bg-gray-500 shadow-sm"></div>
    },
    {
        label: "Red",
        value: 1,
        additionalInfo: <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
    }, {
        label: "Green",
        value: 2,
        additionalInfo: <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
    },
    {
        label: "Amber",
        value: 3,
        additionalInfo: <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
    }, {
        label: "Blue",
        value: 4,
        additionalInfo: <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
    },
    {
        label: "Magenta",
        value: 5,
        additionalInfo: <div className="w-3 h-3 rounded-full bg-pink-500 shadow-sm"></div>
    },
    {
        label: "Cyan",
        value: 6,
        additionalInfo: <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm"></div>
    },
    {
        label: "White",
        value: 7,
        additionalInfo: <div className="w-3 h-3 rounded-full bg-gray-50 shadow-sm"></div>
    }
]

export const Led = () => {
    const { locationId } = useLocation();
    const [selectedMode, setSelectedMode] = useState<number>(1);
    const defaultDto: LedDto = {
        id: 0,
        ledMode: 0,
        config: [
        {
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },
        {
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },
        {
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },{
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        },
        {
            rLedId: 1,
            onColor: 3,
            offColor: 0,
            onTime: 0,
            offTime: 0,
            repeatCount: 0,
            beepCount: 0
        }
    ],
        locationId: locationId
    }

    const [dto, setDto] = useState<LedDto>(defaultDto);
    const [refresh,setRefresh] = useState<boolean>(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const { toggleToast } = useToast();

    const fetchLed = async (mode: number) => {
        const res = await send.get(SettingEndpoint.GET_BY_ID(mode))
        if (res.data) {
            console.log(res.data.data)
            setDto(res.data.data);
        }
    }

    const updateLed = async () => {
        const res = await send.put(SettingEndpoint.UPDATE_LED,dto);
        if(Helper.handleToastByResCode(res,SettingToast.UDPATE_LED,toggleToast)){
            toggleRefresh();
        }
    }

    useEffect(() => {
        fetchLed(selectedMode);
    }, [selectedMode]);

    console.log("Render DTO", dto);


    return (
        <>
            <PageBreadcrumb pageTitle="LED Reader" />
            <div className="flex flex-col gap-5">
                <div className="flex justify-center items-center rounded-xl border border-gray-200 p-6 dark:border-gray-800 border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] " >
                    <Select name={"ledmode"} options={LedModeTable} defaultValue={selectedMode} onChange={e => setSelectedMode(Number(e))} />
                </div>
                <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800 border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] " >
                    <div className="mb-10"><h3 className="text-lg font-semibold text-gray-900 dark:text-white">LED Settings</h3><p className="text-sm text-gray-500 dark:text-gray-400">Redaer LED configuration</p></div>
                    <div className="grid grid-cols-7 gap-4">
                        <>
                            <div className="flex justify-center items-center">
                                <Label>ACR Mode</Label>
                            </div>
                            <div className="flex justify-center items-center">
                                <Label>On Color</Label>
                            </div>
                            <div className="flex justify-center items-center">
                                <Label>Off Color</Label>
                            </div>
                            <div className="flex justify-center items-center">
                                <Label>On Time</Label>
                            </div>
                            <div className="flex justify-center items-center">
                                <Label>Off time</Label>
                            </div>
                            <div className="flex justify-center items-center">
                                <Label>Repeat Count</Label>
                            </div>
                            <div className="flex justify-center items-center">
                                <Label>Beep Count</Label>
                            </div>
                        </>
                        {mode.map((m, i) => {
                            const config = dto.config?.[i] ?? {
                                                        rLedId: 0,
                                                        onColor: 0,
                                                        offColor: 0,
                                                        onTime: 0,
                                                        offTime: 0,
                                                        repeatCount: 0,
                                                        beepCount: 0
                                                        };

                            return (
                                <React.Fragment key={i}>
                                    <div className="flex items-center">
                                        <Label>{m.mode}</Label>
                                    </div>
                                    <div>
                                        <Select
                                            icon={color.find(x => x.value === config.onColor)?.additionalInfo ?? ""}
                                            options={color}
                                            defaultValue={config.onColor ?? 0}
                                            name=""
                                            onChange={(value) => {
                                                setDto(prev => {
                                                    const newConfig = [...prev.config];

                                                    newConfig[i] = {
                                                        ...newConfig[i],
                                                        onColor: Number(value)
                                                    };

                                                    return {
                                                        ...prev,
                                                        config: newConfig
                                                    };
                                                });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Select
                                            icon={color.find(x => x.value === config.offColor)?.additionalInfo ?? ""}
                                            options={color}
                                            defaultValue={config.offColor ?? 0}
                                            name=""
                                            onChange={(value) => {
                                                setDto(prev => {
                                                    const newConfig = [...prev.config];

                                                    newConfig[i] = {
                                                        ...newConfig[i],
                                                        offColor: Number(value)
                                                    };

                                                    return {
                                                        ...prev,
                                                        config: newConfig
                                                    };
                                                });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="number"
                                            value={config.onTime}
                                            onChange={(e) => {
                                                setDto(prev => {
                                                    const newConfig = [...prev.config];

                                                    newConfig[i] = {
                                                        ...newConfig[i],
                                                        onTime: Number(e.target.value)
                                                    };

                                                    return {
                                                        ...prev,
                                                        config: newConfig
                                                    };
                                                });
                                            }}
                                        />
                                    </div>
                                    <div><Input
                                        type="number"
                                        value={config.offTime}
                                        onChange={(e) => {
                                            setDto(prev => {
                                                const newConfig = [...prev.config];

                                                newConfig[i] = {
                                                    ...newConfig[i],
                                                    offTime: Number(e.target.value)
                                                };

                                                return {
                                                    ...prev,
                                                    config: newConfig
                                                };
                                            });
                                        }}
                                    /></div>
                                    <div><Input
                                        type="number"
                                        value={config.repeatCount}
                                        onChange={(e) => {
                                            setDto(prev => {
                                                const newConfig = [...prev.config];

                                                newConfig[i] = {
                                                    ...newConfig[i],
                                                    repeatCount: Number(e.target.value)
                                                };

                                                return {
                                                    ...prev,
                                                    config: newConfig
                                                };
                                            });
                                        }}
                                    /></div>
                                    <div><Input
                                        type="number"
                                        value={config.beepCount}
                                        onChange={(e) => {
                                            setDto(prev => {
                                                const newConfig = [...prev.config];

                                                newConfig[i] = {
                                                    ...newConfig[i],
                                                    beepCount: Number(e.target.value)
                                                };

                                                return {
                                                    ...prev,
                                                    config: newConfig
                                                };
                                            });
                                        }}
                                    /></div>
                                </React.Fragment>
                            )
                        })}
                            <div>
                                <Button onClick={updateLed}>Save</Button>
                            </div>
                                                             



                    </div>
                </div>
            </div>


        </>
    )
}
