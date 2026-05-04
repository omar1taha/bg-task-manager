import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { DataType } from '../../models/task.model';
import { TypeSelectorComponent } from '../type-selector/type-selector';

export interface TaskFormValue {
  name: string;
  dataType: DataType;
  amount: number;
  interval: number;
}

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, SliderModule, TypeSelectorComponent],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent {
  onSubmit = output<TaskFormValue>();

  dataTypeOptions = [
    { label: 'USERS', value: DataType.Users },
    { label: 'POSTS', value: DataType.Posts },
    { label: 'PHOTOS', value: DataType.Photos }
  ];

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dataType: new FormControl(DataType.Photos, { nonNullable: true }),
    amount: new FormControl(20, { nonNullable: true }),
    interval: new FormControl(1.5, { nonNullable: true })
  });

  get apiEndpoint(): string {
    const type = this.form.controls.dataType.value;
    switch (type) {
      case DataType.Users:
        return 'randomuser.me/api/?results=1';
      case DataType.Posts:
        return 'jsonplaceholder.typicode.com/posts/{id}';
      case DataType.Photos:
        return 'jsonplaceholder.typicode.com/photos/{id}';
    }
  }

  submit() {
    if (this.form.invalid) return;

    this.onSubmit.emit(this.form.getRawValue());
    this.form.controls.name.reset();
  }
}
