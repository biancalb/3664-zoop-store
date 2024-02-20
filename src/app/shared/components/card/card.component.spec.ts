import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

import { Product } from '../../../types/product.inteface';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatIconModule,
        CardComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar as propriedades do produto no template', () => {
    const product: Product = {
      id: 3,
      title: 'Macbook Pro',
      category: 'eletronics',
      description: 'Laptop',
      price: 2000,
      image: 'src/macbook-pro.png'
   };

    component.product = product;
    fixture.detectChanges();

    const productImg = fixture.debugElement.query(By.css('img')).nativeElement;
    const productTitle = fixture.debugElement.query(By.css('h2')).nativeElement;
    const productDescription = fixture.debugElement.query(By.css('p')).nativeElement;
    const productPrice = fixture.debugElement.query(By.css('h3')).nativeElement;

    expect(productImg.src).toContain(product.image);
    expect(productTitle.textContent).toContain(product.title);
    expect(productDescription.textContent).toContain(product.description);
    expect(productPrice.textContent).toContain(`R$ ${product.price}`);
  });

  it('deve emitir o evento onDelete quando onDeleteClick for chamado', () => {
    const product: Product = {
      id: 1,
      title: 'iPhone 15',
      category: 'eletronics',
      description: 'Smartphone',
      price: 1000,
      image: 'src/iphone-15.png'
    };

    const spy = jest.spyOn(component.onDelete, 'emit');

    component.product = product;
    component.isManagable = true;

    fixture.detectChanges();

    const managableElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(managableElement).not.toBeNull();

    component.onDeleteClick();
    expect(spy).toHaveBeenCalledWith(product);
  });

  it('deve emitir o evento onEdit quando onEditClick for chamado', () => {
    const product: Product = {
      id: 2,
      title: 'Samsung s22',
      category: 'eletronics',
      description: 'Smartphone',
      price: 1000,
      image: 'src/samsung-s22.png'
   };

    const spy = jest.spyOn(component.onEdit, 'emit');
    component.product = product;
    component.isManagable = true;

    fixture.detectChanges();

    const managableElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(managableElement).not.toBeNull();

    component.onEditClick();

    expect(spy).toHaveBeenCalledWith(product);
  });
});
