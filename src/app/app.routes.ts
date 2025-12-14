// import { RouterModule, Routes } from '@angular/router';
// import { TaskComponent } from './task/task.component';
// import { CalendarComponent } from './calendar/calendar.component';
// import { ChartsComponent } from './charts/charts.component';
// import { SignupComponent } from './signup/signup.component';
// import { LoginComponent } from './login/login.component';
// import { TaskDetailComponent } from './task/task-detail/task-detail.component';


// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'signup', component: SignupComponent },
//   { path: 'login', component: LoginComponent },

//   { path: 'task', component: TaskComponent },

//   { path: 'task/:name', component: TaskDetailComponent },

//   { path: 'calendar', component: CalendarComponent },
//   { path: 'charts', component: ChartsComponent }
// ];

import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './task/task.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChartsComponent } from './task/charts/charts.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'task', component: TaskComponent },
  { path: 'task/:name', component: TaskDetailComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'charts', component: ChartsComponent } 
];

