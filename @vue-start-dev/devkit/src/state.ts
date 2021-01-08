export interface IState {
  cwd: string;
  env: string;

  project: {
    version?: string;
    group?: string;
  };

  meta: { [key: string]: { [k: string]: any } };
}

export const envValueFromState = (state: IState) => Buffer.from(JSON.stringify(state)).toString("base64");

export const stateFromEnvValue = (envValue: string): IState =>
  JSON.parse(Buffer.from(envValue, "base64").toString("utf8")) as IState;
