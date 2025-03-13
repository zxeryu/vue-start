import { Response } from "express";

export interface IResult {
  code?: number;
  msg?: string;
  data?: object;
}

/**
 * 创建接口返回数据，统一格式
 * @param code
 * @param msg
 * @param data
 */
export const createResult = ({ code = 0, msg = "", data = {} }: IResult): IResult => {
  return { code, msg, data };
};

/**
 * 接口发送json数据
 * @param res
 * @param result
 */
export const resJson = (res: Response, result: IResult) => {
  res.json(createResult(result));
};
