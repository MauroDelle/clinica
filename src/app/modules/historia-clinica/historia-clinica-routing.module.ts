import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormHistoriaClinicaComponent } from './components/form-historia-clinica/form-historia-clinica.component';

const routes: Routes = [
  {
    path: '',
    component: FormHistoriaClinicaComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoriaClinicaRoutingModule {}

// Export the routes directly
