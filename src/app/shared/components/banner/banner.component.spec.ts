import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BannerComponent } from './banner.component';

@Component({
  selector: 'app-banner',
  template: ''
})
class MockBannerComponent {
  @Input() title: string = '';
}

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BannerComponent
      ],
      declarations: [ MockBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o título fornecido', () => {
    const titulo = 'Teste de título';
    component.title = titulo;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('h1');
    expect(element.textContent).toContain(titulo);
  });
});
