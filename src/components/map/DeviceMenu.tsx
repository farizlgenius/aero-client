import { Device } from "./Type";


interface Props {
  device: Device;
  onCommand: (command: string) => void;
}

export default function DeviceMenu({ device, onCommand }: Props) {
  return (
    <foreignObject x={device.x + 12} y={device.y + 10} width={160} height={120}>
      <div
        style={{
          background: "white",
          border: "1px solid #aaa",
          borderRadius: 4,
          padding: 6,
          fontSize: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        <strong>{device.name}</strong>

        {device.type === "DOOR" && (
          <>
            <button onClick={() => onCommand("UNLOCK")}>Unlock</button>
            <button onClick={() => onCommand("LOCK")}>Lock</button>
          </>
        )}

        {device.type === "CCTV" && (
          <button onClick={() => onCommand("OPEN_STREAM")}>
            Open Stream
          </button>
        )}
      </div>
    </foreignObject>
  );
}