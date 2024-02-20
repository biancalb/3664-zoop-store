import { TestBed } from '@angular/core/testing';

import { CreateProductService } from './create-product.service';
import { of } from 'rxjs';
import { StorageService } from '../../../../shared/services/storage/storage.service';
import { CreateProductApiService } from './create-product-api.service';

class StorageServiceMock {
  save(key: any, value: any): void {}
  getLastItem(): any {}
}

class CreateProductApiServiceMock {
  getCountProduct(): any {
    return of(1);
  }
}

describe('CreateProductService', () => {
  let service: CreateProductService;
  let storageServiceMock: StorageServiceMock;
  let createProductApiServiceMock: CreateProductApiServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateProductService,
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: CreateProductApiService, useClass: CreateProductApiServiceMock }
      ]
    });
    service = TestBed.inject(CreateProductService);
    storageServiceMock = TestBed.inject(StorageService);
    createProductApiServiceMock = TestBed.inject(CreateProductApiService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save', () => {
    it('deve salvar o produto no armazenamento', async () => {
      const produto = { id: 1, title: 'Produto A', category: 'eletronic', description: 'Product A', price: 50, image: 'image.png' };
      const storageServiceSpy = jest.spyOn(storageServiceMock, 'save');
      await service.save(produto);

      expect(storageServiceSpy).toHaveBeenCalledWith('1', { key: '1', value: produto });
    });

    it('deve gerar um ID e salvar o produto no armazenamento se o ID não for fornecido', async () => {
      jest.spyOn(storageServiceMock, 'getLastItem').mockReturnValue({ value: { id: 1 } });

      const produto = { id: null, title: 'Produto B', category: `woman's clothes`, description: 'Product B', price: 80, image: 'image.png' } as any;
      const storageServiceSpy = jest.spyOn(storageServiceMock, 'save');

      await service.save(produto);

      expect(storageServiceSpy).toHaveBeenCalled();
    });

    it('deve gerar um ID e salvar o produto no armazenamento se o ID não for fornecido e não tiver nenhum produto armazenado', async () => {
      jest.spyOn(storageServiceMock, 'getLastItem').mockReturnValue(null);

      const produto = { id: null, title: 'Produto C', category: `men's clothes`, description: 'Product C', price: 90, image: 'image.png' } as any;
      const storageServiceSpy = jest.spyOn(storageServiceMock, 'save');

      await service.save(produto);

      expect(storageServiceSpy).toHaveBeenCalled();
    });
  });
});
