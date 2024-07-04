// usuarios-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ListaEspecialistasComponent } from './components/lista-especialistas/lista-especialistas.component';
import { ListaPacientesComponent } from './components/lista-pacientes/lista-pacientes.component';
import { HistoriaClinicaComponent } from '../historia-clinica/components/historia-clinica/historia-clinica.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    data: { animation: 'isRight' }, // Add this line
    children: [
      {
        path: 'registro',
        loadChildren: () => import('../registro/registro.module').then(m => m.RegistroModule),
      },
      {
        path: 'especialistas',
        component: ListaEspecialistasComponent,
        data: { animation: 'isLeft' }, // Adjust as needed
      },
      {
        path: 'pacientes',
        component: ListaPacientesComponent,
        data: { animation: 'isRight' }, // Adjust as needed
        children: [
          {
            path: 'historia-clinica',
            component: HistoriaClinicaComponent,
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
