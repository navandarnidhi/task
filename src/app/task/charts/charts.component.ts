import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartEvent, ActiveElement } from 'chart.js';
import { Task } from '../task.component';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule, NavbarComponent],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  tasks: Task[] = [];
  selectedStatuses: Set<string> = new Set(['to do', 'in progress', 'done']);
  selectedPriorities: Set<string> = new Set(['high', 'medium', 'low']);
  selectedTasks: Set<string> = new Set();

  statusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#2196f3', '#ff9800', '#4caf50']
      }
    ]
  };

  priorityChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [0, 0, 0],
        backgroundColor: ['#f44336', '#ff9800', '#4caf50']
      }
    ]
  };

  durationChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Days Required',
        data: [],
        backgroundColor: '#9c27b0'
      }
    ]
  };

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements && elements.length > 0) {
        this.handleStatusClick(elements);
      }
    }
  };

  constructor(private cdr: ChangeDetectorRef) {}
  
  private handleStatusClick(elements: ActiveElement[]): void {
    if (elements && elements.length > 0) {
      const clickedIndex = elements[0].index;
      const statusMap = ['to do', 'in progress', 'done'];
      const clickedStatus = statusMap[clickedIndex];
      
      if (this.selectedStatuses.has(clickedStatus)) {
        this.selectedStatuses.delete(clickedStatus);
      } else {
        this.selectedStatuses.add(clickedStatus);
      }
      
      if (this.selectedStatuses.size === 0) {
        this.selectedStatuses = new Set(['to do', 'in progress', 'done']);
      }
      
      this.selectedStatuses = new Set(this.selectedStatuses);
      this.updateAllCharts();
      this.cdr.detectChanges();
    }
  }

  togglePriority(priority: string): void {
    if (this.selectedPriorities.has(priority)) {
      this.selectedPriorities.delete(priority);
    } else {
      this.selectedPriorities.add(priority);
    }
    
    if (this.selectedPriorities.size === 0) {
      this.selectedPriorities = new Set(['high', 'medium', 'low']);
    }
    
    this.selectedPriorities = new Set(this.selectedPriorities);
    this.updateAllCharts();
    this.cdr.detectChanges();
  }

  private handlePriorityClick(elements: ActiveElement[]): void {
    if (elements && elements.length > 0) {
      const clickedIndex = elements[0].index;
      const priorityMap = ['high', 'medium', 'low'];
      const clickedPriority = priorityMap[clickedIndex];
      this.togglePriority(clickedPriority);
    }
  }

  private handleDurationClick(elements: ActiveElement[]): void {
    if (elements && elements.length > 0) {
      const clickedIndex = elements[0].index;
      const baseFilteredTasks = this.tasks.filter(t => {
        const matchesStatus = this.selectedStatuses.has(t.status);
        const matchesPriority = this.selectedPriorities.has(t.priority);
        return matchesStatus && matchesPriority;
      });
      
      if (clickedIndex < baseFilteredTasks.length) {
        const clickedTask = baseFilteredTasks[clickedIndex];
        const taskName = clickedTask.name;
        
        if (this.selectedTasks.has(taskName)) {
          this.selectedTasks.delete(taskName);
        } else {
          this.selectedTasks.add(taskName);
        }
        
        this.selectedTasks = new Set(this.selectedTasks);
        this.updateAllCharts();
        this.cdr.detectChanges();
      }
    }
  }

  priorityChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements && elements.length > 0) {
        this.handlePriorityClick(elements);
      }
    }
  };

  durationChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      this.handleDurationClick(elements);
    }
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  ngOnInit() {
    this.loadTasks();
    this.updateAllCharts();
  }

  private loadTasks() {
    const saved = sessionStorage.getItem('tasks');
    if (saved) {
      this.tasks = JSON.parse(saved);
    }
  }

  private getFilteredTasks(): Task[] {
    return this.tasks.filter(t => {
      const matchesStatus = this.selectedStatuses.has(t.status);
      const matchesPriority = this.selectedPriorities.has(t.priority);
      const matchesTask = this.selectedTasks.size === 0 || this.selectedTasks.has(t.name);
      return matchesStatus && matchesPriority && matchesTask;
    });
  }

  private updateAllCharts() {
    if (!this.tasks || this.tasks.length === 0) return;
    this.updateStatusChart();
    this.updatePriorityChart();
    this.updateDurationChart();
  }

  onStatusChartClick(event: any): void {
    let activeElements: ActiveElement[] = [];
    
    if (event?.active && Array.isArray(event.active)) {
      activeElements = event.active;
    } else if (event?.length > 0) {
      activeElements = event;
    } else if (Array.isArray(event)) {
      activeElements = event;
    }
    
    if (activeElements.length > 0) {
      this.handleStatusClick(activeElements);
    }
  }

  private updateStatusChart() {
    // First, get all tasks matching priority and task filters
    const baseFilteredTasks = this.tasks.filter(t => {
      const matchesPriority = this.selectedPriorities.has(t.priority);
      const matchesTask = this.selectedTasks.size === 0 || this.selectedTasks.has(t.name);
      return matchesPriority && matchesTask;
    });
    
    // Then count by status from the filtered tasks
    const todo = baseFilteredTasks.filter(t => t.status === 'to do').length;
    const inProgress = baseFilteredTasks.filter(t => t.status === 'in progress').length;
    const done = baseFilteredTasks.filter(t => t.status === 'done').length;
    
    // Now apply status filter to show only selected statuses with proper values
    const todoFinal = this.selectedStatuses.has('to do') ? todo : 0;
    const inProgressFinal = this.selectedStatuses.has('in progress') ? inProgress : 0;
    const doneFinal = this.selectedStatuses.has('done') ? done : 0;
    
    const backgroundColor = [
      this.selectedStatuses.has('to do') ? '#2196f3' : '#cccccc',
      this.selectedStatuses.has('in progress') ? '#ff9800' : '#cccccc',
      this.selectedStatuses.has('done') ? '#4caf50' : '#cccccc'
    ];
    
    // Force new object reference to trigger change detection
    this.statusChartData = {
      ...this.statusChartData,
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [{
        data: [todoFinal, inProgressFinal, doneFinal],
        backgroundColor: backgroundColor
      }]
    };
  }

  private updatePriorityChart() {
    // First, get all tasks matching status and task filters
    const baseFilteredTasks = this.tasks.filter(t => {
      const matchesStatus = this.selectedStatuses.has(t.status);
      const matchesTask = this.selectedTasks.size === 0 || this.selectedTasks.has(t.name);
      return matchesStatus && matchesTask;
    });
    
    // Then count by priority from the filtered tasks
    const high = baseFilteredTasks.filter(t => t.priority === 'high').length;
    const medium = baseFilteredTasks.filter(t => t.priority === 'medium').length;
    const low = baseFilteredTasks.filter(t => t.priority === 'low').length;
    
    // Now apply priority filter to show only selected priorities with proper values
    const highFinal = this.selectedPriorities.has('high') ? high : 0;
    const mediumFinal = this.selectedPriorities.has('medium') ? medium : 0;
    const lowFinal = this.selectedPriorities.has('low') ? low : 0;
    
    const backgroundColor = [
      this.selectedPriorities.has('high') ? '#f44336' : '#cccccc',
      this.selectedPriorities.has('medium') ? '#ff9800' : '#cccccc',
      this.selectedPriorities.has('low') ? '#4caf50' : '#cccccc'
    ];
    
    // Force new object reference to trigger change detection
    this.priorityChartData = {
      ...this.priorityChartData,
      labels: ['High', 'Medium', 'Low'],
      datasets: [{
        label: 'Tasks by Priority',
        data: [highFinal, mediumFinal, lowFinal],
        backgroundColor: backgroundColor
      }]
    };
  }

  private updateDurationChart() {
    const baseFilteredTasks = this.tasks.filter(t => {
      const matchesStatus = this.selectedStatuses.has(t.status);
      const matchesPriority = this.selectedPriorities.has(t.priority);
      const matchesTask = this.selectedTasks.size === 0 || this.selectedTasks.has(t.name);
      return matchesStatus && matchesPriority && matchesTask;
    });
    
    // Check if any filters are applied (status or priority)
    const hasActiveFilters = 
      this.selectedStatuses.size < 3 || 
      this.selectedPriorities.size < 3 || 
      this.selectedTasks.size > 0;
    
    // Keep bars grey when filters are applied
    const backgroundColor = baseFilteredTasks.map(t => {
      if (hasActiveFilters) {
        return '#cccccc';
      }
      return '#9c27b0';
    });
    
    // Force new object reference to trigger change detection
    this.durationChartData = {
      ...this.durationChartData,
      labels: baseFilteredTasks.map(t => t.name),
      datasets: [{
        label: 'Days Required',
        data: baseFilteredTasks.map(t => t.days),
        backgroundColor: backgroundColor
      }]
    };
  }
}
