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
  providedIn: 'root',
})
export class FirestoreService {
  private coleccion: any;

  constructor(private firestore: Firestore) {
    this.coleccion = collection(this.firestore, 'usuarios');
  }


  save(data: any, path: string) {
    const col = collection(this.firestore, path);
    return addDoc(col, { ...data });
  }

  get(path: string) {
    const col = collection(this.firestore, path);
    const observable = collectionData(col);

    return observable;
  }

  getUsuarios(): Observable<Array<any>> {
    return collectionData(this.coleccion, { idField: 'id' });
  }

  getUsuariosAccesoRapido(): Observable<Array<any>> {
    // Creating a query with a where clause to filter by the 'test' field equal to 't'
    const q = query(this.coleccion, where('test', '==', 't'));

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }

  getUsuariosPorRol(rol: string): Observable<Array<any>> {
    const q = query(this.coleccion, where('rol', '==', rol));

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }

  getUsuarioPorEmail(email: string): Observable<Array<any>> {
    const q = query(this.coleccion, where('email', '==', email));

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }
  setUsuario(usuario: any): Promise<DocumentReference<any>> {
    return addDoc(this.coleccion, { ...usuario });
  }

  deleteUsuario(id: string): Promise<void> {
    const documento = doc(this.coleccion, id);
    return deleteDoc(documento);
  }

  updateUsuario(usuario: any): Promise<void> {
    const documento = doc(this.coleccion, usuario.id);
    return updateDoc(documento, {
      ...usuario,
    });
  }
}

