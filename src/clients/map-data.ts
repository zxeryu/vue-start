import { createRequestActor } from "@vue-start/request";

export const getCapitals = createRequestActor("getCapitals", () => {
  return {
    method: "GET",
    url: `/map-data/capitals.json`,
  };
});

export const getTianTan = createRequestActor("getTianTan", () => {
  return {
    method: "GET",
    url: `/map-data/tiantan.json`,
  };
});
