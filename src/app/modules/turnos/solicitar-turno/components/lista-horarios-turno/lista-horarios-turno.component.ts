import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { HorarioService } from 'src/app/core/services/horario.service';
import { TurnoService } from 'src/app/core/services/turno.service';

@Component({
  selector: 'app-lista-horarios-turno',
  templateUrl: './lista-horarios-turno.component.html',
  styleUrls: ['./lista-horarios-turno.component.scss'],
})
export class ListaHorariosTurnoComponent implements OnChanges {
  @Input() especialistaSeleccionado: any;
  @Input() especialidadSeleccionada: any;
  @Output() fechaHoraSeleccionada: EventEmitter<{ fecha: Date; hora: Date }> =
    new EventEmitter<{ fecha: Date; hora: Date }>();
  fechas: Date[] = [];
  horas: Date[] = [];
  horarios: any;
  fecha!: Date;
  hora!: Date;
  selectedDay: Date | undefined;
  modulos!: number; // Initialize with a default value
  turnoData: any;

  get dias(): number {
    return 15;
  }

  constructor(
    private horarioService: HorarioService,
    private turno: TurnoService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      'especialistaSeleccionado' in changes ||
      'especialidadSeleccionada' in changes
    ) {
      // Handle changes in especialistaSeleccionado or especialidadSeleccionada
      this.updateHorarios();

      this.turno
        .getTurnosPorEspecialistaYEspecialidad(
          this.especialistaSeleccionado.email,
          this.especialidadSeleccionada
        )
        .subscribe((data) => {
          this.turnoData = data;

          console.log(this.turnoData);
        });
    }
  }

  ngOnInit(): void {
    // Initial load
    this.updateHorarios();

    this.turno
      .getTurnosPorEspecialistaYEspecialidad(
        this.especialistaSeleccionado.email,
        this.especialidadSeleccionada
      )
      .subscribe((data) => {
        this.turnoData = data;
      });
  }

  private updateHorarios(): void {
    if (this.especialistaSeleccionado && this.especialidadSeleccionada) {
      this.horarioService
        .getHorarioPorEspecialista(this.especialistaSeleccionado.email)
        .subscribe((data) => {
          if (data && data.length > 0) {
            this.horarios = data[0];

            // Clear existing dates and hours
            this.fechas = [];
            this.horas = [];

            // Populate fechas based on the updated horarios data
            this.populateFechas();

            // Update available hours
            this.updateAvailableHours();
          }
        });
    }
  }

  private populateFechas(): void {
    if (this.horarios && this.especialidadSeleccionada) {
      // Obtener los días disponibles para la especialidad seleccionada
      const diasDisponibles = this.horarios.horarios
        .filter(
          (horario: { dia: string; especialidad: string; turno: string }) =>
            horario.especialidad === this.especialidadSeleccionada
        )
        .map(
          (horario: { dia: string; especialidad: string; turno: string }) =>
            horario.dia
        );

      if (diasDisponibles) {
        for (let i = 1; i <= this.dias; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);

          const dayName = date.toLocaleDateString('es-AR', { weekday: 'long' });
          const capitalizedDayName =
            dayName.charAt(0).toUpperCase() + dayName.slice(1);

          // Mostrar la fecha solo si el día y la especialidad coinciden
          if (diasDisponibles.includes(capitalizedDayName)) {
            date.setHours(8);
            date.setMinutes(0);
            this.fechas.push(date);
          }
        }
      }
    }
  }

  seleccionarFecha(fecha: Date): void {
    this.selectedDay = fecha;
    this.updateAvailableHours();
    this.emitFechaHora();
  }
  updateAvailableHours(): void {
    this.horas = []; // Clear the existing hours

    if (this.selectedDay && this.horarios && this.turnoData) {
      const dayName = this.selectedDay.toLocaleDateString('es-AR', {
        weekday: 'long',
      });
      const capitalizedDayName =
        dayName.charAt(0).toUpperCase() + dayName.slice(1);

      const matchingHorario = this.horarios.horarios.find(
        (horario: any) => horario.dia === capitalizedDayName
      );

      if (matchingHorario) {
        // Calculate modulos based on the selected day's schedule
        this.calculateModulos(matchingHorario.turno);

        // Filter turnoData for the selected date
        const turnoDataForSelectedDay = this.turnoData.filter(
          (turno: any) =>
            turno.fecha.toDate().toDateString() ===
            this.selectedDay!.toDateString()
        );

        // Add the available hours based on the selected day's schedule
        const startHour =
          matchingHorario.turno === 'Mañana'
            ? 8
            : matchingHorario.turno === 'Tarde'
            ? 13
            : 8;
        const endHour =
          matchingHorario.turno === 'Mañana'
            ? 13
            : matchingHorario.turno === 'Tarde'
            ? 19 // Adjusted end time for "Tarde" to 19:00 pm
            : 19;

        for (let i = 0; i < this.modulos; i++) {
          const hora = new Date(this.selectedDay);
          hora.setHours(startHour + i / 2);
          if (i % 2) {
            hora.setMinutes(30);
          } else {
            hora.setMinutes(0);
          }

          // Check if the current hora is before or equal to the adjusted end time
          if (
            hora.getHours() < endHour ||
            (hora.getHours() === endHour && hora.getMinutes() === 0)
          ) {
            // Check if the hora is taken for any turno in turnoDataForSelectedDay
            const horaIsTaken = turnoDataForSelectedDay.some((turno: any) =>
              this.isFechaHoraTaken(turno.fecha.toDate(), hora)
            );

            // If the hora is not taken, add it to the available hours
            // if (!horaIsTaken) {
              this.horas.push(hora);
            // }
          }
        }
      }
    }
  }

  calculateModulos(turno: string): void {
    this.modulos = turno === 'Completo' ? 22 : turno === 'Mañana' ? 11 : 13;
  }

  seleccionarHora(hora: Date): void {
    this.hora = hora;
    this.emitFechaHora();
  }

  private emitFechaHora(): void {
    if (this.selectedDay && this.hora) {
      this.fechaHoraSeleccionada.emit({
        fecha: this.selectedDay,
        hora: this.hora,
      });
    }
  }

  isSelectedFecha(fecha: Date): boolean {
    // Check if this.selectedDay is defined
    if (this.selectedDay) {
      // Compare dates without considering time
      return (
        fecha &&
        this.selectedDay.getDate() === fecha.getDate() &&
        this.selectedDay.getMonth() === fecha.getMonth() &&
        this.selectedDay.getFullYear() === fecha.getFullYear()
      );
    }
    // If this.selectedDay is undefined, return false
    return false;
  }

  isSelectedHora(hora: Date): boolean {
    return (
      this.hora === hora &&
      this.selectedDay !== undefined &&
      !this.isFechaHoraTaken(this.selectedDay, hora)
    );
  }

  isFechaHoraTaken(selectedDay: Date, hora: Date): boolean {
    if (this.turnoData && this.turnoData.length > 0) {
      // Iterate through each turno in turnoData
      for (const turno of this.turnoData) {
        const fechaHora = turno.fecha.toDate();

        // Create a new Date object using the date and hora parameters
        const selectedFechaHora = new Date(
          selectedDay.getFullYear(),
          selectedDay.getMonth(),
          selectedDay.getDate(),
          hora.getHours(),
          hora.getMinutes()
        );

        // Compare date components
        const fechaHoraDate = new Date(
          fechaHora.getFullYear(),
          fechaHora.getMonth(),
          fechaHora.getDate()
        );

        const selectedFechaHoraDate = new Date(
          selectedFechaHora.getFullYear(),
          selectedFechaHora.getMonth(),
          selectedFechaHora.getDate()
        );

        // Compare time components
        const fechaHoraTime = fechaHora.getTime() - fechaHoraDate.getTime();
        const selectedFechaHoraTime =
          selectedFechaHora.getTime() - selectedFechaHoraDate.getTime();

        // Allow a small time difference (e.g., 1 minute) for precision issues
        const timeDifferenceThreshold = 60 * 1000; // 1 minute

        // Check if the selected date and time match any turno in turnoData
        if (
          selectedFechaHoraDate.getTime() === fechaHoraDate.getTime() &&
          Math.abs(selectedFechaHoraTime - fechaHoraTime) <
            timeDifferenceThreshold
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
