// Your Angular Component (e.g., form-historia-clinica.component.ts)

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HistoriaClinicaService } from 'src/app/core/services/historia-clinica.service';
import { TurnoService } from 'src/app/core/services/turno.service';

@Component({
  selector: 'app-form-historia-clinica',
  templateUrl: './form-historia-clinica.component.html',
  styleUrls: ['./form-historia-clinica.component.css'],
})
export class FormHistoriaClinicaComponent implements OnInit {
  historiaClinicaForm!: FormGroup;
  @Input() turno: any;

  get altura() {
    return this.historiaClinicaForm.get('altura')!;
  }

  get peso() {
    return this.historiaClinicaForm.get('peso')!;
  }

  get temperatura() {
    return this.historiaClinicaForm.get('temperatura')!;
  }

  get presion() {
    return this.historiaClinicaForm.get('presion')!;
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FormHistoriaClinicaComponent>,
    private turnoService: TurnoService,
    private historiaService: HistoriaClinicaService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private initForm() {
    console.log(this.turno);

    this.historiaClinicaForm = this.formBuilder.group({
      altura: [null, [Validators.required, Validators.min(0)]],
      peso: [null, [Validators.required, Validators.min(0)]],
      temperatura: [null, [Validators.required, Validators.min(0)]],
      presion: [null, [Validators.required, Validators.min(0)]],
      clave1: [null],
      clave2: [null],
      clave3: [null],
      valor1: [null],
      valor2: [null],
      valor3: [null],
    });
  }

  onSubmit() {
    if (this.historiaClinicaForm.valid) {
      const formValues = this.historiaClinicaForm.value;

      const historiaClinica = {
        altura: formValues.altura,
        presion: formValues.presion,
        peso: formValues.peso,
        temperatura: formValues.temperatura,
        paciente: this.turno.paciente,
        especialista: this.turno.especialista,
        especialidad: this.turno.especialidad,
      };

      const adicionales = [];

      for (let i = 1; i <= 3; i++) {
        const clave = this.historiaClinicaForm.get(`clave${i}`)?.value;
        const valor = this.historiaClinicaForm.get(`valor${i}`)?.value;

        if (clave) {
          adicionales.push({ key: clave, value: valor });
        }
      }

      const historiaClinicaCompleta = {
        ...historiaClinica,
        adicionales: adicionales,
      };

      this.turno.historiaClinica = [historiaClinicaCompleta];
      this.turnoService.updateTurno(this.turno);
      this.historiaService.setHistoriaClinica(historiaClinicaCompleta);

      this.dialogRef.close();

    }
  }
}
