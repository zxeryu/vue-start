export interface IResult {
  code?: number;
  msg?: string;
  data?: object;
}

export enum StatusEnum {
  SUCCESS = 0,
  FAIL = 1,
}

/**
 * 统一返回结构体
 * @param code
 * @param msg
 * @param data
 */
export const responseWrap = <T>(data: T, code = 0, msg = 'ok') => {
  return { code, msg, data };
};