import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaHorariosTurnoComponent } from './lista-horarios-turno.component';

describe('ListaHorariosTurnoComponent', () => {
  let component: ListaHorariosTurnoComponent;
  let fixture: ComponentFixture<ListaHorariosTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaHorariosTurnoComponent]
    });
    fixture = TestBed.createComponent(ListaHorariosTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
