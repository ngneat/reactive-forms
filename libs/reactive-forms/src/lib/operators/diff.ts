import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { filter, pairwise, startWith, map } from 'rxjs/operators';

const toArray = (object: Record<any, any>) => Object.keys(object);
const isArray = (value: any): boolean => value && Array.isArray(value);
const isObject = (value: any): boolean => typeof value === 'object' && value !== null;
const isFormArray = (prev: any, curr: any): boolean => isArray(curr) || isArray(prev);
const isFormGroup = (prev: any, curr: any): boolean => isObject(curr) || isObject(prev);
const isFormControl = (prev: any, curr: any): boolean => !isFormArray(prev, curr) && !isFormGroup(prev, curr);
const convertTypesToArray = (left: any, right: any): Array<[]> => [(left as unknown) as [], (right as unknown) as []];

/**
 * An operator which is used to filter valueChanges$ output, that it would emit only changed parts.
 * 
 * @return {MonoTypeOperatorFunction} An Observable that emits items from the source Observable with only changed values.
 */
export function diff<T>(): MonoTypeOperatorFunction<T | undefined> {
  return (source$: Observable<T | undefined>) =>
    source$.pipe(
      startWith(undefined),
      pairwise(),
      map(control => reduceControlValue<T>(...control)),
      filter(control => control !== undefined)
    )
}

function reduceControlValue<T>(prev: T | undefined, curr: T | undefined): T | undefined {
  if (prev === undefined) {
    return curr;
  }

  if (isFormControl(prev, curr)) {
    return prev === curr ? undefined : curr;
  }

  if (isFormArray(prev, curr)) {
    const [left, right] = convertTypesToArray(prev, curr);
    return compareArraysContent(left, right) ? undefined : curr;
  }

  return compareFormGroup(prev, curr);
}

function compareFormGroup<T>(prev: T, curr: T): T | undefined {
  const reduced = reduceFormGroup(prev, curr);

  return toArray(reduced).length === 0 ? undefined : reduced;
}

function reduceFormGroup<T extends Record<any, any>>(prev: T, curr: T): T {
  if (!prev) {
    return curr;
  }

  return toArray(curr).reduce((acc, key) => {
    const control = reduceControlValue(prev[key], curr[key]);
    if (control !== undefined) {
      acc[key] = control;
    }

    return acc;
  }, {} as Record<any, any>);
}


function compareArraysContent<T extends []>(left: T, right: T): boolean {
  left = Array.isArray(left) ? left : ([] as T);
  right = Array.isArray(right) ? right : ([] as T);
  return left.length === right.length && left.every(value => right.includes(value));
}