import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionesTurnoComponent } from './acciones-turno.component';

describe('AccionesTurnoComponent', () => {
  let component: AccionesTurnoComponent;
  let fixture: ComponentFixture<AccionesTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccionesTurnoComponent]
    });
    fixture = TestBed.createComponent(AccionesTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
