import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { CollectionTask, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-data-viewer',
  imports: [CommonModule, ButtonModule, TagModule, ProgressBarModule],
  templateUrl: './data-viewer.html',
  styleUrl: './data-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataViewerComponent {
  task = input<CollectionTask | null>(null);

  onPause = output<string>();
  onResume = output<string>();
  onRemove = output<string>();

  get progress(): number {
    const t = this.task();
    if (!t) return 0;
    return Math.round((t.collected.length / t.amount) * 100);
  }

  get remaining(): number {
    const t = this.task();
    if (!t) return 0;
    return t.amount - t.collected.length;
  }

  get statusSeverity(): 'success' | 'warn' | 'info' | 'secondary' {
    const t = this.task();
    if (!t) return 'secondary';
    switch (t.status) {
      case TaskStatus.Running: return 'success';
      case TaskStatus.Paused: return 'warn';
      case TaskStatus.Completed: return 'info';
      default: return 'secondary';
    }
  }

  get isRunning(): boolean {
    return this.task()?.status === TaskStatus.Running;
  }

  get isPaused(): boolean {
    return this.task()?.status === TaskStatus.Paused;
  }
}
