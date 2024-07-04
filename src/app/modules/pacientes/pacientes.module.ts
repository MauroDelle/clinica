import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PacientesRoutingModule } from './pacientes-routing.module';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { PacientesTurnoComponent } from './components/pacientes-turno/pacientes-turno.component';


@NgModule({
  declarations: [
    PacientesComponent,
    PacientesTurnoComponent
  ],
  imports: [
    CommonModule,
    PacientesRoutingModule
  ],
  providers: [DatePipe],

})
export class PacientesModule { }
