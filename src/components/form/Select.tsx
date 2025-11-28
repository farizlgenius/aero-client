import React, { useEffect, useState } from "react";
import { Options } from "../../model/Options";

interface SelectProps {
  id?: string;
  isString?: boolean
  name: string;
  options: Options[];
  placeholder?: string;
  onChange?: (value: string) => void;
  onChangeWithEvent?: (value: string, e: React.ChangeEvent<HTMLSelectElement>) => void
  className?: string;
  defaultValue?: string | number;
  icon?:React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  id,
  isString,
  name = "",
  options,
  placeholder = "Select an option",
  onChange,
  onChangeWithEvent,
  className = "",
  defaultValue = "",
  icon
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string | number>(defaultValue);
  const [refresh,setRefresh] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    if (onChange != undefined) {
      onChange(value);
    }
    if (onChangeWithEvent != undefined) {
      onChangeWithEvent(value, e); // Trigger parent handler
    }

  };
  useEffect(() => {
    console.log("Refresh triggered!", refresh);
  }, [refresh]);

  useEffect(() => {
    setRefresh(prev => !prev)
  }, [options])

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <select
        id={id}
        name={name}
        className={`${icon ? 'pl-8 ' : ''}h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${selectedValue
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
          } ${className}`}
        value={selectedValue}
        onChange={handleChange}
      >
        {/* Placeholder option */}
        <option
          value={isString ? "" : -1}
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option) => (
          <option
            key={option.value + crypto.randomUUID()}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>

  );
};

export default Select;
