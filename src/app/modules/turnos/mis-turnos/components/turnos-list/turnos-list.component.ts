import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { HistoriaClinicaService } from 'src/app/core/services/historia-clinica.service';

@Component({
  selector: 'app-turnos-list',
  templateUrl: './turnos-list.component.html',
  styleUrls: ['./turnos-list.component.scss'],
})
export class TurnosListComponent implements OnChanges {
  @Input() turnos: any;
  originalTurnos: any; // Store the original array of turnos
  usuarioLogeado: any; // Declare usuarioLogeado as an input property
  formBusqueda: FormGroup;
  terminoBusqueda: string = ''; // New variable to store the search term

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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.auth.getUserData().subscribe((data) => {
      this.usuarioLogeado = data;
      // console.log(this.usuarioLogeado);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['turnos'] && changes['turnos'].currentValue) {
      this.processTurnos(changes['turnos'].currentValue);
    }
  }

  private processTurnos(turnos: any): void {
    this.originalTurnos = [...turnos]; // Make a copy of the original array

    // ...

    // Sort the turnos array by fecha
    turnos.sort((a: any, b: any) => {
      const fechaA = a.fecha.seconds * 1000 + a.fecha.nanoseconds / 1e6;
      const fechaB = b.fecha.seconds * 1000 + b.fecha.nanoseconds / 1e6;
      return fechaA - fechaB;
    });

    // ...

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
        // Convert all values to lowercase for case-insensitive search
        const searchTerm = this.terminoBusqueda.toLowerCase();

        // Check if the search term is present in any column, including formatted date
        return (
          Object.values(t).some((value: any) => {
            if (typeof value === 'string' || typeof value === 'number') {
              // Convert both string and numeric values to lowercase for comparison
              return value.toString().toLowerCase().includes(searchTerm);
            } else if (typeof value === 'object' && value !== null) {
              // Check nested objects (e.g., pacienteDetalles, especialistaDetalles)
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
          this.searchWithinHistoriaClinica(t.historiaClinica, searchTerm) || // Call the simplified function here
          this.formatDateTime(t.fecha).toLowerCase().includes(searchTerm)
        );
      });
    } else {
      // Reset to the original array if the search term is empty
      this.turnos = [...this.originalTurnos];
    }
  }

  searchWithinHistoriaClinica(
    historiaClinica: any,
    searchTerm: string
  ): boolean {
    console.log(historiaClinica);

    if (!historiaClinica || typeof historiaClinica !== 'object') {
      return false;
    }

    // Check if the search term is present in any property of the historiaClinica object
    return Object.values(historiaClinica).some((nestedValue: any) => {
      if (
        nestedValue &&
        (typeof nestedValue === 'string' || typeof nestedValue === 'number')
      ) {
        return nestedValue.toString().toLowerCase().includes(searchTerm);
      } else if (nestedValue && typeof nestedValue === 'object') {
        // If the property is another object, recursively check it
        return this.searchWithinHistoriaClinica(nestedValue, searchTerm);
      } else {
        return false;
      }
    });
  }

  formatDateTime(timestamp: { seconds: number; nanoseconds: number }): string {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6
    );
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }
}
