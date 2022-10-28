import dts from "rollup-plugin-dts";
import { join } from "path";

const buildData = process.env.VITE_BUILD ? JSON.parse(process.env.VITE_BUILD) : undefined;

export default [
  {
    input: buildData.tsPath,
    output: [{ file: join(buildData.outDir, "index.d.ts"), format: "es" }],
    plugins: [dts()],
  },
];
