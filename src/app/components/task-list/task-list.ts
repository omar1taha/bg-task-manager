import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CollectionTask } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card';

@Component({
  selector: 'app-task-list',
  imports: [ButtonModule, TaskCardComponent],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  tasks = input.required<CollectionTask[]>();

  onView = output<string>();
  onPause = output<string>();
  onResume = output<string>();
  onRemove = output<string>();
  onPauseAll = output<void>();
  onResumeAll = output<void>();

  get hasTasks(): boolean {
    return this.tasks().length > 0;
  }
}
