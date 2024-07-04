import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';

@Component({
  selector: 'app-lista-especialistas-turno',
  templateUrl: './lista-especialistas-turno.component.html',
  styleUrls: ['./lista-especialistas-turno.component.scss']
})
export class ListaEspecialistasTurnoComponent {
  @Output() especialistaSeleccionado: EventEmitter<any> = new EventEmitter<any>();
  especialistas: any;
  especialista: any;

  constructor(private firestore: FirestoreService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.firestore.getUsuariosPorRol('especialista').subscribe(
      (usuarios) => {
        // Handle success, you have the array of usuarios
        console.log('Usuarios: ', usuarios);
        this.especialistas = usuarios;
      },
      (error) => {
        // Handle error
        console.error('Error fetching documents: ', error);
      }
    );
  }

  seleccionarEspecialista(especialista: any): void {
    this.especialista = especialista;
    this.especialistaSeleccionado.emit(especialista);
    console.log(this.especialista);
  }

   // Function to check if the especialista is selected
   seleccionado(especialista: any): boolean {
    return this.especialista === especialista;
  }

}
