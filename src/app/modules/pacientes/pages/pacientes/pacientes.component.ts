import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { TurnoService } from 'src/app/core/services/turno.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss'],
})
export class PacientesComponent {
  usuarioLogeado: any;
  turnosSinPacientesRepetidos: any;
  pacienteSeleccionado: any;

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserData().subscribe((data) => {
      if (data) {
        this.usuarioLogeado = data;
      }

      if (this.usuarioLogeado) {
        this.loadTurnosByEspecialista();
      }
    });
  }

  private loadTurnosByEspecialista(): void {
    this.turnoService
      .getTurnosPorEspecialistaFinalizados(this.usuarioLogeado?.email)
      .subscribe(
        (turnos) => this.handleTurnosSuccess(turnos),
        (error) => this.handleTurnosError(error)
      );
  }

     // Function to check if the especialista is selected
     seleccionado(especialista: any): boolean {
      return this.pacienteSeleccionado === especialista;
    }

  private getUniquePatients(turnos: any[]): any[] {
    const uniquePatients: any[] = [];
    const uniqueIds: Set<number> = new Set();

    for (const turno of turnos) {
      const pacienteId = turno.pacienteDetalles.uid; // Replace 'id' with the actual property name

      if (!uniqueIds.has(pacienteId)) {
        uniqueIds.add(pacienteId);
        uniquePatients.push(turno);
      }
    }

    return uniquePatients;
  }

  private handleTurnosSuccess(turnos: any): void {
    this.turnosSinPacientesRepetidos = this.getUniquePatients(turnos);
    console.log(this.turnosSinPacientesRepetidos);
  }

  private handleTurnosError(error: any): void {
    console.error('Error fetching documents: ', error);
  }

 seleccionar(turno: any) {
  this.pacienteSeleccionado = turno.pacienteDetalles.email;
  console.log( this.pacienteSeleccionado );
 }
}
