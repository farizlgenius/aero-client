export type DeviceStatus = "online" | "offline" | "alarm";

export type DeviceType = "CCTV" | "DOOR" | "READER";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  x: number;
  y: number;
  status: DeviceStatus;
}