import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Person } from '../../model/person.model';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  form = this.fb.group({
    نام: [this.person['نام'], Validators.required],
    'نام خانوادگی': [this.person['نام خانوادگی'], Validators.required],
    'شماره موبایل': [this.person['شماره موبایل'], Validators.required],
    سن: [this.person['سن'], Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private person: Person,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  getErrorMessage(formContol: string) {
    console.log(formContol);
    if (this.form.controls[formContol].hasError('required')) {
      return `لطفا ${formContol} را وارد کنید`;
    }
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }
}

export function openEditCourseDialog(dialog: MatDialog, person: Person) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'modal-panel';
  config.backdropClass = 'backdrop-modal-panel';

  config.data = {
    ...person,
  };

  const dialogRef = dialog.open(DialogComponent, config);

  return dialogRef.afterClosed();
}
