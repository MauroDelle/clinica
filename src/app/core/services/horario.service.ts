import { Injectable } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  query,
  where,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private coleccion: any;

  constructor(private firestore: Firestore) {
    this.coleccion = collection(this.firestore, 'horarios');
  }

  getHorarios(): Observable<Array<any>> {
    return collectionData(this.coleccion, { idField: 'id' });
  }

  getHorarioPorEspecialista(especialista: string): Observable<Array<any>> {
    const q = query(this.coleccion, where('especialista', '==', especialista));

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }

  setHorario(horario: any): Promise<DocumentReference<any>> {
    return addDoc(this.coleccion, { ...horario });
  }

  deleteHorario(id: string): Promise<void> {
    const documento = doc(this.coleccion, id);
    return deleteDoc(documento);
  }

  updateHorario(horario: any): Promise<void> {
    const documento = doc(this.coleccion, horario.id);
    return updateDoc(documento, {
      ...horario,
    });
  }


}
