import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaClinicaTablaComponent } from './historia-clinica-tabla.component';

describe('HistoriaClinicaTablaComponent', () => {
  let component: HistoriaClinicaTablaComponent;
  let fixture: ComponentFixture<HistoriaClinicaTablaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriaClinicaTablaComponent]
    });
    fixture = TestBed.createComponent(HistoriaClinicaTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
