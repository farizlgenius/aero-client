import { Device } from "./Type";


interface Props {
  device: Device;
}

export default function DeviceTooltip({ device }: Props) {
  return (
    <foreignObject x={device.x + 12} y={device.y - 40} width={150} height={60}>
      <div
        style={{
          background: "white",
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: 6,
          fontSize: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <strong>{device.name}</strong>
        <div>Type: {device.type}</div>
        <div>Status: {device.status}</div>
      </div>
    </foreignObject>
  );
}