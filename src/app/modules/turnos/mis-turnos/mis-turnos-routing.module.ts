import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';

const routes: Routes = [
  {
    path: '', component: MisTurnosComponent, data: { animation: 'isRight' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisTurnosRoutingModule { }
