import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { CollectionTask, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule, ButtonModule, TagModule, ProgressBarModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent {
  task = input.required<CollectionTask>();

  onView = output<string>();
  onPause = output<string>();
  onResume = output<string>();
  onRemove = output<string>();

  get progress(): number {
    const t = this.task();
    return Math.round((t.collected.length / t.amount) * 100);
  }

  get isRunning(): boolean {
    return this.task().status === TaskStatus.Running;
  }

  get isPaused(): boolean {
    return this.task().status === TaskStatus.Paused;
  }

  get statusSeverity(): 'success' | 'warn' | 'info' | 'secondary' {
    switch (this.task().status) {
      case TaskStatus.Running: return 'success';
      case TaskStatus.Paused: return 'warn';
      case TaskStatus.Completed: return 'info';
      default: return 'secondary';
    }
  }

  get lastFetched(): string {
    const items = this.task().collected;
    if (items.length === 0) return '';
    return items[items.length - 1].title;
  }
}
