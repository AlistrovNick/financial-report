import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { ReportName } from './interfaces/reports';
import { ReportsPaths } from './interfaces/reports';
import { Reports } from './interfaces/reports';

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

  constructor(private electronService: ElectronService) {}

  async readFiles() {
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

    console.log(this.reports);
  }

  onChangeReport(paths: ReportsPaths) {
    this.reportsPaths = paths;
  }
}
