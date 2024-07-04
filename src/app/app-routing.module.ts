import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './core/pages/bienvenida/bienvenida.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bienvenida',
    pathMatch: 'full',
  },
  {
    path: 'bienvenida',
    component: BienvenidaComponent,
    data: { animation: 'isRight' },
  },
  {
    path: 'registro',
    loadChildren: () => import('./modules/registro/registro.module').then(m => m.RegistroModule),
  },
  {
    path: 'usuarios/registro',
    loadChildren: () => import('./modules/registro/registro.module').then(m => m.RegistroModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule),
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./modules/mi-perfil/mi-perfil.module').then(m => m.MiPerfilModule),
  },
  {
    path: 'solicitar-turno',
    loadChildren: () => import('./modules/turnos/solicitar-turno/solicitar-turno.module').then(m => m.SolicitarTurnoModule),
  },
  {
    path: 'mis-turnos',
    loadChildren: () => import('./modules/turnos/mis-turnos/mis-turnos.module').then(m => m.MisTurnosModule),
  },
  {
    path: 'pacientes',
    loadChildren: () => import('./modules/pacientes/pacientes.module').then(m => m.PacientesModule),
  },
  {
    path: 'historia-clinica',
    loadChildren: () => import('./modules/historia-clinica/historia-clinica.module').then(m => m.HistoriaClinicaModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
