import { Component, Inject, Input } from '@angular/core';
import { HistoriaClinicaService } from 'src/app/core/services/historia-clinica.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss'],
})
export class HistoriaClinicaComponent {
  @Input() usuarioLogeado: any;
  historiaClinica: any;
  currentHistoria: any;
  currentIndex = 0;

  constructor(
    private historiaService: HistoriaClinicaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HistoriaClinicaComponent>
  ) {
    this.usuarioLogeado = data.usuarioLogeado;
  }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.historiaService
      .getHistoriaPorPaciente(this.usuarioLogeado.email)
      .subscribe((data) => {
        this.historiaClinica = data;
        this.currentHistoria = this.historiaClinica[0]; // Initialize with the first historia
      });
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

  // Function to close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }
}
