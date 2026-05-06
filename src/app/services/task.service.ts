import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, interval, concatMap, takeWhile, tap, takeUntil } from 'rxjs';
import { CollectionTask, TaskStatus, PhotoRecord } from '../models/task.model';
import { TaskFormValue } from '../components/task-form/task-form';

@Injectable({ providedIn: 'root' })
export class TaskService implements OnDestroy {
  private readonly http = inject(HttpClient);

  readonly tasks = signal<CollectionTask[]>([]);

  private taskCounter = 0;
  private nextPhotoId = 1;
  private readonly subscriptions = new Map<string, Subscription>();
  private readonly destroy$ = new Subject<void>();

  createTask(formValue: TaskFormValue): CollectionTask {
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
      createdAt: new Date(),
    };

    this.tasks.update(list => [...list, newTask]);
    this.startExecution(id);

    return newTask;
  }

  pauseTask(taskId: string): void {
    this.cancelSubscription(taskId);
    this.updateTaskStatus(taskId, TaskStatus.Paused);
  }

  resumeTask(taskId: string): void {
    const task = this.tasks().find(t => t.id === taskId);
    if (!task || task.status !== TaskStatus.Paused) return;
    this.startExecution(taskId);
  }

  removeTask(taskId: string): void {
    this.cancelSubscription(taskId);
    this.tasks.update(list => list.filter(t => t.id !== taskId));
  }

  pauseAll(): void {
    this.tasks()
      .filter(t => t.status === TaskStatus.Running)
      .forEach(t => this.pauseTask(t.id));
  }

  resumeAll(): void {
    this.tasks()
      .filter(t => t.status === TaskStatus.Paused)
      .forEach(t => this.resumeTask(t.id));
  }

  private startExecution(taskId: string): void {
    this.updateTaskStatus(taskId, TaskStatus.Running);

    const task = this.tasks().find(t => t.id === taskId);
    if (!task) return;

    const intervalMs = task.interval * 1000;

    const sub = interval(intervalMs)
      .pipe(
        takeUntil(this.destroy$),
        takeWhile(() => {
          const current = this.tasks().find(t => t.id === taskId);
          return !!current && current.collected.length < current.amount;
        }),
        concatMap(() => {
          const photoId = this.getNextPhotoId();
          return this.http.get<PhotoRecord>(
            `https://jsonplaceholder.typicode.com/photos/${photoId}`
          );
        }),
        tap((record: PhotoRecord) => {
          this.tasks.update(list =>
            list.map(t =>
              t.id === taskId
                ? { ...t, collected: [...t.collected, record] }
                : t
            )
          );
        })
      )
      .subscribe({
        complete: () => {
          this.subscriptions.delete(taskId);
          this.updateTaskStatus(taskId, TaskStatus.Completed);
        },
      });

    this.subscriptions.set(taskId, sub);
  }

  private cancelSubscription(taskId: string): void {
    const sub = this.subscriptions.get(taskId);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(taskId);
    }
  }

  private updateTaskStatus(taskId: string, status: TaskStatus): void {
    this.tasks.update(list =>
      list.map(task => (task.id === taskId ? { ...task, status } : task))
    );
  }

  private getNextPhotoId(): number {
    const id = this.nextPhotoId;
    this.nextPhotoId = (this.nextPhotoId % 5000) + 1;
    return id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
  }
}
