import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Device, DeviceType } from "./Type";
import DeviceIcon from "./DeviceIcon";


export default function MapView() {
  const [devices, setDevices] = useState<Device[]>([
      {
    id: "cam-01",
    name: "Entrance Camera",
    type: "CCTV",
    x: 200,
    y: 150,
    status: "online",
  },
  {
    id: "door-01",
    name: "Main Door",
    type: "DOOR",
    x: 350,
    y: 300,
    status: "offline",
  },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [newDeviceType, setNewDeviceType] =
    useState<DeviceType>("CCTV");

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!editMode) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDevices(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `${newDeviceType}-${prev.length + 1}`,
        type: newDeviceType,
        x,
        y,
        status: "offline",
      },
    ]);
  };

  const handleCommand = (device: Device, command: string) => {
//     sendDeviceCommand(device.id, command);
  };

  return (
    <>
      {/* Toolbar */}
      <div style={{ padding: 8 }}>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? "Exit Edit Mode" : "Add Device"}
        </button>

        {editMode && (
          <select
            value={newDeviceType}
            onChange={e => setNewDeviceType(e.target.value as DeviceType)}
          >
            <option value="CCTV">CCTV</option>
            <option value="DOOR">DOOR</option>
            <option value="READER">READER</option>
          </select>
        )}
      </div>

      <TransformWrapper>
        <TransformComponent>
          <svg
            width={800}
            height={600}
            viewBox="0 0 800 600"
            onClick={handleMapClick}
            style={{ border: "1px solid #ccc" }}
          >
            <image
              href="images/map/floor.png"
              x={0}
              y={0}
              width={800}
              height={600}
            />

            {devices.map(device => (
              <DeviceIcon
                key={device.id}
                device={device}
                onCommand={handleCommand}
              />
            ))}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </>
  );
}