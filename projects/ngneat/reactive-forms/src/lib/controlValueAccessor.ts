import { ControlValueAccessor as NgControlValueAccessor } from '@angular/forms';

export abstract class ControlValueAccessor<T> implements NgControlValueAccessor {
  abstract writeValue(value: T): void;

  onChange = (value: T | null) => {};
  onTouched = () => {};

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
