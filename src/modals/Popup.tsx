import React, { PropsWithChildren } from 'react'

export interface PopupProp {
    succesFlag?: boolean;
    body?: string[] | string;
    handleClick:(e: React.MouseEvent<HTMLDivElement>) => void
}


const Popup: React.FC<PropsWithChildren<PopupProp>> = ({ body,succesFlag = false,handleClick }) => {
    return (
        <>
            <div onClick={handleClick} className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999" >
                <div className="modal-close-btn fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>
                <div className="relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">

                    <div className="text-center">

                        <div className="relative flex items-center justify-center z-1 mb-7">
                            {succesFlag ?
                                <div className="mx-auto flex items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-15">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-10 text-green-600">
                                        <path d="m4.5 12.75 6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </div>
                                :

                                <div className="mx-auto flex items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-15">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-10 text-red-600">
                                        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            }

                        </div>

                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                            {succesFlag ? "Success" : "Failed"}
                        </h4>

                        {!succesFlag && (
                            <>
                                {Array.isArray(body) ?
                                    <p className="text-xl leading-6 text-gray-500 dark:text-gray-400">
                                        {body.map((a: string, i: number) => (
                                            <div key={i}>{a}</div>
                                        ))}
                                    </p>
                                    :
                                    <p className="text-xl leading-6 text-gray-500 dark:text-gray-400">
                                        {body}
                                    </p>
                                }
                            </>
                        )

                        }



                    </div>
                </div>
            </div>
        </>
    )
}

export default Popup