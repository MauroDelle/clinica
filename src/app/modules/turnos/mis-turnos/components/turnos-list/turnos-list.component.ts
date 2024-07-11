import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-turnos-list',
  templateUrl: './turnos-list.component.html',
  styleUrls: ['./turnos-list.component.scss'],
})
export class TurnosListComponent implements OnChanges {
  @Input() turnos: any;
  originalTurnos: any;
  usuarioLogeado: any;
  formBusqueda: FormGroup;
  terminoBusqueda: string = '';

  constructor(
    private datePipe: DatePipe,
    private firestore: FirestoreService,
    private auth: AuthService
  ) {
    this.formBusqueda = new FormGroup({
      busqueda: new FormControl(null),
      criterio: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.auth.getUserData().subscribe((data) => {
      this.usuarioLogeado = data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['turnos'] && changes['turnos'].currentValue) {
      this.processTurnos(changes['turnos'].currentValue);
    }
  }

  private processTurnos(turnos: any): void {
    this.originalTurnos = [...turnos];

    turnos.sort((a: any, b: any) => {
      const fechaA = a.fecha.seconds * 1000 + a.fecha.nanoseconds / 1e6;
      const fechaB = b.fecha.seconds * 1000 + b.fecha.nanoseconds / 1e6;
      return fechaA - fechaB;
    });

    turnos.forEach((turno: any) => {
      const pacienteEmail = turno.paciente;
      const especialistaEmail = turno.especialista;

      this.firestore
        .getUsuarioPorEmail(pacienteEmail)
        .pipe(take(1))
        .subscribe((paciente) => {
          turno.pacienteDetalles = paciente[0];
        });

      this.firestore
        .getUsuarioPorEmail(especialistaEmail)
        .pipe(take(1))
        .subscribe((especialista) => {
          turno.especialistaDetalles = especialista[0];
        });
    });
  }

  get busqueda() {
    return this.formBusqueda.get('busqueda');
  }
  get criterio() {
    return this.formBusqueda.get('criterio');
  }

  buscar() {
    if (this.terminoBusqueda) {
      this.turnos = this.originalTurnos?.filter((t: any) => {
        const searchTerm = this.terminoBusqueda.toLowerCase();
        return (
          Object.values(t).some((value: any) => {
            if (typeof value === 'string' || typeof value === 'number') {
              return value.toString().toLowerCase().includes(searchTerm);
            } else if (typeof value === 'object' && value !== null) {
              return Object.values(value).some(
                (nestedValue: any) =>
                  (typeof nestedValue === 'string' ||
                    typeof nestedValue === 'number') &&
                  nestedValue.toString().toLowerCase().includes(searchTerm)
              );
            } else {
              return false;
            }
          }) ||
          this.searchWithinHistoriaClinica(t.historiaClinica, searchTerm) ||
          this.formatDateTime(t.fecha).toLowerCase().includes(searchTerm)
        );
      });
    } else {
      this.turnos = [...this.originalTurnos];
    }
  }

  searchWithinHistoriaClinica(historiaClinica: any, searchTerm: string): boolean {
    if (!historiaClinica || typeof historiaClinica !== 'object') {
      return false;
    }

    return Object.values(historiaClinica).some((nestedValue: any) => {
      if (
        nestedValue &&
        (typeof nestedValue === 'string' || typeof nestedValue === 'number')
      ) {
        return nestedValue.toString().toLowerCase().includes(searchTerm);
      } else if (nestedValue && typeof nestedValue === 'object') {
        return this.searchWithinHistoriaClinica(nestedValue, searchTerm);
      } else {
        return false;
      }
    });
  }

  formatDateTime(timestamp: { seconds: number; nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
