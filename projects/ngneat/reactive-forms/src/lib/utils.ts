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

export function mergeErrors<E>(existing: Partial<E>, toAdd: Partial<E>) {
  if (!existing && !toAdd) {
    return null;
  }
  return {
    ...existing,
    ...toAdd
  };
}

export function removeError<E>(errors: E, key: keyof E) {
  if (!errors) {
    return null;
  }
  const updatedErrors = {
    ...errors
  };
  delete updatedErrors[key];
  return Object.keys(updatedErrors).length > 0 ? updatedErrors : null;
}

export function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * @return {boolean} True if arrays are identical.
 */
export function compareArraysContent<T extends []>(left: T, right: T): boolean {
  left = Array.isArray(left) ? left : ([] as T);
  right = Array.isArray(right) ? right : ([] as T);
  return left.length === right.length && left.every(value => right.includes(value));
}
