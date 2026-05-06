import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import { StatsBarComponent } from './components/stats-bar/stats-bar';
import { TaskListComponent } from './components/task-list/task-list';
import { RightPanelComponent } from './components/right-panel/right-panel';
import { ActivityLogEntry } from './models/task.model';
import { TaskFormValue } from './components/task-form/task-form';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, StatsBarComponent, TaskListComponent, RightPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly taskService = inject(TaskService);

  tasks = this.taskService.tasks;
  activityLog = signal<ActivityLogEntry[]>([]);
  viewedTaskId = signal<string | null>(null);
  viewedTask = computed(() => this.tasks().find(t => t.id === this.viewedTaskId()) || null);

  handleCreateTask(formValue: TaskFormValue) {
    const task = this.taskService.createTask(formValue);
    this.addLog(task.id, `queued — ${formValue.name} (${formValue.amount} ${formValue.dataType} every ${formValue.interval}s)`);
  }

  handleView(taskId: string) {
    this.viewedTaskId.set(taskId);
  }

  handlePause(taskId: string) {
    this.taskService.pauseTask(taskId);
    this.addLog(taskId, 'paused');
  }

  handleResume(taskId: string) {
    this.taskService.resumeTask(taskId);
    this.addLog(taskId, 'resumed');
  }

  handleRemove(taskId: string) {
    this.taskService.removeTask(taskId);
    if (this.viewedTaskId() === taskId) {
      this.viewedTaskId.set(null);
    }
    this.addLog(taskId, 'removed');
  }

  handlePauseAll() {
    this.taskService.pauseAll();
    this.addLog('ALL', 'paused all');
  }

  handleResumeAll() {
    this.taskService.resumeAll();
    this.addLog('ALL', 'resumed all');
  }

  handleClearLog() {
    this.activityLog.set([]);
  }

  private addLog(taskId: string, message: string) {
    const entry: ActivityLogEntry = {
      timestamp: new Date(),
      taskId,
      message
    };
    this.activityLog.update(log => [...log, entry]);
  }
}
