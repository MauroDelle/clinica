import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesTurnoComponent } from './pacientes-turno.component';

describe('PacientesTurnoComponent', () => {
  let component: PacientesTurnoComponent;
  let fixture: ComponentFixture<PacientesTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacientesTurnoComponent]
    });
    fixture = TestBed.createComponent(PacientesTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
