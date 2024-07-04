// registro-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoRegistroComponent } from './pages/tipo-registro/tipo-registro.component';

const routes: Routes = [
  {
    path: '', component: TipoRegistroComponent,
    // children: [
    //   {
    //     path: 'paciente',
    //     component: FormPacienteComponent
    //   },
    //   {
    //     path: 'especialista',
    //     component: FormEspecialistaComponent
    //   },
    //   {
    //     path: 'admin',
    //     component: FormAdminComponent
    //   }
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }

// Export the routes directly
