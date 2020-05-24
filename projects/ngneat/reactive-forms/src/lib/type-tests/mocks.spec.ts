import { of } from 'rxjs';

export interface User {
  id: string;
  name: string;
}
export interface Errors {
  required: boolean;
  pattern: { requiredPattern: string; actualValue: string };
}
export const user: User = { id: '1', name: 'Itay' };
export const errors: Errors = { required: true, pattern: { requiredPattern: '*', actualValue: '*' } };
export const required = control => ({ required: true });
export const pattern = control => ({ pattern: { requiredPattern: '*', actualValue: '*' } });
export const requiredAsync = control => of({ required: true });
export const patternAsync = control => of({ pattern: { requiredPattern: '*', actualValue: '*' } });
