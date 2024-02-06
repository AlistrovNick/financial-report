export type ReportName = 'playersReport' | 'playersReportPrev';

export type ReportsPaths = {
  [key in ReportName]: string;
};

export type Reports = {
  [key in ReportName]: [];
};
