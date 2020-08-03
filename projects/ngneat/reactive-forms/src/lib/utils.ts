import { from, isObservable, Observable, of } from 'rxjs';

export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function isFunction(x: any): x is Function {
  return typeof x === 'function';
}

export function isNil(v: any): boolean {
  return v === null || v === undefined;
}

export function isPromise(value: any): value is Promise<unknown> {
  return typeof value?.then === 'function';
}

export function wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
  if (isObservable(value) || isPromise(value)) {
    return from(value);
  }

  return of(value);
}
