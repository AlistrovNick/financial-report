import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ElectronService } from 'ngx-electron';
import { ReportsPaths } from 'src/app/interfaces/reports';

@Component({
  selector: 'app-uploading-files',
  templateUrl: './uploading-files.component.html',
  styleUrls: ['./uploading-files.component.scss'],
})
export class UploadingFilesComponent {
  @Input() reports: ReportsPaths = {
    playersReport: '',
    playersReportPrev: '',
  };

  @Output() changeReport = new EventEmitter<ReportsPaths>();

  constructor(private electronService: ElectronService) {}

  async openFile(reportName: keyof ReportsPaths) {
    const filePath = await this.electronService.ipcRenderer.invoke(
      'dialog:openFile'
    );

    const changedReports = { ...this.reports, [reportName]: filePath };
    this.changeReport.emit(changedReports);
  }
}
