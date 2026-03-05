export interface StatusDto {
  driverId: number;
  deviceId: number;
  status: number | string;
  tamper: number | string;
  ac: number | string;
  batt: number | string;
}
