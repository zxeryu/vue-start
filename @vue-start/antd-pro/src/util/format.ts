export const getDefaultFormat = (format: string, picker: string, showTime?: boolean, use12Hours?: boolean) => {
  let mergedFormat = format;
  if (!mergedFormat) {
    switch (picker) {
      case "time":
        mergedFormat = use12Hours ? "hh:mm:ss a" : "HH:mm:ss";
        break;

      case "week":
        mergedFormat = "gggg-wo";
        break;

      case "month":
        mergedFormat = "YYYY-MM";
        break;

      case "quarter":
        mergedFormat = "YYYY-[Q]Q";
        break;

      case "year":
        mergedFormat = "YYYY";
        break;

      default:
        mergedFormat = showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
    }
  }

  return mergedFormat;
};
