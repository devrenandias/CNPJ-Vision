import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaDetalheComponent } from './empresa-detalhe.component';

describe('EmpresaDetalheComponent', () => {
  let component: EmpresaDetalheComponent;
  let fixture: ComponentFixture<EmpresaDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaDetalheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
