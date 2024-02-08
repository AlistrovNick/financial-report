import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';

import {
  PlayerReport,
  PlayerReportFilter,
} from 'src/app/interfaces/player-report';

const elemenys = [
  {
    name: 'Pergamon',
    currency: 'TRY',
    balance: 5750.77,
    casino: -2772.35,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'obilan',
    currency: 'TRY',
    balance: 0.19,
    casino: 0,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'Marazli5355',
    currency: 'TRY',
    balance: 0.14,
    casino: 0,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'CemBaba53',
    currency: 'TRY',
    balance: 0.12,
    casino: 0,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'doktor',
    currency: 'TRY',
    balance: 214.82,
    casino: 0,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'Sonixx39',
    currency: 'TRY',
    balance: 0.05,
    casino: 0,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'asdfgasdfgh',
    currency: 'USD',
    balance: 0,
    casino: 0,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'asmolodoi',
    currency: 'USD',
    balance: 0.5,
    casino: -0.44,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'arzuhalit',
    currency: 'TRY',
    balance: 11836.92,
    casino: -4336.750000000001,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'Rabia88',
    currency: 'TRY',
    balance: 0.02,
    casino: 0,
    deposit: 0,
    sport: -100,
    withdrawal: 0,
  },
  {
    name: 'Tonyali',
    currency: 'TRY',
    balance: 1500,
    casino: 0,
    deposit: 0,
    sport: 0,
    withdrawal: 0,
  },
  {
    name: 'TrueNK',
    currency: 'USD',
    balance: 205.12,
    casino: -30.049999999999997,
    deposit: 0,
    sport: 15,
    withdrawal: 0,
  },
  {
    name: 'Aysin5454',
    currency: 'TRY',
    balance: 1.26,
    casino: 499,
    deposit: 500,
    sport: 0,
    withdrawal: 0,
  },
];

@Component({
  selector: 'app-players-report-page',
  templateUrl: './players-report-page.component.html',
  styleUrls: ['./players-report-page.component.scss'],
})
export class PlayersReportPageComponent implements OnChanges, AfterViewInit {
  @Input() players: PlayerReport[] = [];
  @Input() filter: PlayerReportFilter = {
    casinoTRY: 0,
    casinoUSD: 0,
    sportTRY: 0,
    sportUSD: 0,
  };

  @Output() select = new EventEmitter<PlayerReport[]>();

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<PlayerReport>(elemenys);
  // dataSource = new MatTableDataSource<PlayerReport>(this.players);
  selection = new SelectionModel<PlayerReport>(true, []);

  displayedColumns = [
    'select',
    'name',
    'currency',
    'casino',
    'sport',
    'balance',
  ];

  ngOnChanges(changes: SimpleChanges): void {
    const transformedPlayers = this.players.map((p) => {
      const casino = Math.floor(p.casino);
      const sport = Math.floor(p.sport);
      return { ...p, casino, sport };
    });

    // const transformedPlayers = elemenys.map((p) => {
    //   const casino = Math.floor(p.casino);
    //   const sport = Math.floor(p.sport);
    //   return { ...p, casino, sport };
    // });

    const playersCasinoTRY = transformedPlayers
      .filter((p) => p.currency === 'TRY')
      .filter((p) => Math.abs(p.casino) >= this.filter.casinoTRY);

    const playersCasinoUSD = transformedPlayers
      .filter((p) => p.currency === 'USD')
      .filter((p) => Math.abs(p.casino) >= this.filter.casinoUSD);

    const playersSportTRY = transformedPlayers
      .filter((p) => p.currency === 'TRY')
      .filter((p) => Math.abs(p.sport) >= this.filter.sportTRY);

    const playerSportUSD = transformedPlayers
      .filter((p) => p.currency === 'USD')
      .filter((p) => Math.abs(p.sport) >= this.filter.sportUSD);

    const filteredDataWithDuplicates = [
      ...playersCasinoTRY,
      ...playersCasinoUSD,
      ...playersSportTRY,
      ...playerSportUSD,
    ];
    const filteredData = Array.from(new Set(filteredDataWithDuplicates));

    this.dataSource.data = filteredData;

    this.selection.clear();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onCheckBoxChange(row: PlayerReport) {
    if (row) {
      this.selection.toggle(row);
      this.select.emit(this.selection.selected);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.select.emit([]);
      return;
    }

    this.selection.select(...this.dataSource.data);
    this.select.emit(this.selection.selected);
  }

  onCellClick() {
    setTimeout(() => {
      this.select.emit(this.selection.selected);
    });
  }
}
