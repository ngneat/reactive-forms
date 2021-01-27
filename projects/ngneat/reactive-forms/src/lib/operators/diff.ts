import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { filter, pairwise, startWith, map } from 'rxjs/operators';
import { compareArraysContent } from '../utils';

const toArray = object => Object.keys(object);
const isArray = (value): boolean => value && Array.isArray(value);
const isObject = (value): boolean => typeof value === 'object' && value !== null;
const isFormArray = (prev, curr): boolean => isArray(curr) || isArray(prev);
const isFormGroup = (prev, curr): boolean => isObject(curr) || isObject(prev);
const isFormControl = (prev, curr): boolean => !isFormArray(prev, curr) && !isFormGroup(prev, curr);
const convertTypesToArray = (left, right): Array<[]> => [(left as unknown) as [], (right as unknown) as []];

/**
 * An operator which is used to filter valueChanges$ output, that it would emit only changed parts.
 * @return {MonoTypeOperatorFunction} An Observable that emits items from the source Observable with only changed values.
 */
export function diff<T>(): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) =>
    source$.pipe(
      startWith(undefined),
      pairwise(),
      map(control => reduceControlValue<T>(...control)),
      filter(control => control !== undefined)
    );
}

function reduceControlValue<T>(prev: T, curr: T): T {
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

  return reduceFormGroup(prev, curr);
}

function reduceFormGroup<T>(prev: T, curr: T): T {
  const reduced = toArray(curr).reduce((acc, key) => {
    const control = reduceControlValue(prev[key], curr[key]);
    if (control !== undefined) {
      acc[key] = control;
    }

    return acc;
  }, {} as T);

  return toArray(reduced).length === 0 ? undefined : reduced;
}
