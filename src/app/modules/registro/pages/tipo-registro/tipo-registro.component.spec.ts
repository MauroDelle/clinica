import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoRegistroComponent } from './tipo-registro.component';

describe('TipoRegistroComponent', () => {
  let component: TipoRegistroComponent;
  let fixture: ComponentFixture<TipoRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoRegistroComponent]
    });
    fixture = TestBed.createComponent(TipoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
