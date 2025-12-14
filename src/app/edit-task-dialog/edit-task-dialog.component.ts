import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent {
  task: any;

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Clone the task to avoid mutating parent object directly until save
    this.task = { ...data.task };

    // Convert string dates to Date objects
    if (typeof this.task.startDate === 'string') {
      this.task.startDate = new Date(this.task.startDate);
    }
    if (typeof this.task.endDate === 'string') {
      this.task.endDate = new Date(this.task.endDate);
    }

    // Ensure days has a default value
    if (!this.task.days) {
      this.task.days = 1;
    }
  }

  // Calculate number of days based on start and end dates
  updateDaysFromDates() {
    if (this.task.startDate && this.task.endDate) {
      const start = new Date(this.task.startDate);
      const end = new Date(this.task.endDate);
      const diffTime = end.getTime() - start.getTime();
      this.task.days = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 1); // inclusive
    }
  }

  // Update end date when days are changed
  updateEndDateFromDays() {
    if (this.task.startDate && this.task.days) {
      const newEndDate = new Date(this.task.startDate);
      newEndDate.setDate(newEndDate.getDate() + Number(this.task.days) - 1); // include start day
      this.task.endDate = newEndDate;
    }
  }

  save() {
    sessionStorage.setItem('selectedTask', JSON.stringify(this.task));

    this.dialogRef.close(this.task);
  }

  cancel() {
    this.dialogRef.close();
  }
}
