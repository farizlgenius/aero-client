import { DoorDirection } from "../../enum/DoorDirection";
import { BaseDto } from "../BaseDto";
import { CardFormatDto } from "../CardFormat/CardFormatDto";
import { ReaderDto } from "../Reader/ReaderDto";
import { RequestExitDto } from "../RequestExit/RequestExitDto";
import { SensorDto } from "../Sensor/SensorDto";
import { StrikeDto } from "../Strike/StrikeDto";

export interface DoorDto extends BaseDto {
  id:number;
  scpId:number;
  name: string;
  accessConfig: number;
  pairDoorNo: number;
  direction:DoorDirection;
  acrId:number;

  // Reader setting for Reader In
  readers:ReaderDto[] ;
  readerOutConfiguration:number;

  // Output setting for strike
  strk:StrikeDto;

  // Input setting for sensor
  sensor:SensorDto ;

  // Input setting for rex0
  requestExits:RequestExitDto[];

  cardFormat:number;
  antiPassbackMode: number;
  areaInId: number;
  areaOutId: number;
  spareTags: number;
  accessControlFlags: number;
  mode:number;
  modeDesc:string;
  offlineMode: number;
  offlineModeDesc:string;
  defaultMode: number;
  defaultModeDesc:string;
  defaultLEDMode: number;
  preAlarm: number;
  antiPassbackDelay: number;

  // Advance Feature
  strkT2: number;
  dcHeld2: number;
  strkFollowPulse: number;
  strkFollowDelay: number;
  nExtFeatureType: number;
  ilPBSio: number;
  ilPBNumber: number;
  ilPBLongPress: number;
  ilPBOutSio: number;
  ilPBOutNum: number;
  dfOfFilterTime: number;
  maskHeldOpen:boolean;
  maskForceOpen:boolean;
}