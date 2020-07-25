import { PersistManager } from './persistManager';

export class SessionStorageManager<T> implements PersistManager<T> {
  setValue(key: string, data: T): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getValue(key: string): T {
    return JSON.parse(sessionStorage.getItem(key) || '{}');
  }
}
