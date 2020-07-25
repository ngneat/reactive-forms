import { PersistManager } from './persistManager';

export class LocalStorageManager<T> implements PersistManager<T> {
  setValue(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getValue(key: string): T {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
}
