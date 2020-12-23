import { createRequestConfig } from "../../@vue-start/request/src";

export const test = createRequestConfig<
  undefined,
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

export const getRadar = createRequestConfig<
  undefined,
  {
    radarId: number;
    radarName: string;
    lon: number;
    lat: number;
    leftUpperCorner: string;
    rightLowerCorner: string;
  }[]
>("getRadar", () => {
  return {
    method: "GET",
    url: `//huaibei-datafusion.rockontrol.com/datafusion/rk-radar/radarInfos`,
  };
});
