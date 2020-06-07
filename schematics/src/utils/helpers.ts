export function splice(str: string, pos: number, end: number, insertion: string = '') {
  return str.slice(0, pos) + insertion + str.slice(end);
}
