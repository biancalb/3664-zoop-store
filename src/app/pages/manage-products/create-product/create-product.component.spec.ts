import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

class MockCreateProductApiService {
  getAllCategories(): Observable<string[]> {
    return of(['electronics', `men's clothing`, 'jewelery']);
  }
}

fdescribe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let createProductService: CreateProductService;
  let createProductApiService: CreateProductApiService;

  const dialogRefMock = {
    close: jasmine.createSpy('close')
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
        { provide: MAT_DIALOG_DATA, useValue: {} }
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
});
