// import { Component, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatTableModule, MatTableDataSource } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { MatSelectModule } from '@angular/material/select';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatSort, MatSortModule } from '@angular/material/sort';
// import { RouterModule } from '@angular/router';

// import { NavbarComponent } from '../navbar/navbar.component';
// import { TaskDetailComponent, TaskDetail } from './task-detail/task-detail.component';
// import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
// import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
// import { ChartsComponent } from './charts/charts.component';

// export interface Task {
//   id: string;
//   name: string;
//   priority: 'low' | 'medium' | 'high';
//   startDate: string;
//   endDate: string;
//   status: 'to do' | 'in progress' | 'done';
//   days: number;
// }

// @Component({
//   selector: 'app-task',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatCardModule,
//     MatTableModule,
//     MatButtonModule,
//     MatDialogModule,
//     MatSelectModule,
//     MatIconModule,
//     MatMenuModule,
//     MatChipsModule,
//     MatPaginatorModule,
//     MatDatepickerModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatNativeDateModule,
//     MatSortModule,
//     NavbarComponent,
//     TaskDetailComponent,
//     ChartsComponent,
//     RouterModule,
//   ],
//   templateUrl: './task.component.html',
//   styleUrls: ['./task.component.css'],
// })
// export class TaskComponent implements AfterViewInit {

//   displayedColumns: string[] = ['name', 'priority', 'startDate', 'endDate', 'status', 'actions', 'days'];
//   tasks: Task[] = [];
//   dataSources: MatTableDataSource<Task>[] = [];
//   selectedTask: TaskDetail | null = null;
//   priorityFilter: 'all' | 'high' | 'medium' | 'low' = 'all';

//   @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
//   @ViewChildren(MatSort) sorts!: QueryList<MatSort>;

//   constructor(private dialog: MatDialog) {
//     const saved = sessionStorage.getItem('tasks');
//     if (saved) this.tasks = JSON.parse(saved);
//     this.updateDataSources();
//   }

//   ngAfterViewInit() {
//     setTimeout(() => this.attachSortAndPaginator());
//   }

//   private attachSortAndPaginator() {
//     const paginatorArray = this.paginators.toArray();
//     const sortArray = this.sorts.toArray();

//     this.dataSources.forEach((ds, index) => {
//       if (paginatorArray[index]) ds.paginator = paginatorArray[index];
//       if (sortArray[index]) ds.sort = sortArray[index];
//     });
//   }

//   updateDataSources() {
//     const filteredTasks = this.getFilteredTasks();
//     this.dataSources = [
//       new MatTableDataSource(filteredTasks.filter(t => t.status === 'to do')),
//       new MatTableDataSource(filteredTasks.filter(t => t.status === 'in progress')),
//       new MatTableDataSource(filteredTasks.filter(t => t.status === 'done'))
//     ];
//     setTimeout(() => this.attachSortAndPaginator());
//   }

//   getFilteredTasks(): Task[] {
//     if (this.priorityFilter === 'all') return this.tasks;
//     return this.tasks.filter(task => task.priority === this.priorityFilter);
//   }

//   setPriorityFilter(priority: 'all' | 'high' | 'medium' | 'low') {
//     this.priorityFilter = priority;
//     this.updateDataSources();
//   }

//   openAddTaskDialog() {
//     const dialogRef = this.dialog.open(TaskDialogComponent, { width: '600px' });
//     dialogRef.afterClosed().subscribe(result => {
//       if (!result) return;

//       result.id = crypto.randomUUID();

//       this.tasks.push(result);
//       sessionStorage.setItem('tasks', JSON.stringify(this.tasks));
//       this.updateDataSources();
//     });
//   }

//   editTask(task: Task) {
//     const dialogRef = this.dialog.open(EditTaskDialogComponent, { width: '600px', data: { task } });
//     dialogRef.afterClosed().subscribe(result => {
//       if (!result) return;

//       Object.assign(task, result);
//       sessionStorage.setItem('tasks', JSON.stringify(this.tasks));
//       this.updateDataSources();
//     });
//   }

//   deleteTask(task: Task) {
//     const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: { message: 'Delete task?' } });
//     dialogRef.afterClosed().subscribe(yes => {
//       if (!yes) return;

//       this.tasks = this.tasks.filter(t => t.id !== task.id);
//       sessionStorage.setItem('tasks', JSON.stringify(this.tasks));
//       this.updateDataSources();
//     });
//   }

//   openTaskDetails(task: Task) {
//     this.selectedTask = task;   
//   }

//   onTaskUpdated(updated: TaskDetail) {
//     const index = this.tasks.findIndex(t => t.id === updated.id);

//     if (index > -1) {
//       this.tasks[index] = { ...updated };
//       sessionStorage.setItem('tasks', JSON.stringify(this.tasks));
//       this.updateDataSources();
//     }
//   }

//   closeDetail() {
//     this.selectedTask = null;
//   }
// }

import { Component, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { NavbarComponent } from '../navbar/navbar.component';
import { TaskDetailComponent, TaskDetail } from './task-detail/task-detail.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

export interface Task {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  status: 'to do' | 'in progress' | 'done';
  days: number;
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSortModule,
    NavbarComponent,
    TaskDetailComponent,
    RouterModule,
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements AfterViewInit {

  displayedColumns = ['name', 'priority', 'startDate', 'endDate', 'status', 'actions', 'days'];
  tasks: Task[] = [];
  dataSources: MatTableDataSource<Task>[] = [];
  selectedTask: TaskDetail | null = null;

  priorityFilter: 'all' | 'high' | 'medium' | 'low' = 'all';

  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sorts!: QueryList<MatSort>;

  constructor(private dialog: MatDialog, private router: Router) {
    const saved = sessionStorage.getItem('tasks');
    if (saved) this.tasks = JSON.parse(saved);

    this.updateDataSources();
  }

  ngAfterViewInit() {
    setTimeout(() => this.attachSortAndPaginator());
  }

  private attachSortAndPaginator() {
    const paginatorArray = this.paginators.toArray();
    const sortArray = this.sorts.toArray();

    this.dataSources.forEach((ds, index) => {
      if (paginatorArray[index]) ds.paginator = paginatorArray[index];
      if (sortArray[index]) ds.sort = sortArray[index];
    });
  }

  updateDataSources() {
    const filtered = this.getFilteredTasks();

    this.dataSources = [
      new MatTableDataSource(filtered.filter(t => t.status === 'to do')),
      new MatTableDataSource(filtered.filter(t => t.status === 'in progress')),
      new MatTableDataSource(filtered.filter(t => t.status === 'done')),
    ];

    setTimeout(() => this.attachSortAndPaginator());
  }

  getFilteredTasks(): Task[] {
    if (this.priorityFilter === 'all') return this.tasks;
    return this.tasks.filter(t => t.priority === this.priorityFilter);
  }

  setPriorityFilter(priority: 'all' | 'high' | 'medium' | 'low') {
    this.priorityFilter = priority;
    this.updateDataSources();
  }

  openAddTaskDialog() {
    const ref = this.dialog.open(TaskDialogComponent, { width: '600px' });

    ref.afterClosed().subscribe(newTask => {
      if (!newTask) return;

      newTask.id = crypto.randomUUID();
      this.tasks = [...this.tasks, newTask];

      sessionStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.updateDataSources();
    });
  }

  editTask(task: Task) {
    const ref = this.dialog.open(EditTaskDialogComponent, { width: '600px', data: { task } });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      this.tasks = this.tasks.map(t => t.id === result.id ? { ...t, ...result } : t);

      sessionStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.updateDataSources();
    });
  }

  deleteTask(task: Task) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Delete task?' }
    });

    ref.afterClosed().subscribe(yes => {
      if (!yes) return;

      this.tasks = this.tasks.filter(t => t.id !== task.id);

      sessionStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.updateDataSources();
    });
  }

  openTaskDetails(task: Task) {
    this.selectedTask = task;
  }

  onTaskUpdated(updated: TaskDetail) {
    this.tasks = this.tasks.map(t => t.id === updated.id ? { ...t, ...updated } : t);

    sessionStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.updateDataSources();
  }

  closeDetail() {
    this.selectedTask = null;
  }

  // ⭐ NAVIGATE TO CHARTS PAGE (NO SERVICE)
  goToCharts() {
    this.router.navigate(['/charts'], {
      state: { tasks: this.tasks }
    });
  }
}
