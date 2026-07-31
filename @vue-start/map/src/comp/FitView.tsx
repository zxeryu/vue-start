import { defineComponent, PropType } from "vue";
import { useEffect } from "@vue-start/hooks";
import { useMap } from "../Map";

const fitViewProps = {
  adcode: { type: String },
  immediately: { type: Boolean, default: false },
  avoid: { type: Array as PropType<number[]> },
  maxZoom: { type: Number },
};

const computeBBox = (geometry: any): [number, number, number, number] | null => {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  let found = false;

  const scanRing = (ring: number[][]) => {
    for (const p of ring) {
      if (p[0] < minLng) minLng = p[0];
      if (p[0] > maxLng) maxLng = p[0];
      if (p[1] < minLat) minLat = p[1];
      if (p[1] > maxLat) maxLat = p[1];
      found = true;
    }
  };

  if (geometry?.type === "Polygon") {
    geometry.coordinates.forEach(scanRing);
  } else if (geometry?.type === "MultiPolygon") {
    geometry.coordinates.forEach((poly: number[][][]) => poly.forEach(scanRing));
  }

  return found ? [minLng, minLat, maxLng, maxLat] : null;
};

export const MapFitView = defineComponent({
  props: fitViewProps,
  setup: (props) => {
    const { mapRef, getGeoJson } = useMap();

    useEffect((adcode) => {
      if (!adcode || !mapRef.value) return;

      let cancelled = false;

      getGeoJson({ adcode, type: "boundary" }).then((fc) => {
        const map = mapRef.value;
        if (cancelled || !map) return;

        const bbox = computeBBox(fc.features[0]?.geometry);
        if (!bbox) return;

        const [minLng, minLat, maxLng, maxLat] = bbox;
        const rect = new (window.AMap.Polygon as any)({
          path: [
            [minLng, minLat],
            [maxLng, minLat],
            [maxLng, maxLat],
            [minLng, maxLat],
          ],
        });

        map.setFitView([rect], props.immediately, props.avoid, props.maxZoom);
      });

      return () => {
        cancelled = true;
      };
    }, () => props.adcode);

    return () => null;
  },
});
