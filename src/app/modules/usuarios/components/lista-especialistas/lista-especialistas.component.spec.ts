import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEspecialistasComponent } from './lista-especialistas.component';

describe('ListaEspecialistasComponent', () => {
  let component: ListaEspecialistasComponent;
  let fixture: ComponentFixture<ListaEspecialistasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaEspecialistasComponent]
    });
    fixture = TestBed.createComponent(ListaEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
