import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { MatDialog } from '@angular/material/dialog';
import { HistoriaClinicaComponent } from 'src/app/modules/historia-clinica/components/historia-clinica/historia-clinica.component';
import * as XLSX from 'xlsx';
import { TurnoService } from 'src/app/core/services/turno.service';
import Swal from 'sweetalert2';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-lista-pacientes',
  templateUrl: './lista-pacientes.component.html',
  styleUrls: ['./lista-pacientes.component.scss'],
})
export class ListaPacientesComponent {
  pacientes: any;
  isWide: boolean = false;
  turnosGeneral: any;
  turnos: any;
  private turnosSubscription!: Subscription;

  constructor(
    private firestore: FirestoreService,
    private turnoService: TurnoService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.firestore.getUsuariosPorRol('paciente').subscribe(
      (usuarios) => {
        console.log('Usuarios: ', usuarios);
        this.pacientes = usuarios;
      },
      (error) => {
        console.error('Error fetching documents: ', error);
      }
    );
  }

  toggleNormalAnimation() {
    this.isWide = !this.isWide;
  }

  openHistoriaClinicaDialog(usuario: any): void {
    const dialogRef = this.dialog.open(HistoriaClinicaComponent, {
      data: { usuarioLogeado: usuario },
      position: { right: '50%', left: '50%' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  async getTurnosFiltradosPacientes(paciente: string) {
    try {
      const data = await this.turnoService.getTurnosPorPaciente(paciente).pipe(take(1)).toPromise();

      const columnsToInclude = [
        'especialista',
        'paciente',
        'especialidad',
        'fecha',
        'estado',
      ];

      return data?.map((turno: any) => {
        const turnosFiltrados: any = {};

        columnsToInclude.forEach((column) => {
          if (column === 'fecha' && turno[column]) {
            const timestamp = turno[column];
            const fecha = new Date(
              timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
            );
            turnosFiltrados[column] = fecha.toLocaleString('es-AR', {
              timeZone: 'UTC',
            });
          } else {
            turnosFiltrados[column] = turno[column];
          }
        });

        return turnosFiltrados;
      });
    } catch (error) {
      console.error('Error fetching turnos: ', error);
      throw error; // Propagate the error
    }
  }

  async descargarExcelTurnos(paciente: string) {
    try {
      const turnos = await this.getTurnosFiltradosPacientes(paciente);
      if (turnos!.length > 0) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(turnos!);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'turnos.xlsx');
      }
      else {
        Swal.fire({
          icon: "error",
          title: "El paciente no tiene turnos registrados!",
        });
      }

    } catch (error) {
      console.error('Error downloading Excel: ', error);
      // Handle the error as needed
    }
  }

  ngOnDestroy(): void {
    if (this.turnosSubscription) {
      this.turnosSubscription.unsubscribe();
    }
  }
}
