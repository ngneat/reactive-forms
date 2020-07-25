export interface PersistManager<T> {
  setValue(key: string, data: T): void;
  getValue(key: string): T;
}
