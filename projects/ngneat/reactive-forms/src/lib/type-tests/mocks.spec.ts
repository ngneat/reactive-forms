import { of } from 'rxjs';

export interface NestedForm {
  a: number;
  b?: {
    a: string;
    c: number[];
  };
  c?: { a: number }[];
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
export const errors: Errors = { required: true, pattern: { requiredPattern: '*', actualValue: '*' } };
export const required = control => ({ required: true });
export const pattern = control => ({ pattern: { requiredPattern: '*', actualValue: '*' } });
export const requiredAsync = control => of({ required: true });
export const patternAsync = control => of({ pattern: { requiredPattern: '*', actualValue: '*' } });
