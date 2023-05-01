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

export const getMockPosition = createRequestActor("getMockPosition", () => {
  return {
    method: "GET",
    url: `/map-data/mock-position.json`,
  };
});

export const getCities = createRequestActor("getCities", () => {
  return {
    method: "GET",
    url: `/map-data/cities.json`,
  };
});


export const getHeatmap = createRequestActor("getHeatmap", () => {
  return {
    method: "GET",
    url: `/map-data/heatmap.json`,
  };
});

