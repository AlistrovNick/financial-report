export const getReportHeaders = (report: Array<Array<string>>): Map<string, number> => {
  const headers = new Map<string, number>();
  const keys = report[0];
  for (let i = 0; i < keys.length; i++) {
    headers.set(keys[i], i);
  }
  return headers;
};

