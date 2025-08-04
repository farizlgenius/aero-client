import React, { PropsWithChildren, ReactNode } from 'react'

interface FullScreenModalProps {
    body?: ReactNode;
    onCloseModal?: () => void
}

const FullScreenModal: React.FC<PropsWithChildren<FullScreenModalProps>> = ({ body, onCloseModal }) => {
    return (
        <>
            <div className="fixed left-0 top-0 z-99999 flex h-screen w-full flex-col items-center justify-between overflow-y-auto overflow-x-hidden bg-white p-6 dark:bg-gray-900 lg:p-10">

                <div>
                    {body}
                </div>

                <div className="mt-8 flex w-full items-center justify-end gap-3">
                    <button onClick={onCloseModal} type="button" className="flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        Close
                    </button>
                    <button type="button" className="flex justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
                        Submit
                    </button>
                </div>
            </div>

        </>
    )
}

export default FullScreenModal