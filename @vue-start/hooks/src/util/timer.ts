import { ref } from "vue";
import useEffect from "../useEffect";
import { isNumber, padStart } from "lodash";

/**
 * 秒 转 字符串
 * @param time
 * @param format
 */
export const formatCountStr = (time: number, format?: string): string => {
  if (!isNumber(time)) return "";
  const days = Math.floor(time / (24 * 60 * 60)).toString();
  const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Number(time % 60);

  const hs = padStart(hours.toString(), 2, "0");
  const ms = padStart(minutes.toString(), 2, "0");
  const ss = padStart(seconds.toString(), 2, "0");

  const f = format || "ss";
  return f.replace("DD", days).replace("HH", hs).replace("mm", ms).replace("ss", ss);
};

/**
 * 倒计时
 * @param time
 */
export const useCountDown = (time: number = 60, format?: string) => {
  const count = ref(0);
  const str = ref("00");

  useEffect(() => {
    str.value = formatCountStr(count.value, format || "ss");
  }, count);

  let interval: NodeJS.Timeout;

  const stop = () => {
    count.value = 0;
    interval && clearInterval(interval);
  };
  const start = () => {
    stop();
    count.value = time;
    interval = setInterval(() => {
      const nextCount = count.value - 1;
      count.value = nextCount;
      if (nextCount === 0) {
        stop();
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { count, str, stop, start };
};
