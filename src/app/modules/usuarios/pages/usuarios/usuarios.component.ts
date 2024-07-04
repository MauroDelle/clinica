import { Component, OnDestroy } from '@angular/core';
import { slider } from '../../../../core/animations/animations';
import { RouterOutlet } from '@angular/router';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  animations: [slider],
})
export class UsuariosComponent implements OnDestroy {
  usuarios: any;
  private usuariosSubscription: Subscription;

  constructor(private firestore: FirestoreService) {
    this.usuariosSubscription = new Subscription();
  }
  getRouterOutletState(outlet: RouterOutlet) {
    const routeData = outlet && outlet.activatedRouteData;
    if (routeData && routeData['animation']) {
      return routeData['animation'];
    }
  }

  ngOnInit(): void {
    this.usuariosSubscription = this.firestore.getUsuarios().subscribe((data) => {
      if (data && data.length > 0) {
        const columnsToInclude = [
          'nombre',
          'apellido',
          'email',
          'dni',
          'edad',
          'rol',
          'obra_social',
        ];

        this.usuarios = data.map((usuario: any) => {
          const filteredUsuario: any = {};

          columnsToInclude.forEach((column) => {
            filteredUsuario[column] = usuario[column];
          });

          if (
            usuario['especialidad'] &&
            Array.isArray(usuario['especialidad'])
          ) {
            filteredUsuario['especialidad'] =
              usuario['especialidad'].join(', ');
          } else {
            filteredUsuario['especialidad'] = '';
          }

          return filteredUsuario;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.usuariosSubscription) {
      this.usuariosSubscription.unsubscribe();
    }
  }

  descargarExcelUsuarios() {
    if (this.usuarios && this.usuarios.length > 0) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.usuarios);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'usuarios.xlsx');

      // Clear usuarios array after download
      this.usuarios = [];
    }
  }
}
