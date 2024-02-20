import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';

import { CreateProductComponent } from './create-product.component';
import { CreateProductApiService } from './services/create-product-api.service';
import { CreateProductService } from './services/create-product.service';
import { Product } from '../../../types/product.inteface';
import { BASE64_IMAGE } from '../../../shared/mocks/base64-image.mock';

const productMock: Product = {
  id: 1,
  title: 'Produto',
  description: 'Descrição',
  category: 'Categoria',
  price: 10,
  image: BASE64_IMAGE
}

class MockCreateProductApiService {
  getAllCategories(): Observable<string[]> {
    return of(['electronics', `men's clothing`, 'jewelery']);
  }
}

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let createProductService: CreateProductService;
  let createProductApiService: CreateProductApiService;

  const dialogRefMock = {
    close: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CreateProductComponent,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      providers: [
        CreateProductService,
        CreateProductApiService,
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: productMock }
      ]
    })
    .compileComponents();

    TestBed.overrideComponent(CreateProductComponent, {
      set: {
        providers: [
          { provide: CreateProductApiService, useClass: MockCreateProductApiService }
        ]
      }
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    createProductService = TestBed.inject(CreateProductService);
    createProductApiService = TestBed.inject(CreateProductApiService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar as categorias corretamente', () => {
    const expectedCategories = ['electronics', `men's clothing`, 'jewelery'];
    component.categories$.subscribe(categories => {
      expect(categories).toEqual(expectedCategories);
    });
  });

  it('deve definir os valores do formulário se os dados forem fornecidos', () => {
    expect(component.formGroup.get('id')?.value).toEqual(productMock.id);
    expect(component.formGroup.get('title')?.value).toEqual(productMock.title);
    expect(component.formGroup.get('description')?.value).toEqual(productMock.description);
    expect(component.formGroup.get('category')?.value).toEqual(productMock.category);
    expect(component.formGroup.get('price')?.value).toEqual(productMock.price);
  });

  it('deve chamar o método close do dialogRef ao clicar no botão de cancelar', () => {
    component.onCancelClick();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('deve chamar o método save do createProductService ao enviar o formulário', () => {
    jest.spyOn(createProductService, 'save').mockReturnValue(Promise.resolve());

    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: 'data:image/jpeg;base64,MockBase64String',
      onload: jest.fn()
    };

    jest.spyOn(window, 'FileReader').mockReturnValue(mockFileReader as any);

    const evento = {
      target: {
        files: [new File([''], 'imagem.jpeg', { type: 'image/jpeg' })]
      }
    };
    component.onImageSelected(evento);

    fixture.detectChanges();

    component.onSubmitForm();

    mockFileReader.onload();

    fixture.whenStable().then(() => {
      expect(createProductService.save).toHaveBeenCalled();
    });
  });
});
