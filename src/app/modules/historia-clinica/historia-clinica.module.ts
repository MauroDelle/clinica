import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriaClinicaComponent } from './components/historia-clinica/historia-clinica.component';
import { HistoriaClinicaTablaComponent } from './components/historia-clinica-tabla/historia-clinica-tabla.component';
import { HistoriaClinicaRoutingModule } from './historia-clinica-routing.module';
import { FormHistoriaClinicaComponent } from './components/form-historia-clinica/form-historia-clinica.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatearMedidasPipe } from 'src/app/core/pipes/formatear-medidas.pipe';

@NgModule({
  declarations: [HistoriaClinicaComponent, HistoriaClinicaTablaComponent, FormHistoriaClinicaComponent, FormatearMedidasPipe     ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [HistoriaClinicaRoutingModule, HistoriaClinicaComponent, HistoriaClinicaTablaComponent, FormHistoriaClinicaComponent],
})
export class HistoriaClinicaModule { }
