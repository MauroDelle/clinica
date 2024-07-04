import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { HorarioService } from 'src/app/core/services/horario.service';
import { HistoriaClinicaService } from 'src/app/core/services/historia-clinica.service';
import { TurnoService } from 'src/app/core/services/turno.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
})
export class MiPerfilComponent {
  usuarioLogeado: any;
  horarios: any;
  historiaClinica: any;
  assignedEspecialidades: { [day: string]: string } = {};
  turnosFinalizados: any;

  constructor(
    private authService: AuthService,
    private horarioService: HorarioService,
    private turnoService: TurnoService
  ) {}

  ngOnInit() {
    this.authService.getUserData().subscribe((data) => {
      if (data) {
        this.usuarioLogeado = data;

        if (this.usuarioLogeado.rol == 'especialista') {
          this.horarioService
            .getHorarioPorEspecialista(this.usuarioLogeado.email)
            .subscribe((data) => {
              if (data && data.length > 0) {
                this.horarios = data[0];
                this.initializeAssignedEspecialidades();
                console.log(this.horarios);
              }
            });

          this.turnoService
            .getTurnosPorEspecialistaFinalizados(this.usuarioLogeado.email)
            .subscribe((data) => {
              this.turnosFinalizados = data;
              console.log(this.turnosFinalizados);
            });
        }
      }
    });
  }

  initializeAssignedEspecialidades() {
    if (this.horarios && this.horarios.horarios) {
      this.horarios.horarios.forEach((entry: any) => {
        this.assignedEspecialidades[entry.dia] = entry.especialidad;
      });
    }
  }

  updateTurno(entry: any): void {
    // Update the database with the modified entry
    this.horarioService
      .updateHorario(this.horarios)
      .then(() => {
        console.log('Turno updated successfully in the database');
      })
      .catch((error) => {
        console.error('Error updating turno in the database:', error);
      });
  }

  getEspecialidad(day: string): string {
    const scheduleEntry = this.horarios?.horarios.find(
      (entry: { dia: string }) => entry.dia === day
    );

    if (scheduleEntry) {
      const especialidades = this.usuarioLogeado?.especialidad || [];
      const currentEspecialidad = scheduleEntry.especialidad;

      const currentIndex = especialidades.indexOf(currentEspecialidad);

      if (currentIndex === -1 || currentIndex === especialidades.length - 1) {
        scheduleEntry.especialidad =
          especialidades.length > 0 ? especialidades[0] : '';
      } else {
        scheduleEntry.especialidad = especialidades[currentIndex + 1];
      }

      this.assignedEspecialidades[day] = scheduleEntry.especialidad;

      // Call the method to update the database
      this.updateEspecialidadInDatabase(day, scheduleEntry.especialidad);
    }
    console.log(scheduleEntry);

    return scheduleEntry?.especialidad || '';
  }

  // New method to update the assigned especialidad in the database
  updateEspecialidadInDatabase(day: string, especialidad: string): void {
    const updatedScheduleEntry = { ...this.horarios };
    const scheduleEntryIndex = updatedScheduleEntry.horarios.findIndex(
      (entry: { dia: string }) => entry.dia === day
    );

    if (scheduleEntryIndex !== -1) {
      updatedScheduleEntry.horarios[scheduleEntryIndex].especialidad =
        especialidad;

      // Call the updateHorario method in the HorarioService
      this.horarioService
        .updateHorario(updatedScheduleEntry)
        .then(() => {
          console.log('Especialidad updated successfully in the database');
        })
        .catch((error) => {
          console.error('Error updating especialidad in the database:', error);
        });
    }
  }

  descargar() {
    this.turnoService.generarPDF(this.turnosFinalizados);
  }
}
