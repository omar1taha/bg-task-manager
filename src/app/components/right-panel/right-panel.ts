import { Component, ChangeDetectionStrategy, effect, input, output, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CollectionTask, ActivityLogEntry } from '../../models/task.model';
import { TaskFormComponent, TaskFormValue } from '../task-form/task-form';
import { DataViewerComponent } from '../data-viewer/data-viewer';
import { ActivityLogComponent } from '../activity-log/activity-log';

@Component({
  selector: 'app-right-panel',
  imports: [TabsModule, TaskFormComponent, DataViewerComponent, ActivityLogComponent],
  templateUrl: './right-panel.html',
  styleUrl: './right-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightPanelComponent {
  viewedTask = input<CollectionTask | null>(null);
  activityLog = input.required<ActivityLogEntry[]>();

  activeTab = signal(0);

  onCreateTask = output<TaskFormValue>();
  onPause = output<string>();
  onResume = output<string>();
  onRemove = output<string>();
  onClearLog = output<void>();

  constructor() {
    effect(() => {
      if (this.viewedTask()) {
        this.activeTab.set(1);
      }
    });
  }

  setActiveTab(value: string | number | undefined) {
    this.activeTab.set(Number(value ?? 0));
  }
}
