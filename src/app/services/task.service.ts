import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, concatMap, takeWhile, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CollectionTask, TaskStatus, PhotoRecord } from '../models/task.model';
import { TaskFormValue } from '../components/task-form/task-form';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly tasks = signal<CollectionTask[]>([]);

  private taskCounter = 0;
  private nextPhotoId = 1;

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
    this.startExecution(id, formValue.interval, formValue.amount);

    return newTask;
  }

  private startExecution(taskId: string, intervalSec: number, amount: number): void {
    this.updateTaskStatus(taskId, TaskStatus.Running);

    const intervalMs = intervalSec * 1000;

    interval(intervalMs)
      .pipe(
        takeWhile(() => {
          const task = this.tasks().find(t => t.id === taskId);
          return !!task && task.collected.length < amount;
        }),
        concatMap(() => {
          const photoId = this.getNextPhotoId();
          return this.http.get<PhotoRecord>(
            `https://jsonplaceholder.typicode.com/photos/${photoId}`
          );
        }),
        tap((record: PhotoRecord) => {
          this.tasks.update(list =>
            list.map(task =>
              task.id === taskId
                ? { ...task, collected: [...task.collected, record] }
                : task
            )
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        complete: () => {
          this.updateTaskStatus(taskId, TaskStatus.Completed);
        },
      });
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
}
