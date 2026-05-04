import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DataType } from '../../models/task.model';

export interface TypeOption {
  label: string;
  value: DataType;
}

@Component({
  selector: 'app-type-selector',
  templateUrl: './type-selector.html',
  styleUrl: './type-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeSelectorComponent {
  options = input.required<TypeOption[]>();
  value = input.required<DataType>();
  valueChange = output<DataType>();

  select(val: DataType) {
    this.valueChange.emit(val);
  }
}
