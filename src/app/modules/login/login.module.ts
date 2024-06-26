import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { FormLoginComponent } from './pages/form-login/form-login.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormLoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
