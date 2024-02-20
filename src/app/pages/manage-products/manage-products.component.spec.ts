import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageProductsComponent } from './manage-products.component';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, of } from 'rxjs';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsService } from '../../shared/services/products/products.service';
import { ProductsApiService } from '../../shared/services/products/products-api.service';
import { StorageService } from '../../shared/services/storage/storage.service';

const productsMock = [
  { id: 1, title: 'Produto A', category: 'eletronic', description: 'Product A', price: 50, image: 'image.png' },
  { id: 2, title: 'Produto B', category: `woman's clothes`, description: 'Product B', price: 80, image: 'image.png' }
];

const data = productsMock
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

describe('ManageProductsComponent', () => {
  let dialog: MatDialog;
  let component: ManageProductsComponent;
  let fixture: ComponentFixture<ManageProductsComponent>;
  let productsService: ProductsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BannerComponent,
        SearchComponent,
        MatIconModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      declarations: [ ManageProductsComponent ],
      providers: [
        MatDialog,
        ProductsService,
        ProductsApiService,
        { provide: StorageService, useValue: storageServiceMock }
      ]
    }).compileComponents();

    dialog = TestBed.inject(MatDialog);
    productsService = TestBed.inject(ProductsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve abrir o diálogo de criação de produto ao chamar onSubscribeProduct', () => {
    component.onSubscribeProduct();

    jest.spyOn(component.dialogRef as any, 'afterClosed').mockReturnValue(of({}))

    component.dialogRef.close();

    expect(component.products()).not.toBeNull();
  });

  it('deve deletar o produto ao chamar onDelete', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    const mockProduct = { id: 1, title: 'Produto A', category: 'eletronic', description: 'Product A', price: 50, image: 'image.png' };

    component.onDelete(mockProduct);

    expect(component.products()).not.toBeNull();
    expect(component.products().length).toEqual(1);
  });

  it('deve atualizar a lista de produtos ao chamar onSearchText', () => {
    const searchText = 'A';
    component.onSearchText(searchText);

    expect(component.products()).not.toBeNull();
    expect(component.products()[0].title).toEqual('Produto A');
  });

  it('deve manter a lista de produtos quando o searchText é vazio', () => {
    const searchText = '';
    component.onSearchText(searchText);

    expect(component.products()).not.toBeNull();
    expect(component.products().length).toBeGreaterThanOrEqual(1);
  });

  it('deve abrir o diálogo de edição de produto ao chamar onEdit', () => {
    const mockProduct = { id: 1, title: 'Produto Teste', category: 'Teste', description: 'Teste', price: 10, image: 'image.png' };
    component.onEdit(mockProduct);

    jest.spyOn(component.dialogRef as any, 'afterClosed').mockReturnValue(of({}));

    component.dialogRef.close();

    expect(component.products()).not.toBeNull();
  });
});
