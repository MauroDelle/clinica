import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RegistroRoutingModule } from './registro-routing.module';
import { TipoRegistroComponent } from './pages/tipo-registro/tipo-registro.component';

import { FormRegistroComponent } from './components/form-registro/form-registro.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SoloNumerosDirective } from 'src/app/core/directives/solo-numeros.directive';
import { SoloLetrasDirective } from 'src/app/core/directives/solo-letras.directive';


@NgModule({
  declarations: [
    TipoRegistroComponent,
    FormRegistroComponent,
    SoloNumerosDirective,
    SoloLetrasDirective
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    ReactiveFormsModule,
    NgxCaptchaModule
  ]
})
export class RegistroModule { }
