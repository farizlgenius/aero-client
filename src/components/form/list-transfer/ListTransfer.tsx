import React, { JSX, useEffect, useState } from "react";
import Label from "../Label";
import { NoMacBaseDto } from "../../../model/NoMacBaseDto";
import { GroupIcon } from "../../../icons";


// Generic constraint: item must have id + label (or override labelKey)
// export interface BaseItem {
// id: number;
// label: string;
// }


interface ListTransferProps<T extends NoMacBaseDto> {
      availableItems: T[];
      selectedItems?: T[];
      onChange?: (items: T[]) => void;
}


export default function ListTransfer<T extends NoMacBaseDto>({
      availableItems,
      selectedItems = [],
      onChange,
}: ListTransferProps<T>): JSX.Element {
      const [leftItems, setLeftItems] = useState<T[]>(availableItems);
      const [rightItems, setRightItems] = useState<T[]>(selectedItems);


      const [selectedLeft, setSelectedLeft] = useState<Set<number>>(new Set());
      const [selectedRight, setSelectedRight] = useState<Set<number>>(new Set());


      const toggle = (
            setFn: React.Dispatch<React.SetStateAction<Set<number>>>,
            id: number
      ): void => {
            setFn((prev) => {
                  const next = new Set(prev);
                  next.has(id) ? next.delete(id) : next.add(id);
                  return next;
            });
      };


      const moveToRight = (): void => {
            const moving = leftItems.filter((i) => selectedLeft.has(Number(i.componentId)));
            const nextLeft = leftItems.filter((i) => !selectedLeft.has(Number(i.componentId)));
            const nextRight = [...rightItems, ...moving];

            setLeftItems(nextLeft);
            setRightItems(nextRight);
            setSelectedLeft(new Set());
            onChange?.(nextRight);
      };


      const moveToLeft = (): void => {
            const moving = rightItems.filter((i) => selectedRight.has(Number(i.componentId)));
            const nextRight = rightItems.filter((i) => !selectedRight.has(Number(i.componentId)));
            const nextLeft = [...leftItems, ...moving];


            setRightItems(nextRight);
            setLeftItems(nextLeft);
            setSelectedRight(new Set());
            onChange?.(nextRight);
      };


      // const itemClass = (selected: boolean): string =>
      //       `px-3 py-2 rounded-lg cursor-pointer transition mb-1 ${selected ? "bg-blue-100 text-blue-700" : "hover:bg-blue-500"
      //       }`;

      const itemClass = (selected: boolean): string =>
            `flex gap-4 rounded-lg border p-4 cursor-pointer transition select-none hover:shadow-md ${selected ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            }`;

      useEffect(() => {
            console.log(availableItems)
      }, [])

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

      return (
            <div className="flex items-center justify-center p-6 w-full">
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-5 items-center w-full">
                        {/* Left Box */}
                        <div>
                              <Label>Available</Label>
                              <div className="flex flex-col gap-2 overflow-auto scrollbar-thin scrollbar-transparent h-64 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs bg-transparent">
                                    {leftItems.map((item) => (
                                          <div
                                                key={Number(item.componentId)}
                                                onClick={() => toggle(setSelectedLeft, Number(item.componentId))}
                                                className={itemClass(selectedLeft.has(Number(item.componentId)))}
                                          >
                                                {/* Icon */}
                                                <div className="pt-1">
                                                      <GroupIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 grid grid-cols-2 gap-y-1 gap-x-4">
                                                      <Info label="Name" value={item.name} />
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>


                        {/* Buttons */}
                        <div className="flex flex-col gap-3 items-center">
                              <button
                                    type="button"
                                    onClick={moveToRight}
                                    disabled={selectedLeft.size === 0}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-40"
                              >
                                    →
                              </button>
                              <button
                                    type="button"
                                    onClick={moveToLeft}
                                    disabled={selectedRight.size === 0}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-40"
                              >
                                    ←
                              </button>
                        </div>


                        {/* Right Box */}
                        <div>
                              <Label>Selected</Label>
                              <div className="flex flex-col gap-2 overflow-auto scrollbar-thin scrollbar-transparent h-64 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs bg-transparent">
                                    {rightItems.map((item) => (
                                          <div
                                                key={Number(item.componentId)}
                                                onClick={() => toggle(setSelectedRight, Number(item.componentId))}
                                                className={itemClass(selectedRight.has(Number(item.componentId)))}
                                          >
                                                {/* Icon */}
                                                <div className="pt-1">
                                                      <GroupIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 grid grid-cols-2 gap-y-1 gap-x-4">
                                                      <Info label="Name" value={item.name} />
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </div>
            </div>
      );
}