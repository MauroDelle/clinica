import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';

const routes: Routes = [
  {
    path: '', component: MiPerfilComponent, data: { animation: 'isRight' }, // Add this line

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiPerfilRoutingModule { }
