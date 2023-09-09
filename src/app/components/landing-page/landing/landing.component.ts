import {
  ChangeDetectorRef,
  Component,
  Injectable,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import {
  MatRow,
  MatTableDataSource,
  MatTableModule,
  _MatTableDataSource,
} from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { Subject, filter } from 'rxjs';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  TableVirtualScrollDataSource,
  TableVirtualScrollModule,
} from 'ng-table-virtual-scroll';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
  DialogComponent,
  openEditCourseDialog,
} from 'src/app/shared/components/dialog/dialog.component';
import { Person } from 'src/app/shared/model/person.model';
import { MyCustomPaginatorIntl } from 'src/app/shared/model/paginator.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ScrollingModule,
    TableVirtualScrollModule,
    MatDialogModule,
    DialogComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class LandingComponent {
  file: File;
  excelData: Person[][];
  dataSource: MatTableDataSource<Person[]>;
  disableCorrectInfoButton: boolean = false;
  currentPageData;
  SortEvent: Sort;
  showTable: boolean = false;
  averageAge: number = 0;

  displayedColumns = [
    'شماره پرونده',
    'نام',
    'نام خانوادگی',
    'شماره موبایل',
    'سن',
  ];

  constructor(private ref: ChangeDetectorRef, private dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  onFileSelected(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(this.file);
    fileReader.onload = (e) => {
      let workbook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = workbook.SheetNames;
      this.excelData = <Person[][]>(
        (<unknown>XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]))
      );
      // this.dataSource = new MatTableDataSource<Person>(this.excelData);
      this.dataSource = new TableVirtualScrollDataSource<Person[]>(
        this.excelData
      );
      this.showTable = true;
      this.ref.detectChanges();
      this.paginator.length = this.excelData.length;
      this.paginator.pageSize = 1000;
      this.dataSource.paginator = this.paginator;
      const itemsShowed = this.dataSource.data.slice(0, 999);
      this.currentPageData = itemsShowed;
      const average = itemsShowed.reduce(
        (total = 0, next) => total + next['سن'],
        0
      );
      this.averageAge = average / 1000;
      this.dataSource.paginator.page.subscribe((pageEvent: PageEvent) => {
        const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
        const endIndex = startIndex + 999;
        // const itemsShowed = this.dataSource.data.slice(startIndex, endIndex);
        this.dataSource._orderData(this.dataSource.filteredData);
        const itemsShowed = this.dataSource
          ._orderData(this.dataSource.filteredData)
          .slice(startIndex, endIndex);
        const average = itemsShowed.reduce(
          (total = 0, next) => total + next['سن'],
          0
        );
        this.currentPageData = itemsShowed;

        this.averageAge = average / 1000;
      });
      this.sort.active = 'شماره پرونده';
      this.sort.direction = 'asc';
      this.sort.disableClear = true;
      this.dataSource.sort = this.sort;
      // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    };
  }

  sortData(event: Sort) {
    this.SortEvent = event;
    this.paginator.pageIndex = 0;
    this.dataSource._orderData(this.dataSource.filteredData);
    const average = this.dataSource
      ._orderData(this.dataSource.filteredData)
      .slice(0, 999)
      .reduce((total = 0, next) => total + next['سن'], 0);
    this.currentPageData = this.dataSource
      ._orderData(this.dataSource.filteredData)
      .slice(0, 999);
    this.averageAge = average / 1000;
  }

  correctInfo() {
    const regex = new RegExp('^(\\+98|0)?9\\d{9}$');
    this.excelData = this.dataSource
      ._orderData(this.dataSource.filteredData)
      .filter((item) => {
        return (
          item['سن'] > 1 &&
          item['سن'] < 100 &&
          item['نام'].length > 2 &&
          item['نام خانوادگی'].length > 2 &&
          regex.test(item['شماره موبایل'])
        );
      });

    this.dataSource = new TableVirtualScrollDataSource<Person[]>(
      this.excelData
    );
    this.paginator.length = this.excelData.length;
    this.paginator.pageSize = 1000;
    this.dataSource.paginator = this.paginator;
    this.sort.active = 'شماره پرونده';
    this.sort.direction = 'asc';
    this.sort.disableClear = true;
    this.dataSource.sort = this.sort;
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    const itemsShowed = this.dataSource
      ._orderData(this.dataSource.filteredData)
      .slice(0, 999);
    const average = itemsShowed.reduce(
      (total = 0, next) => total + next['سن'],
      0
    );
    this.averageAge = average / 1000;
    // this.disableCorrectInfoButton = true;
  }

  editPerson(row: Person) {
    let foundItemIndex = this.dataSource
      ._orderData(this.dataSource.filteredData)
      .findIndex((item) => {
        return +item['شماره پرونده'] === +row['شماره پرونده'];
      });
    openEditCourseDialog(this.dialog, row)
      .pipe(filter((person) => !!person))
      .subscribe((person: Person) => {
        this.dataSource._orderData(this.dataSource.filteredData)[
          foundItemIndex
        ]['نام'] = person['نام'];
        this.dataSource._orderData(this.dataSource.filteredData)[
          foundItemIndex
        ]['نام خانوادگی'] = person['نام خانوادگی'];
        this.dataSource._orderData(this.dataSource.filteredData)[
          foundItemIndex
        ]['شماره موبایل'] = +person['شماره موبایل'];
        this.dataSource._orderData(this.dataSource.filteredData)[
          foundItemIndex
        ]['سن'] = +person['سن'];
      });
  }
}
