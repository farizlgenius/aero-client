export interface StatusDto {
  macAddress: string;
  componentId: number;
  status: number | string;
  tamper: number | string;
  ac: number | string;
  batt: number | string;
}
