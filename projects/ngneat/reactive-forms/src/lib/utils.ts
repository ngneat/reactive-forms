export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function isFunction(x: any): x is Function {
  return typeof x === 'function';
}
