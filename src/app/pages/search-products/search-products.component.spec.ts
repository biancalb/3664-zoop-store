import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { of } from 'rxjs';

import { BannerComponent } from '../../shared/components/banner/banner.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { ProductsApiService } from '../../shared/services/products/products-api.service';
import { ProductsService } from '../../shared/services/products/products.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { SearchProductsComponent } from './search-products.component';

const MODULES = [
  CommonModule,
  InfiniteScrollModule,
  BrowserAnimationsModule,
  HttpClientTestingModule
];

const COMPONENTS = [
  BannerComponent,
  SearchComponent,
  CardComponent
];

const productsMock = [
  { id: 1, title: 'Produto A', category: 'eletronic', description: 'Product A', price: 50, image: 'image.png' },
  { id: 2, title: 'Produto B', category: `woman's clothes`, description: 'Product B', price: 80, image: 'image.png' }
];

const data = {} as any

const storageServiceMock = {

  getAll: function(): any {
    return Object.values(data);
  },
  setValue: function(key: any, value: any) {
    data[key] = value;
  },
  remove: function(key: any) {
    delete data[key];
  }
};

const productsApiServiceMock = {
  getAllProducts: () => {
    return of(productsMock);
  }
};

describe('SearchProductsComponent', () => {
  let component: SearchProductsComponent;
  let fixture: ComponentFixture<SearchProductsComponent>;
  let productsService: ProductsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ...MODULES,
        ...COMPONENTS,
        SearchProductsComponent
      ],
      providers: [
        ProductsService,
        { provide: StorageService, useValue: null },
        { provide: ProductsApiService, useValue: null }
      ]
    })
    .compileComponents();

    TestBed.overrideProvider(StorageService, { useValue: storageServiceMock });
    TestBed.overrideProvider(ProductsApiService, { useValue: productsApiServiceMock });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar os produtos na inicialização', fakeAsync(() => {
    component.ngOnInit();

    tick();

    fixture.whenStable().then(() => {
      const products = component.products();

      expect(products).not.toBeNull();
      expect(products.length).toEqual(2);

      expect(products[0].title).toEqual('Produto A');
      expect(products[1].title).toEqual('Produto B');
    });
  }));

  it('deve buscar mais produtos ao rolar', fakeAsync(() => {
    productsMock.push(
      { id: 3, title: 'Produto C', category: `Shoes`, description: 'Product C', price: 150, image: 'image.png' }
    );

    component.onScroll();

    tick(1000);
    fixture.whenStable().then(() => {
      const products = component.products();

      expect(products).not.toBeNull();
      expect(products.length).toEqual(3);
    });
  }));

  it('deve buscar produtos quando o texto de pesquisa é fornecido', fakeAsync(() => {
    component.onSearchText('A')

    fixture.whenStable().then(() => {
      const products = component.products();

      expect(products).not.toBeNull();
      expect(products.length).toEqual(1);
      expect(products[0].title).toEqual('Produto A');
    });
  }));

  it('deve buscar produtos quando o texto de pesquisa é fornecido', fakeAsync(() => {
    component.onSearchText('')

    fixture.whenStable().then(() => {
      const products = component.products();
      expect(products).not.toBeNull();
    });
  }));
});
