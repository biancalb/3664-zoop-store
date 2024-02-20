import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { Product } from '../../../types/product.inteface';
import { StorageService } from '../storage/storage.service';
import { ProductsApiService } from './products-api.service';
import { ProductsService } from './products.service';

class StorageServiceMock {
  private data: { [key: string]: any } = {};

  getAll(): any[] {
    return Object.values(this.data);
  }

  setValue(key: string, value: any): void {
    this.data[key] = value;
  }

  remove(key: string): void {
    delete this.data[key];
  }
}
class ProductsApiServiceMock {
  getAllProducts(): Observable<Product[]> {
    return of([
      { id: 1, title: 'Produto A', category: 'eletronic', description: 'Product A', price: 50, image: 'image.png' },
      { id: 2, title: 'Produto B', category: `woman's clothes`, description: 'Product B', price: 80, image: 'image.png' }
    ]);
  }
}
const productStorage: Product[] = [
  { id: 3, title: 'Produto C', category: 'eletronic', description: 'Product C', price: 100, image: 'image.png' },
  { id: 4, title: 'Produto D', category: `woman's clothes`, description: 'Product D', price: 10.5, image: 'image.png' }
];

describe('ProductsService', () => {
  let service: ProductsService;
  let productsApiServiceMock: ProductsApiServiceMock;
  let storageServiceMock: StorageServiceMock;

  beforeEach(() => {
    productsApiServiceMock = new ProductsApiServiceMock();
    storageServiceMock = new StorageServiceMock();

    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsApiService, useClass: ProductsApiServiceMock },
        { provide: StorageService, useClass: StorageServiceMock }
      ]
    });

    storageServiceMock.setValue('products', productStorage);
    TestBed.overrideProvider(StorageService, { useValue: storageServiceMock });

    service = TestBed.inject(ProductsService)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('construtor', () => {
    it('deve inicializar products com dados do storage', () => {
      const products = service.products().flat();

      expect(products).not.toBeNull();
      expect(products.length).toBe(2);
    });
  });

  describe('find', () => {
    it('deve filtrar os produtos pelo título', () => {
      service.find('C');

      const products = service.products().flat();

      expect(products.length).toBe(1);
      expect(products[0].title).toBe('Produto C');
    });
  });

  describe('fetchAllProductsCreated', () => {
    it('deve retornar todos os produtos', () => {
      const produtos: Product[] = [
        { id: 5, title: 'Produto F', category: 'eletronic', description: 'Product F', price: 500, image: 'image.png' },
      ];

      storageServiceMock.setValue('products', produtos);
      const productsCreated = service.fetchAllProductsCreated()().flat()

      expect(productsCreated).toEqual(produtos);
    });
  });

  describe('fetchAllProducts', () => {
    it('deve buscar os produtos da API e os que estão no Sesstion Storage', () => {
      service.fetchAllProducts(10);

      expect(service.products().length).toBe(4);
    });
  });

  describe('delete', () => {
    it('deve remover o produto do armazenamento', () => {
      jest.spyOn(storageServiceMock, 'remove');
      const initialProductsLength = storageServiceMock.getAll().length;

      service.delete(productStorage[0]);

      expect(storageServiceMock.remove).toHaveBeenCalledTimes(1);
      expect(storageServiceMock.getAll().length).toBeLessThanOrEqual(initialProductsLength);
    });
  });
});
