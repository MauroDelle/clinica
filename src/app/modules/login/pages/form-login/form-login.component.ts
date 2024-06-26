import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent implements OnDestroy {
  formLogin: FormGroup;
  usuariosAccesoRapido: any;
  private ngUnsubscribe = new Subject<void>();

  get email() {
    return this.formLogin.get('email')!;
  }

  get password() {
    return this.formLogin.get('password')!;
  }

  constructor(private authService: AuthService, private firestore: FirestoreService, private router: Router,  private spinner: NgxSpinnerService) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.firestore.getUsuariosAccesoRapido().subscribe(
      (usuarios) => {
        // Handle success, you have the array of usuarios
        console.log('Usuarios: ', usuarios);
        this.usuariosAccesoRapido = usuarios;
      },
      (error) => {
        // Handle error
        console.error('Error fetching documents: ', error);
      }
    );
      }

  setDatosDeLogin(user: any) {
    this.email.setValue(user.email);
    this.password.setValue(123321);
    this.formLogin.updateValueAndValidity();
  }

  onSubmit(): void {
    this.spinner.show();
    if (this.formLogin.valid) {
      this.authService.login(this.email.value, this.password.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.spinner.hide();
          Swal.fire('Bienvenido!');
          this.router.navigateByUrl('home');
        },
        (error) => {
          this.spinner.hide();
          console.error('Login failed:', error);
          if (error.message === 'Email is not verified') {
            Swal.fire('Debe verificar su correo electronico para iniciar sesion!');
          }
          else if (error.message === 'Usuario no habilitado') {
            Swal.fire('Su usuario no esta hablitado por un admin para ingresar!');
          }
          else if (error.message === 'Usuario no registrado') {
            Swal.fire('Su usuario no esta hablitado por un admin para ingresar!');
          }
          else {
            Swal.fire(error.message);
          }
        }
      );
    }
  }
}
