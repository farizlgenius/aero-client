import React, { PropsWithChildren } from 'react'
import { AddIcon, TrashBinIcon } from '../../../icons'
import { FeatureDto } from '../../../model/Role/FeatureDto';
import { Dropdown } from '../../../pages/UiElements/Dropdown';
import { ActionButton } from '../../../model/ActionButton';

interface SearchProp {
    onSelectPageSize: (data: string) => void;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    permission?: FeatureDto;
    action?: ActionButton[];
}

const Search: React.FC<PropsWithChildren<SearchProp>> = ({ onSelectPageSize, onClick, permission, action }) => {
    console.log(permission)
    return (
        <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <div className="inline-flex items-center shadow-theme-xs">
                    {/* <button type="button" className="inline-flex items-center gap-2 bg-brand-500 px-4 py-3 text-sm font-medium text-white ring-1 ring-inset ring-brand-500 transition first:rounded-l-lg last:rounded-r-lg hover:bg-brand-500">
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.77644 3.24175C9.9172 3.17137 10.0829 3.17137 10.2236 3.24175L15.3708 5.81524L10.3354 8.33283C10.1243 8.43839 9.87577 8.43839 9.66463 8.33283L4.62931 5.81524L9.77644 3.24175ZM3.70215 7.02871V13.412C3.70215 13.6013 3.80915 13.7745 3.97855 13.8592L9.24968 16.4947L9.24967 9.78321C9.16279 9.75247 9.07733 9.71623 8.99383 9.67447L3.70215 7.02871ZM10.7497 16.495V9.78347C10.8368 9.75267 10.9225 9.71634 11.0062 9.67447L16.2979 7.02871V13.412C16.2979 13.6013 16.1909 13.7745 16.0215 13.8592L10.7497 16.495ZM9.41414 17.4826L9.10563 18.0997C9.66867 18.3812 10.3314 18.3812 10.8944 18.0997L16.6923 15.2008C17.3699 14.862 17.7979 14.1695 17.7979 13.412V6.58782C17.7979 5.83027 17.3699 5.13774 16.6923 4.79896L10.8944 1.9001C10.3314 1.61859 9.66868 1.61859 9.10563 1.9001L9.44103 2.57092L9.10563 1.9001L3.30774 4.79896C2.63016 5.13774 2.20215 5.83027 2.20215 6.58782V13.412C2.20215 14.1695 2.63016 14.862 3.30774 15.2008L9.10563 18.0997L9.41414 17.4826Z" fill=""></path>
                        </svg>
                        Button Text
                    </button> */}
                    {permission?.isCreate &&
                        <button onClick={onClick} name='add' type="button" className="-ml-px inline-flex items-center gap-2 bg-transparent px-4 py-3 text-sm font-medium text-brand-500 ring-1 ring-inset ring-brand-500 first:rounded-l-lg last:rounded-r-lg hover:bg-brand-500 hover:text-white">
                            <AddIcon />
                            Add
                        </button>

                    }

                    {
                        permission?.isDelete &&
                        <button onClick={onClick} name='delete' type="button" className="-ml-px inline-flex items-center gap-2 bg-transparent px-4 py-3 text-sm font-medium text-brand-500 ring-1 ring-inset ring-brand-500 first:rounded-l-lg last:rounded-r-lg hover:bg-brand-500 hover:text-white">
                            <TrashBinIcon />
                            Delete
                        </button>

                    }

                    {
                        permission?.isAction &&
                        action?.map((a, i) => {
                            return <button key={i} onClick={onClick} name={a.lable} type="button" className="-ml-px inline-flex items-center gap-2 bg-transparent px-4 py-3 text-sm font-medium text-brand-500 ring-1 ring-inset ring-brand-500 first:rounded-l-lg last:rounded-r-lg hover:bg-brand-500 hover:text-white">
                                    {a.icon}
                                    {a.buttonName}
                                </button>
                        })

                    }

                </div>
                {/* <span className="text-gray-500 dark:text-gray-400">
                    Show
                </span>
                <div className="relative z-20 bg-transparent">
                    <select onChange={(e) => onSelectPageSize(e.target.value) } className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                        <option value="10" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                            10
                        </option>
                        <option value="25" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                            25
                        </option>
                        <option value="50" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                            50
                        </option>
                                                <option value="75" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                            75
                        </option>
                                                <option value="100" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                            100
                        </option>
                    </select>
                    <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
                        <svg className="stroke-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            </path>
                        </svg>
                    </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                    entries
                </span> */}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                    <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" fill="">
                            </path>
                        </svg>
                    </button>
                    <input x-model="search" placeholder="Search..." className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]" type="text" />
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 ">
                    Download
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0018 14.083C9.7866 14.083 9.59255 13.9924 9.45578 13.8472L5.61586 10.0097C5.32288 9.71688 5.32272 9.242 5.61552 8.94902C5.90832 8.65603 6.3832 8.65588 6.67618 8.94868L9.25182 11.5227L9.25182 3.33301C9.25182 2.91879 9.5876 2.58301 10.0018 2.58301C10.416 2.58301 10.7518 2.91879 10.7518 3.33301L10.7518 11.5193L13.3242 8.94866C13.6172 8.65587 14.0921 8.65604 14.3849 8.94903C14.6777 9.24203 14.6775 9.7169 14.3845 10.0097L10.5761 13.8154C10.4385 13.979 10.2323 14.083 10.0018 14.083ZM4.0835 13.333C4.0835 12.9188 3.74771 12.583 3.3335 12.583C2.91928 12.583 2.5835 12.9188 2.5835 13.333V15.1663C2.5835 16.409 3.59086 17.4163 4.8335 17.4163H15.1676C16.4102 17.4163 17.4176 16.409 17.4176 15.1663V13.333C17.4176 12.9188 17.0818 12.583 16.6676 12.583C16.2533 12.583 15.9176 12.9188 15.9176 13.333V15.1663C15.9176 15.5806 15.5818 15.9163 15.1676 15.9163H4.8335C4.41928 15.9163 4.0835 15.5806 4.0835 15.1663V13.333Z" fill="currentColor">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Search