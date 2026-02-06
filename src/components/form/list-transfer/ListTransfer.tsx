import React, { JSX, useEffect, useState } from "react";
import Label from "../Label";
import { Options } from "../../../model/Options";


// Generic constraint: item must have id + label (or override labelKey)
// export interface BaseItem {
// id: number;
// label: string;
// }


interface ListTransferProps<T extends Options> {
      availableItems: T[];
      selectedItems?: T[];
      onChange?: (items: T[]) => void;
}


export default function ListTransfer<T extends Options>({
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
            const moving = leftItems.filter((i) => selectedLeft.has(Number(i.value)));
            const nextLeft = leftItems.filter((i) => !selectedLeft.has(Number(i.value)));
            const nextRight = [...rightItems, ...moving];

            setLeftItems(nextLeft);
            setRightItems(nextRight);
            setSelectedLeft(new Set());
            onChange?.(nextRight);
      };


      const moveToLeft = (): void => {
            const moving = rightItems.filter((i) => selectedRight.has(Number(i.value)));
            const nextRight = rightItems.filter((i) => !selectedRight.has(Number(i.value)));
            const nextLeft = [...leftItems, ...moving];


            setRightItems(nextRight);
            setLeftItems(nextLeft);
            setSelectedRight(new Set());
            onChange?.(nextRight);
      };


      const itemClass = (selected: boolean): string =>
            `px-3 py-2 rounded-lg cursor-pointer transition mb-1 ${selected ? "bg-blue-100 text-blue-700" : "hover:bg-blue-500"
            }`;

      useEffect(() => {
            console.log(availableItems)
      },[])

      return (
            <div className="flex items-center justify-center p-6 w-full">
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-5 items-center w-full">
                        {/* Left Box */}
                        <div>
                              <Label>Available</Label>
                              <div className="overflow-auto scrollbar-thin scrollbar-transparent h-64 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs bg-transparent">
                                    {leftItems.map((item) => (
                                          <div
                                                key={Number(item.value)}
                                                onClick={() => toggle(setSelectedLeft, Number(item.value))}
                                                className={itemClass(selectedLeft.has(Number(item.value)))}
                                          >
                                                {item.label}
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
                              <div className="overflow-auto scrollbar-thin scrollbar-transparent h-64 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs bg-transparent">
                                    {rightItems.map((item) => (
                                          <div
                                                key={Number(item.value)}
                                                onClick={() => toggle(setSelectedRight, Number(item.value))}
                                                className={itemClass(selectedRight.has(Number(item.value)))}
                                          >
                                                {item.label}
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </div>
            </div>
      );
}