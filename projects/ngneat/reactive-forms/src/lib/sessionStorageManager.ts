import { PersistManager } from './persistManager';

export class SessionStorageManager<T> implements PersistManager<T> {
  setValue(key: string, data: T): T {
    sessionStorage.setItem(key, JSON.stringify(data));
    return data;
  }

  getValue(key: string): T {
    return JSON.parse(sessionStorage.getItem(key) || '{}');
  }
}
