import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ListaPacientesComponent } from './components/lista-pacientes/lista-pacientes.component';
import { ListaEspecialistasComponent } from './components/lista-especialistas/lista-especialistas.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HistoriaClinicaModule } from '../historia-clinica/historia-clinica.module';


@NgModule({
  declarations: [
    UsuariosComponent,
    ListaPacientesComponent,
    ListaEspecialistasComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    HistoriaClinicaModule,
    MatDialogModule,
  ]
})
export class UsuariosModule { }
