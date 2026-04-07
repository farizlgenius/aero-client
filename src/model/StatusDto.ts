export interface StatusDto {
  scpId: number;
  driverId: number;
  status: number | string;
  tamper: number | string;
  ac: number | string;
  batt: number | string;
}
