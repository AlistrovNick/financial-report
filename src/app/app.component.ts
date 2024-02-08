import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { FormGroup, FormControl } from '@angular/forms';

import { ReportName } from './interfaces/reports';
import { ReportsPaths } from './interfaces/reports';
import { Reports } from './interfaces/reports';
import { PlayerReport, PlayerReportFilter } from './interfaces/player-report';
import { getReportHeaders } from './utils/report-utils';
import * as playerReportConst from './constants/player-report-const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  reportsPaths: ReportsPaths = {
    playersReport: '',
    playersReportPrev: '',
  };

  reports: Reports = {
    playersReport: [],
    playersReportPrev: [],
  };

  playersDifference: PlayerReport[] = [];

  selectedPlayers: PlayerReport[] = [];

  playersReportFilter: PlayerReportFilter = {
    casinoTRY: 0,
    casinoUSD: 0,
    sportTRY: 0,
    sportUSD: 0
  }

  playersReportFilterForm = new FormGroup({
    casinoTRY: new FormControl(this.playersReportFilter.casinoTRY),
    casinoUSD: new FormControl(this.playersReportFilter.casinoUSD),
    sportTRY: new FormControl(this.playersReportFilter.sportTRY),
    sportUSD: new FormControl(this.playersReportFilter.sportUSD)
  });

  constructor(private electronService: ElectronService) {}

  async onNextClickFirstStep() {
    await this.readFiles();

    const pr = this.handlePlayerReport(this.reports.playersReport);
    const prp = this.handlePlayerReport(this.reports.playersReportPrev);

    this.playersDifference = [...this.findPlayersReportDifference(pr, prp)];
  }

  onPlayersSelect(players: PlayerReport[]) {
    this.selectedPlayers = players;

    console.log(this.selectedPlayers);
  }

  onChangeReport(paths: ReportsPaths) {
    this.reportsPaths = paths;
  }

  changeFilter() {
    this.playersReportFilter = {
      casinoTRY: this.playersReportFilterForm.value.casinoTRY || 0,
      casinoUSD: this.playersReportFilterForm.value.casinoUSD || 0,
      sportTRY: this.playersReportFilterForm.value.sportTRY || 0,
      sportUSD: this.playersReportFilterForm.value.sportUSD || 0,
    };    
  }

  private async readFiles() {
    const reportsNames: Array<ReportName> = [
      'playersReport',
      'playersReportPrev',
    ];

    for (let i = 0; i < reportsNames.length; i++) {
      const rows = await this.electronService.ipcRenderer.invoke(
        'file:read',
        this.reportsPaths[reportsNames[i]]
      );
      this.reports[reportsNames[i]] = rows;
    }
  }

  private handlePlayerReport(report: Array<Array<string>>): PlayerReport[] {
    if (report.length === 0) {
      return [];
    }

    const playerReport = [];
    const headers = getReportHeaders(report);

    for (let i = 1; i < report.length; i++) {
      const player: PlayerReport = {
        balance: Number(
          report[i][
            Number(headers.get(playerReportConst.HEADER_CURRENT_BALANCE))
          ]
        ),
        casino: Number(
          report[i][
            Number(headers.get(playerReportConst.HEADER_CASINO_NET_PROFIT))
          ]
        ),
        currency:
          report[i][Number(headers.get(playerReportConst.HEADER_CURRENCY))],
        deposit: Number(
          report[i][Number(headers.get(playerReportConst.HEADER_DEPOSITS))]
        ),
        name: report[i][Number(headers.get(playerReportConst.HEADER_USERNAME))],
        sport: Number(
          report[i][
            Number(headers.get(playerReportConst.HEADER_SPORT_NET_PROFIT))
          ]
        ),
        withdrawal: Number(
          report[i][
            Number(headers.get(playerReportConst.HEADER_WITHDRAWAL_AMOUNT))
          ]
        ),
      };
      playerReport.push(player);
    }

    return playerReport;
  }

  private findPlayersReportDifference(
    report: PlayerReport[],
    reportPrev: PlayerReport[]
  ) {
    const difference = [];

    for (let i = 0; i < report.length; i++) {
      const name = report[i].name;
      const currency = report[i].currency;
      let balance = report[i].balance;
      let casino = report[i].casino;
      let deposit = report[i].deposit;
      let sport = report[i].sport;
      let withdrawal = report[i].withdrawal;

      const playerPrev = reportPrev.filter((r) => r.name === report[i].name);
      if (playerPrev.length !== 0) {
        casino -= playerPrev[0].casino;
        deposit -= playerPrev[0].deposit;
        sport -= playerPrev[0].sport;
        withdrawal -= playerPrev[0].withdrawal;
      }

      const player: PlayerReport = {
        name,
        currency,
        balance,
        casino,
        deposit,
        sport,
        withdrawal,
      };

      difference.push(player);
    }
    return difference;
  }
}
