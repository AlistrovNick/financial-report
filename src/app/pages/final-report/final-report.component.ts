import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlayerReport } from 'src/app/interfaces/player-report';

@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.scss'],
})
export class FinalReportComponent implements OnChanges {
  @Input() reports: PlayerReport[] = [];

  reportForPrint: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.reportForPrint = [...this.handleCasinoPlayers(this.reports), ...this.handleSportPlayers(this.reports)];
  }

  private handleCasinoPlayers(report: PlayerReport[]) {
    const reportForPrint: string[] = [];
    const casinoPlayers = report.filter((r) => Math.abs(r.casino) > 0);

    if (casinoPlayers.length > 0) {
      reportForPrint.push('casino');
    }
    
    for (let i = 0; i < casinoPlayers.length; i++) {
      let playerDetails = casinoPlayers[i].name;
      playerDetails += ': ';
      playerDetails += this.getNumberSign(casinoPlayers[i].casino);
      playerDetails += this.transformCurrencyValue(Math.abs(casinoPlayers[i].casino), casinoPlayers[i].currency);
      playerDetails += ', balance ';
      playerDetails += this.transformCurrencyValue(Math.floor(casinoPlayers[i].balance), casinoPlayers[i].currency);

      reportForPrint.push(playerDetails);
    }

    return reportForPrint;
  }

  private handleSportPlayers(report: PlayerReport[]) {
    const reportForPrint: string[] = [];
    const sportPlayers = report.filter((r) => Math.abs(r.sport) > 0);

    if (sportPlayers.length > 0) {
      reportForPrint.push('sport');
    }
    
    for (let i = 0; i < sportPlayers.length; i++) {
      let playerDetails = sportPlayers[i].name;
      playerDetails += ': ';
      playerDetails += this.getNumberSign(sportPlayers[i].sport);
      playerDetails += this.transformCurrencyValue(Math.abs(sportPlayers[i].sport), sportPlayers[i].currency);
      playerDetails += ', balance ';
      playerDetails += this.transformCurrencyValue(Math.floor(sportPlayers[i].balance), sportPlayers[i].currency);

      reportForPrint.push(playerDetails);
    }

    return reportForPrint;
  }

  private getNumberSign(num: number) {
    if (num === 0) {
      return '';
    }
    return num > 0 ? '+' : '-';
  }

  private cutNumber(num: number) {
    return `${(num / 1000).toFixed(1)}k`;
  }

  private transformCurrencyValue(value: number, currency: string) {
    let currencyValue = '';
    switch (currency) {
      case 'TRY':
        currencyValue = `${(value < 1000 ? value : this.cutNumber(value))} TRY`;
        break;
      case 'USD':
        currencyValue = `$${(value < 1000 ? value : this.cutNumber(value))}`;
        break;
    }
    return currencyValue;
  }
}
