import { useState } from "react";
import { Device } from "./Type";
import DeviceMenu from "./DeviceMenu";
import DeviceTooltip from "./DeviceTooltop";


interface Props {
  device: Device;
  onCommand: (device: Device, command: string) => void;
}

export default function DeviceIcon({ device, onCommand }: Props) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const color =
    device.status === "online"
      ? "green"
      : device.status === "alarm"
      ? "orange"
      : "red";

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMenuOpen(false);
      }}
      onClick={e => {
        e.stopPropagation();
        setMenuOpen(prev => !prev);
      }}
      style={{ cursor: "pointer" }}
    >
      <circle cx={device.x} cy={device.y} r={10} fill={color} />

      {hovered && <DeviceTooltip device={device} />}

      {menuOpen && (
        <DeviceMenu
          device={device}
          onCommand={command => onCommand(device, command)}
        />
      )}
    </g>
  );
}