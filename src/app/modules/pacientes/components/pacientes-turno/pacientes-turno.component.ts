import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TurnoService } from 'src/app/core/services/turno.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes-turno',
  templateUrl: './pacientes-turno.component.html',
  styleUrls: ['./pacientes-turno.component.scss'],
})
export class PacientesTurnoComponent implements OnChanges {
  turnos: any;
  @Input() paciente: any;

  constructor(private turnoService: TurnoService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadTurnos();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Check if the 'paciente' input has changed
    if (changes['paciente'] && !changes['paciente'].firstChange) {
      this.loadTurnos();
    }
  }

  private loadTurnos(): void {
    if (this.paciente) {
      this.turnoService
        .getTurnosPorPaciente(this.paciente)
        .subscribe((data) => {
          this.turnos = data;
        });
    }
  }

  formatDateTime(timestamp: { seconds: number; nanoseconds: number }): string {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6
    );
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }


  mostrarResenia(atencion: string) {
    Swal.fire(atencion);
  }

}
