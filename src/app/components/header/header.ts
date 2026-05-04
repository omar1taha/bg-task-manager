import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-header',
  imports: [TagModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  clock = signal('');
  private timerId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.updateClock();
    this.timerId = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private updateClock() {
    const now = new Date();
    this.clock.set(now.toLocaleTimeString('en-GB'));
  }
}
