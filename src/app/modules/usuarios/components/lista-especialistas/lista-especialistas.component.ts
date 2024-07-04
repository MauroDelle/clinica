import { Component, OnDestroy } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import * as XLSX from 'xlsx';
import { TurnoService } from 'src/app/core/services/turno.service';
import Swal from 'sweetalert2';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-lista-especialistas',
  templateUrl: './lista-especialistas.component.html',
  styleUrls: ['./lista-especialistas.component.scss'],
})
export class ListaEspecialistasComponent implements OnDestroy {
  especialistas: any;
  turnos: any;
  private turnosSubscription!: Subscription;

  constructor(
    private firestore: FirestoreService,
    private turnoService: TurnoService
  ) {}

  ngOnInit(): void {
    this.firestore.getUsuariosPorRol('especialista').subscribe(
      (usuarios) => {
        console.log('Usuarios: ', usuarios);
        this.especialistas = usuarios;
      },
      (error) => {
        console.error('Error fetching documents: ', error);
      }
    );
  }

  actualizarVerificado(usuario: any) {
    usuario.verificado = usuario.verificado === 't' ? 'f' : 't';
    this.firestore.updateUsuario(usuario);
  }

  async getTurnosFiltradosPacientes(paciente: string) {
    try {
      const data = await this.turnoService
        .getTurnosPorEspecialista(paciente)
        .pipe(take(1))
        .toPromise();

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
        this.turnos = [];
      } else {
        Swal.fire({
          icon: 'error',
          title: 'El especialista no tiene turnos registrados!',
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
