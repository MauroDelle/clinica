import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';

@NgModule({
  declarations: [
    BienvenidaComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
  ],


})
export class CoreModule { }
