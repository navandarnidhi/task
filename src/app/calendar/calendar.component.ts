import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Task } from '../task/task.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  
  calendarDays: CalendarDay[] = [];
  tasks: Task[] = [];
  
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
  
  selectedPriority: 'all' | 'high' | 'medium' | 'low' = 'all';
  selectedStatus: 'all' | 'to do' | 'in progress' | 'done' = 'all';

  ngOnInit() {
    this.loadTasks();
    this.generateCalendar();
  }

  loadTasks() {
    const saved = sessionStorage.getItem('tasks');
    if (saved) {
      this.tasks = JSON.parse(saved);
    }
  }

  generateCalendar() {
    this.calendarDays = [];
    
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();
    
    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth - 1, daysInPrevMonth - i);
      this.calendarDays.push({
        date,
        dayNumber: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        tasks: this.getTasksForDate(date)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      const isToday = this.isToday(date);
      
      this.calendarDays.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        isToday,
        tasks: this.getTasksForDate(date)
      });
    }
    
    // Next month days
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, i);
      this.calendarDays.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: false,
        tasks: this.getTasksForDate(date)
      });
    }
  }

  getTasksForDate(date: Date): Task[] {
    const dateStr = this.formatDate(date);
    
    return this.tasks.filter(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      const checkDate = new Date(date);
      
      // Normalize dates to ignore time
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      
      const isInRange = checkDate >= startDate && checkDate <= endDate;
      
      // Apply filters
      const matchesPriority = this.selectedPriority === 'all' || task.priority === this.selectedPriority;
      const matchesStatus = this.selectedStatus === 'all' || task.status === this.selectedStatus;
      
      return isInRange && matchesPriority && matchesStatus;
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  goToToday() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar();
  }

  getPriorityColor(priority: string): string {
    switch(priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'to do': return '#2196f3';
      case 'in progress': return '#ff9800';
      case 'done': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  setPriorityFilter(priority: 'all' | 'high' | 'medium' | 'low') {
    this.selectedPriority = priority;
    this.generateCalendar();
  }

  setStatusFilter(status: 'all' | 'to do' | 'in progress' | 'done') {
    this.selectedStatus = status;
    this.generateCalendar();
  }

  getTaskTooltip(task: Task): string {
    return `${task.name}\nPriority: ${task.priority}\nStatus: ${task.status}\nDuration: ${task.days} days`;
  }
}
