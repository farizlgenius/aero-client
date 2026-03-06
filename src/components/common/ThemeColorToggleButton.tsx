import { useTheme } from "../../context/ThemeContext";

export const ThemeColorToggleButton: React.FC = () => {
  const { accentColor, setAccentColor } = useTheme();

  return (
    <label
      title="Choose accent color"
      aria-label="Choose accent color"
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 2.08337C5.62775 2.08337 2.08337 5.62775 2.08337 10C2.08337 14.3723 5.62775 17.9167 10 17.9167C11.3807 17.9167 12.5 16.7974 12.5 15.4167V15.0693C12.5 14.3374 13.0874 13.75 13.8193 13.75H14.1667C16.2378 13.75 17.9167 12.0711 17.9167 10C17.9167 5.62775 14.3723 2.08337 10 2.08337Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="6.25" cy="9.16671" r="1.04167" fill="currentColor" />
        <circle cx="9.58325" cy="6.66671" r="1.04167" fill="currentColor" />
        <circle cx="13.3333" cy="8.33329" r="1.04167" fill="currentColor" />
      </svg>
      <input
        type="color"
        value={accentColor}
        onChange={(e) => setAccentColor(e.target.value)}
        className="absolute inset-0 cursor-pointer rounded-full opacity-0"
      />
      <span
        className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border border-white dark:border-gray-900"
        style={{ backgroundColor: accentColor }}
      />
    </label>
  );
};
