import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({ providedIn: 'root' })
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = `صفحه اول`;
  itemsPerPageLabel = `تعداد در هر صفحه:`;
  lastPageLabel = `صفحه آخر`;

  nextPageLabel = 'صفحه بعدی';
  previousPageLabel = 'صفحه قبلی';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `صفحه 1 از 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `صفحه ${page + 1} از ${amountPages}`;
  }
}
