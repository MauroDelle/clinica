import { Component, Input } from '@angular/core';
import { TurnoService } from '../../../../../core/services/turno.service';
import Swal from 'sweetalert2';
import { HistoriaClinicaService } from 'src/app/core/services/historia-clinica.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormHistoriaClinicaComponent } from '../../../../historia-clinica/components/form-historia-clinica/form-historia-clinica.component';

@Component({
  selector: 'app-acciones-turno',
  templateUrl: './acciones-turno.component.html',
  styleUrls: ['./acciones-turno.component.scss'],
})
export class AccionesTurnoComponent {
  @Input() turno: any;
  @Input() usuarioLogeado: any;

  altura: number = 0;
  peso: number = 0;
  temperatura: number = 0;
  presion: number = 0;
  clave: string = '';
  valor: number = 0;
  turnoCopia: any;
  datos: any[] = [];
  showHistoriaClinicaForm: boolean = false;

  constructor(
    private turnoService: TurnoService,
    private historiaService: HistoriaClinicaService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.turnoCopia = this.turno;
  }

  agregarDato() {
    this.datos.push({ clave: '', valor: 0 });
  }

  openHistoriaClinicaModal() {
    const dialogConfig = new MatDialogConfig();
    // Allow closing on navigation (e.g., clicking outside the modal)
    dialogConfig.closeOnNavigation = true;

    // Allow closing on navigation (e.g., clicking outside the modal)
    dialogConfig.closeOnNavigation = true;

    const dialogRef = this.dialog.open(
      FormHistoriaClinicaComponent,
      dialogConfig
    );

    dialogRef.componentInstance.turno = this.turnoCopia; // Pass the turno object to the modal component


    dialogRef.afterClosed().subscribe((result) => {
      // Handle modal close if needed
    });
  }
  // Modify the cambiarEstadoTurno method to handle 'Finalizado' state
  cambiarEstadoTurno(estado: string): void {
    let titulo = '';

    if (estado != 'Aceptado') {
      if (estado == 'Finalizado') {
        titulo = 'Cual fue el diagnostico del paciente?';
      } else if (estado == 'Cancelado') {
        titulo = 'Porque que cancela su turno?';
      } else if (estado == 'Rechazado') {
        titulo = 'Porque que rechaza su turno?';
      }
      Swal.fire({
        title: titulo,
        text: 'Escriba abajo:',
        input: 'text',
        showCancelButton: true,
      }).then((result) => {
        if (result.value) {
          this.turnoCopia.resenia = result.value;
          this.turnoCopia.estado = estado;
          this.turnoService.updateTurno(this.turnoCopia);
        }
      });
    } else {
      this.turnoCopia.estado = estado;
      this.turnoService.updateTurno(this.turnoCopia);
    }
  }

  verAtencion() {
    if (this.turno.atencion) {
      Swal.fire(this.turno.atencion);
    }
  }

  verDiagnostico() {
    if (this.turno.resenia) {
      Swal.fire(this.turno.resenia);
    }
  }

  calificarAtencion() {
    Swal.fire({
      title: 'Califique la atencion',
      text: 'Escriba abajo:',
      input: 'text',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.turnoCopia.atencion = result.value;
        this.turnoService.updateTurno(this.turnoCopia);
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
