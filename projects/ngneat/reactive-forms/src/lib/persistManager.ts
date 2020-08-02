import { Observable } from 'rxjs';

export interface PersistManager<T> {
  setValue(key: string, data: T): T | Promise<T> | Observable<T>;
  getValue(key: string): T | Promise<T> | Observable<T>;
}
