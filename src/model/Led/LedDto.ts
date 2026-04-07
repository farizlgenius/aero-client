export interface LedDto {
      id:number;
      ledMode:number;
      config:LedConfigDto[]
      locationId:number;

}

export interface LedConfigDto{
      rLedId:number;
      onColor:number;
      offColor:number;
      onTime:number;
      offTime:number;
      repeatCount:number;
      beepCount:number;
}