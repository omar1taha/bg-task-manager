import { Component, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header';
import { StatsBarComponent } from './components/stats-bar/stats-bar';
import { TaskListComponent } from './components/task-list/task-list';
import { RightPanelComponent } from './components/right-panel/right-panel';
import { CollectionTask, ActivityLogEntry, TaskStatus } from './models/task.model';
import { TaskFormValue } from './components/task-form/task-form';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, StatsBarComponent, TaskListComponent, RightPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  tasks = signal<CollectionTask[]>([]);
  activityLog = signal<ActivityLogEntry[]>([]);
  viewedTask = signal<CollectionTask | null>(null);

  private taskCounter = 0;

  handleCreateTask(formValue: TaskFormValue) {
    this.taskCounter++;
    const id = `TF-${String(this.taskCounter).padStart(3, '0')}`;

    const newTask: CollectionTask = {
      id,
      name: formValue.name,
      dataType: formValue.dataType,
      amount: formValue.amount,
      interval: formValue.interval,
      status: TaskStatus.Pending,
      collected: [],
      createdAt: new Date()
    };

    this.tasks.update(list => [...list, newTask]);
    this.addLog(id, `queued — ${formValue.name} (${formValue.amount} ${formValue.dataType} every ${formValue.interval}s)`);
  }

  handleView(taskId: string) {
    const task = this.tasks().find(t => t.id === taskId);
    if (task) {
      this.viewedTask.set(task);
    }
  }

  handlePause(taskId: string) {
    // TODO: wire to service to actually stop the interval
    console.log('pausing', taskId);
    this.addLog(taskId, 'paused');
  }

  handleResume(taskId: string) {
    console.log('resuming', taskId);
    this.addLog(taskId, 'resumed');
  }

  handleRemove(taskId: string) {
    this.tasks.update(list => list.filter(t => t.id !== taskId));
    if (this.viewedTask()?.id === taskId) {
      this.viewedTask.set(null);
    }
    this.addLog(taskId, 'removed');
  }

  handlePauseAll() {
    // TODO: loop through running tasks and pause each
  }

  handleResumeAll() {
    this.tasks().forEach(t => console.log(t.id, t.status));
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
