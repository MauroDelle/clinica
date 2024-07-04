import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';

@Component({
  selector: 'app-lista-pacientes',
  templateUrl: './lista-pacientes.component.html',
  styleUrls: ['./lista-pacientes.component.scss']
})
export class ListaPacientesComponent {
  @Output() pacienteSeleccionado: EventEmitter<any> = new EventEmitter<any>();
  pacientes: any;
  paciente: any;

  constructor(private firestore: FirestoreService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.firestore.getUsuariosPorRol('paciente').subscribe(
      (usuarios) => {
        // Handle success, you have the array of usuarios
        console.log('Usuarios: ', usuarios);
        this.pacientes = usuarios;
      },
      (error) => {
        // Handle error
        console.error('Error fetching documents: ', error);
      }
    );
  }

  seleccionarPaciente(paciente: any): void {
    this.paciente = paciente;
    this.pacienteSeleccionado.emit(paciente);
    console.log(this.paciente);
  }

   // Function to check if the paciente is selected
   seleccionado(paciente: any): boolean {
    return this.paciente === paciente;
  }
}
