import { SessionStorageManager } from './sessionStorageManager';

type Person = {
  name: string;
  phone: {
    num: number;
    prefix: number;
  };
};

const createStorageManager = () => {
  return new SessionStorageManager<Person>();
};

describe('SessionStorageManager', () => {
  it('should set value', () => {
    const person = { name: 'ewan', phone: { num: 5550153, prefix: 288 } };
    const spy = jest.spyOn(sessionStorage, 'setItem').mockImplementation(() => {});
    const storageManager = createStorageManager();
    const response = storageManager.setValue('key', person);
    expect(spy).toHaveBeenCalledWith('key', JSON.stringify(person));
    expect(response).toEqual(person);
  });

  it('should get value', () => {
    const spy = jest.spyOn(sessionStorage, 'getItem').mockImplementation(() => '{ "name": "ewan" }');
    const storageManager = createStorageManager();
    const value = storageManager.getValue('key');
    expect(spy).toHaveBeenCalledWith('key');
    expect(value).toEqual({ name: 'ewan' });
  });
});
