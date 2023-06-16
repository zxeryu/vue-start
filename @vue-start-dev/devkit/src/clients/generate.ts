import { TRuntimeConfig } from "../start/type";
import { find, get, head } from "lodash";
import { createApiData } from "./index";
import { generate } from "../file";
import { formatCode } from "../util";
import { join } from "path";

export const generateClientFile = (cwd: string, config: TRuntimeConfig) => {
  const clientConfig = config.client;
  if (!clientConfig) return;

  const name = head(config.argv);
  const target = find(clientConfig.list, (item) => item.name === name);

  if (!target || !target.url) {
    throw new Error("can not find valid item");
  }

  const axios = require("axios");
  axios
    .get(target.url)
    .then((res: any) => {
      const paths = target.convertPaths ? target.convertPaths(res.data) : get(res.data, "paths");
      if (!paths) return;

      const clientResult = createApiData(paths, target.customApiName!, {
        basePath: target.basePath,
        ignorePaths: target.ignorePaths,
        selectPaths: target.selectPaths,
      });

      const { apiStr } = target.convertData ? target.convertData(clientResult) : clientResult;

      const clientName = target.generateName || target.name;
      const clientPath = target.generatePath || ["src", "clients"];

      const fileType = clientConfig.fileType || ".js";

      generate(join(cwd, ...clientPath, `${clientName}${fileType}`), formatCode(apiStr));
    })
    .catch((err: any) => {
      console.error(err);
    });
};
