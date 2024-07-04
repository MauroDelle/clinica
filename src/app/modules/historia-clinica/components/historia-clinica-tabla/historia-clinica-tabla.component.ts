import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { HistoriaClinicaService } from 'src/app/core/services/historia-clinica.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-historia-clinica-tabla',
  templateUrl: './historia-clinica-tabla.component.html',
  styleUrls: ['./historia-clinica-tabla.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
    trigger('itemAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class HistoriaClinicaTablaComponent implements OnInit {
  usuarioLogeado: any;
  historiaClinica: any;
  currentHistoria: any;
  currentIndex = 0;

  constructor(
    private historiaService: HistoriaClinicaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserData().subscribe((data) => {
      this.usuarioLogeado = data;

      if (this.usuarioLogeado?.rol == 'especialista') {
        this.historiaService
          .getHistoriaPorEspecialista(this.usuarioLogeado.email)
          .subscribe((data) => {
            this.historiaClinica = data;
            this.currentHistoria = this.historiaClinica[0]; // Initialize with the first historia
          });

      } else {
        this.historiaService
          .getHistoriaPorPaciente(this.usuarioLogeado.email)
          .subscribe((data) => {
            this.historiaClinica = data;
            this.currentHistoria = this.historiaClinica[0]; // Initialize with the first historia
          });
      }
    });
  }

  prepareRoute(outlet: any) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  nextHistory() {
    if (this.currentIndex < this.historiaClinica.length - 1) {
      this.currentIndex++;
      this.currentHistoria = this.historiaClinica[this.currentIndex];
    }
  }

  prevHistory() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentHistoria = this.historiaClinica[this.currentIndex];
    }
  }

  descargar(historias: any) {
    this.historiaService.generarPDF(historias);
  }
}
