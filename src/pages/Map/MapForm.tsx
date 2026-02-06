import React, { PropsWithChildren, useState } from 'react'
import { FormProp } from "../../model/Form/FormProp";
import Button from '../../components/ui/button/Button';
import { MapDto } from '../../model/Map/MapDto';
import MapView from '../../components/map/MapView';

export const MapForm: React.FC<PropsWithChildren<FormProp<MapDto>>> = ({ type, setDto, handleClick, dto }) => {
      return (
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                  <div className="flex flex-col gap-6 items-center">
                        <div>
                              <div className='w-100'>
                                    <div className='flex flex-col gap-5 w-100'>
                                          <div>
                                                <div style={{ width: "100vw", height: "100vh" }}>
                                                      <MapView />
                                                </div>
                                          </div>
                                          <div className='flex gap-4'>
                                                <Button onClickWithEvent={handleClick} variant='danger' name='close' className="w-50" size="sm">Cancel</Button>
                                          </div>

                                    </div>
                              </div>
                        </div >
                  </div >
            </div>
      );
}