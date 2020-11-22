import { of } from 'rxjs';
import { FormControl } from '../formControl';
import { FormGroup } from '../formGroup';
import { FormArray } from '../formArray';

export interface NestedForm {
  a: number;
  b?: {
    a: string;
    c: number[];
  };
  c?: { a: number }[];
  d?: boolean;
  e?: any;
}

export interface NestedFormControls {
  a: FormControl<number>;
  b: FormGroup<{
    a: FormControl<string>;
    c: FormArray<FormControl<number>>;
  }>;
  c: FormArray<FormGroup<{ a: number }>>;
}

export interface User {
  id: number;
  name?: string;
}
export interface Errors {
  required: boolean;
  pattern: { requiredPattern: string; actualValue: string };
}
export const user: User = { id: 1, name: 'Itay' };
export const nestedFormValue: NestedForm = {
  a: 1,
  b: {
    a: '1',
    c: [1]
  },
  c: [{ a: 2 }]
};
export const errors: Errors = { required: true, pattern: { requiredPattern: '*', actualValue: '*' } };
export const required = control => ({ required: true });
export const pattern = control => ({ pattern: { requiredPattern: '*', actualValue: '*' } });
export const requiredAsync = control => of({ required: true });
export const patternAsync = control => of({ pattern: { requiredPattern: '*', actualValue: '*' } });
