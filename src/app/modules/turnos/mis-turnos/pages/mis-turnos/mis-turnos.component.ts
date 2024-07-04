import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { TurnoService } from 'src/app/core/services/turno.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent {
  turnos: any;
  usuarioLogeado: any;

  constructor(private turnoService: TurnoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserData().subscribe(data => {
      if (data) {
        this.usuarioLogeado = data;
      }

      if (this.usuarioLogeado) {
        this.loadTurnosBasedOnRole();
      }
    });
  }

  private loadTurnosBasedOnRole(): void {
    switch (this.usuarioLogeado?.rol) {
      case 'paciente':
        this.loadTurnosByPaciente();
        break;
      case 'especialista':
        this.loadTurnosByEspecialista();
        break;
      default:
        this.loadAllTurnos();
        break;
    }
  }

  private loadTurnosByPaciente(): void {
    this.turnoService.getTurnosPorPaciente(this.usuarioLogeado?.email).subscribe(
      (turnos) => this.handleTurnosSuccess(turnos),
      (error) => this.handleTurnosError(error)
    );
  }

  private loadTurnosByEspecialista(): void {
    this.turnoService.getTurnosPorEspecialista(this.usuarioLogeado?.email).subscribe(
      (turnos) => this.handleTurnosSuccess(turnos),
      (error) => this.handleTurnosError(error)
    );
  }

  private loadAllTurnos(): void {
    this.turnoService.getTurnos().subscribe(
      (turnos) => this.handleTurnosSuccess(turnos),
      (error) => this.handleTurnosError(error)
    );
  }

  private handleTurnosSuccess(turnos: any): void {
    // console.log('Turnos: ', turnos);
    this.turnos = turnos;
  }

  private handleTurnosError(error: any): void {
    console.error('Error fetching documents: ', error);
  }

}
