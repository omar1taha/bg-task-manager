import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ActivityLogEntry } from '../../models/task.model';

@Component({
  selector: 'app-activity-log',
  imports: [DatePipe, ButtonModule],
  templateUrl: './activity-log.html',
  styleUrl: './activity-log.scss'
})
export class ActivityLogComponent {
  entries = input.required<ActivityLogEntry[]>();
  clearLog = output<void>();
}
