import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

export interface TaskDetail {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  status: 'to do' | 'in progress' | 'done';
  days: number;
  storyPoint?: string;
  epicPoint?: string;
  specification?: string;
  estimatedTime?: number;
  spentTime?: number;
  comments?: string;
  currentVersion?: string;
  targetVersion?: string;

  files?: { name: string; type: string; data: string }[];
}

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent {
  @Input() task!: TaskDetail;
  @Output() taskUpdated = new EventEmitter<TaskDetail>();
  @Output() back = new EventEmitter<void>();

  editModeMap: { [key in keyof TaskDetail]?: boolean } = {};

  fieldLabels: { [key in keyof TaskDetail]?: string } = {
    name: 'Name',
    priority: 'Priority',
    startDate: 'Start Date',
    endDate: 'End Date',
    status: 'Status',
    days: 'Days',
    storyPoint: 'Story Point',
    epicPoint: 'Epic Point',
    specification: 'Specification',
    estimatedTime: 'Estimated Time',
    spentTime: 'Spent Time',
    comments: 'Comments',
    currentVersion: 'Current Version',
    targetVersion: 'Target Version',
  };

  editableFields: (keyof TaskDetail)[] = [
    'name', 'priority', 'startDate', 'endDate', 'status',
    'days', 'storyPoint', 'epicPoint', 'specification',
    'estimatedTime', 'spentTime', 'comments',
    'currentVersion', 'targetVersion'
  ];

  editField(field: keyof TaskDetail) {
    this.editModeMap[field] = true;
  }

  saveField(field: keyof TaskDetail) {
    this.editModeMap[field] = false;
    this.taskUpdated.emit(this.task);
  }

  goBack() {
    this.back.emit();
  }

  calculateDays(): number {
    if (this.task.startDate && this.task.endDate) {
      const start = new Date(this.task.startDate);
      const end = new Date(this.task.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      this.task.days = diff;
      return diff;
    }
    return 0;
  }

  uploadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.multiple = true;
    input.onchange = () => {
      const files = input.files;
      if (files && files.length) {
        if (!this.task.files) this.task.files = [];
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = () => {
            this.task.files!.push({
              name: file.name,
              type: file.type,
              data: reader.result as string
            });
            this.taskUpdated.emit(this.task);
          };
          reader.readAsDataURL(file);
        });
        alert(`${files.length} file(s) uploaded successfully!`);
      }
    };
    input.click();
  }

  downloadFile(file = (this.task as any).files) {
    
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  }
}
