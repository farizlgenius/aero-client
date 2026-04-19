import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { AddIcon, MoreDotIcon, TrashBinIcon } from '../../../icons'
import { PermissionDto } from '../../../model/Role/PermissionDto';
import { ActionButton } from '../../../model/ActionButton';
import { usePagination } from '../../../context/PaginationContext';
import { createPortal } from 'react-dom';

interface SearchProp {
    
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    permission?: PermissionDto;
    action?: ActionButton[];
    locationId?: number;
}

const Search: React.FC<PropsWithChildren<SearchProp>> = ({  onClick, permission, action,locationId }) => {
    const {setSearch} = usePagination();
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const moreBtnRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const hasMoreActions = Boolean((permission?.isEnabled && action?.length) || permission?.isEnabled);

    const updateMenuPosition = () => {
        if (!moreBtnRef.current) return;
        const rect = moreBtnRef.current.getBoundingClientRect();
        const menuWidth = 224;
        setMenuPosition({
            top: rect.bottom + 8,
            left: Math.max(12, rect.right - menuWidth)
        });
    };

    useEffect(() => {
        if (!isMoreOpen) return;

        updateMenuPosition();
        const handleOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (menuRef.current?.contains(target)) return;
            if (moreBtnRef.current?.contains(target)) return;
            setIsMoreOpen(false);
        };

        const handleLayout = () => updateMenuPosition();

        document.addEventListener("mousedown", handleOutside);
        window.addEventListener("resize", handleLayout);
        window.addEventListener("scroll", handleLayout, true);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
            window.removeEventListener("resize", handleLayout);
            window.removeEventListener("scroll", handleLayout, true);
        };
    }, [isMoreOpen]);

    const handleMoreClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onClick) {
            onClick(e);
        }
        setIsMoreOpen(false);
    };

    return (
        <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2">
                    {permission?.isCreated && locationId != -1 &&
                        <button onClick={onClick} name='add' type="button" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600">
                            <AddIcon />
                            Add
                        </button>

                    }

                    {
                        permission?.isDeleted &&
                        <button onClick={onClick} name='delete' type="button" className="inline-flex items-center gap-2 rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-error-600">
                            <TrashBinIcon />
                            Delete
                        </button>

                    }

                    {hasMoreActions && (
                        <div className="relative inline-block">
                            <button
                                ref={moreBtnRef}
                                type="button"
                                onClick={() => setIsMoreOpen(!isMoreOpen)}
                                className="dropdown-toggle inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                            >
                                More
                                <MoreDotIcon className="size-5" />
                            </button>
                            {isMoreOpen && createPortal(
                                <div
                                    ref={menuRef}
                                    style={{ top: menuPosition.top, left: menuPosition.left }}
                                    className="fixed z-[100001] w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
                                >
                                    {permission?.isEnabled && action?.map((a, i) => (
                                        <button
                                            key={i}
                                            onClick={handleMoreClick}
                                            name={a.lable}
                                            type="button"
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
                                        >
                                            {a.icon}
                                            {a.buttonName}
                                        </button>
                                    ))}
                                    {permission?.isEnabled && (
                                        <button
                                            onClick={handleMoreClick}
                                            name="download"
                                            type="button"
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
                                        >
                                            <svg className="fill-current" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.0018 14.083C9.7866 14.083 9.59255 13.9924 9.45578 13.8472L5.61586 10.0097C5.32288 9.71688 5.32272 9.242 5.61552 8.94902C5.90832 8.65603 6.3832 8.65588 6.67618 8.94868L9.25182 11.5227L9.25182 3.33301C9.25182 2.91879 9.5876 2.58301 10.0018 2.58301C10.416 2.58301 10.7518 2.91879 10.7518 3.33301L10.7518 11.5193L13.3242 8.94866C13.6172 8.65587 14.0921 8.65604 14.3849 8.94903C14.6777 9.24203 14.6775 9.7169 14.3845 10.0097L10.5761 13.8154C10.4385 13.979 10.2323 14.083 10.0018 14.083ZM4.0835 13.333C4.0835 12.9188 3.74771 12.583 3.3335 12.583C2.91928 12.583 2.5835 12.9188 2.5835 13.333V15.1663C2.5835 16.409 3.59086 17.4163 4.8335 17.4163H15.1676C16.4102 17.4163 17.4176 16.409 17.4176 15.1663V13.333C17.4176 12.9188 17.0818 12.583 16.6676 12.583C16.2533 12.583 15.9176 12.9188 15.9176 13.333V15.1663C15.9176 15.5806 15.5818 15.9163 15.1676 15.9163H4.8335C4.41928 15.9163 4.0835 15.5806 4.0835 15.1663V13.333Z" fill="currentColor" />
                                            </svg>
                                            Download
                                        </button>
                                    )}
                                </div>,
                                document.body
                            )}
                        </div>
                    )}

                </div>
                
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                    <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" fill="">
                            </path>
                        </svg>
                    </button>
                    <input onChange={e => setSearch(e.target.value)} placeholder="Search..." className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]" type="text" />
                </div>
            </div>
        </div>
    )
}

export default Search
