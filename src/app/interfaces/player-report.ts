export interface PlayerReport {
  name: string;
  currency: string;
  balance: number;
  withdrawal: number;
  deposit: number;
  casino: number;
  sport: number;
}

export interface PlayerReportFilter {
  casinoTRY: number;
  casinoUSD: number;
  sportTRY: number;
  sportUSD: number;
}
