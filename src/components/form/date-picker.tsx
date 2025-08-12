import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  useEffect(() => {
    // const flatPickr = flatpickr(`#${id}`, {
    //   enableTime:true,
    //   mode: mode || "single",
    //   static: true,
    //   monthSelectorType: "static",
    //   dateFormat: "Y-m-d",
    //   defaultDate,
    //   onChange,
    // });

    const flatPickr = flatpickr(`#${id}`, {
      enableTime: true,         // enable time selection
      time_24hr: true,          // 24h format (false -> AM/PM)
      enableSeconds: false,     // set true if you need seconds
      minuteIncrement: 5,       // minute steps
      altInput: true,           // show a human-friendly input
      altFormat: "F j, Y H:i",  // human display format
      dateFormat: "Y-m-d H:i",  // actual value format (but you usually read the Date object)
      onChange,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);


  // const localIsoWithOffset = toLocalISOWithOffset(selectedDates[0]);
  // console.log(localIsoWithOffset); // e.g. "2025-08-10T14:35:00+07:00"

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
