import { PersistManager } from './persistManager';

export class LocalStorageManager<T> implements PersistManager<T> {
  setValue(key: string, data: T): T {
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }

  getValue(key: string): T {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
}
