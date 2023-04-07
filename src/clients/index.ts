import { createRequestActor } from "@vue-start/request";

export const test = createRequestActor<
  {},
  {
    code: number;
    msg: string;
    data: { vehicleId: number; plateId: string; lon: string; lat: string }[];
  }
>("test", () => {
  return {
    method: "GET",
    url: `//huaibei-datafusion.rockontrol.com/datafusion/rkVehicleObddetails/allvehiclePoint`,
  };
});

export const getRadar = createRequestActor<
  {},
  IResult<
    {
      radarId: number;
      radarName: string;
      lon: number;
      lat: number;
      leftUpperCorner: string;
      rightLowerCorner: string;
    }[]
  >
>("getRadar", () => {
  return {
    method: "GET",
    url: `//huaibei-datafusion.rockontrol.com/datafusion/rk-radar/radarInfos`,
  };
});

export const getRadarPic = createRequestActor<
  {
    stime: string;
    etime: string;
  },
  IResult<
    {
      id: string;
      radarName: string;
      radarImageRemotePath: string;
      imageUrl: string;
      warningsImageUrl: string;
      alarmTime: string;
      flag: number;
      state: number;
      leftUpperCorner: string;
      rightLowerCorner: string;
    }[]
  >
>("getRadarPic", (params) => {
  return {
    method: "POST",
    url: `//huaibei-datafusion.rockontrol.com/datafusion/rk-radar/radarWarningInfos`,
    data: params,
  };
});

export interface IResult<T> {
  code: number;
  msg: string;
  data: T;
}
