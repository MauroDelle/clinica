import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEspecialistasTurnoComponent } from './lista-especialistas-turno.component';

describe('ListaEspecialistasTurnoComponent', () => {
  let component: ListaEspecialistasTurnoComponent;
  let fixture: ComponentFixture<ListaEspecialistasTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaEspecialistasTurnoComponent]
    });
    fixture = TestBed.createComponent(ListaEspecialistasTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
