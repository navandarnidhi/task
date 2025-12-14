import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      priority: ['medium', Validators.required],
      status: ['to do', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      days: [{ value: '', disabled: true }] // readonly, auto-calculated
    });

    // Automatically calculate days whenever start or end date changes
    this.taskForm.get('startDate')?.valueChanges.subscribe(() => this.calculateDays());
    this.taskForm.get('endDate')?.valueChanges.subscribe(() => this.calculateDays());
  }

  calculateDays(): void {
    const start: Date = this.taskForm.value.startDate;
    const end: Date = this.taskForm.controls['endDate'].value;

    if (start && end) {
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // include start day
      this.taskForm.patchValue({ days: diffDays }, { emitEvent: false });
    } else {
      this.taskForm.patchValue({ days: '' }, { emitEvent: false });
    }
  }

  save(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.getRawValue(); 

      // ✅ Save the new task in sessionStorage temporarily
      sessionStorage.setItem('selectedTask', JSON.stringify(taskData));

      this.dialogRef.close(taskData);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
