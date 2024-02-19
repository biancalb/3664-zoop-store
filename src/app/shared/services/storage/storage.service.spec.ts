import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save', () => {
    it('deve salvar os dados na sessionStorage', () => {
      const key = 'testKey';
      const value = { name: 'test' };
      service.save(key, { key, value });

      const storedValue = JSON.parse(sessionStorage.getItem(key)!);
      expect(storedValue).toEqual(value);
    });
  });

  describe('get', () => {
    it('deve obter os dados da sessionStorage', () => {
      const key = 'testKey1';
      const value = { name: 'test1' };
      sessionStorage.setItem(key, JSON.stringify(value));

      const storedValue = service.get(key);

      expect(JSON.stringify(storedValue)).toEqual(JSON.stringify(value));
    });

    it('deve retornar null se os dados não forem encontrados na sessionStorage', () => {
      const storedValue = service.get('nonExistentKey');
      expect(storedValue).toBeNull();
    });
  });

  describe('getAll', () => {
    it('deve obter todos os dados da sessionStorage', () => {
      sessionStorage.clear();

      const data1 = { id: 1, name: 'Test 1' };
      const data2 = { id: 2, name: 'Test 2' };
      sessionStorage.setItem('1', JSON.stringify(data1));
      sessionStorage.setItem('2', JSON.stringify(data2));

      const storedData = service.getAll();
      expect(storedData).toEqual([{ id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' }]);
    });
  });

  describe('getLastItem', () => {
    it('deve retornar o último item armazenado na sessionStorage', () => {
      sessionStorage.clear();

      const data1 = { id: 1, name: 'Test 1' };
      const data2 = { id: 2, name: 'Test 2' };
      sessionStorage.setItem('1', JSON.stringify(data1));
      sessionStorage.setItem('2', JSON.stringify(data2));

      const lastItem = service.getLastItem();
      expect(lastItem).toEqual({ key: '2', value: { id: 2, name: 'Test 2' } });
    });

    it('deve retornar null se a sessionStorage estiver vazia', () => {
      sessionStorage.clear();

      const lastItem = service.getLastItem();
      expect(lastItem).toBeNull();
    });
  });

  describe('remove', () => {
    it('deve remover os dados da sessionStorage', () => {
      const key = 'testKey';
      const value = { name: 'test' };
      sessionStorage.setItem(key, JSON.stringify(value));
      service.remove(key);
      const storedValue = sessionStorage.getItem(key);

      expect(storedValue).toBeNull();
    });
  });
});
