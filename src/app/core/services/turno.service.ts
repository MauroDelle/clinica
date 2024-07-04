import { Injectable } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { query, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private coleccion: any;

  constructor(private firestore: Firestore) {
    this.coleccion = collection(this.firestore, 'turnos');
  }

  getTurnos(): Observable<Array<any>> {
    return collectionData(this.coleccion, { idField: 'id' });
  }

  getTurnosPorPaciente(paciente: string): Observable<Array<any>> {
    const q = query(this.coleccion, where('paciente', '==', paciente));

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }

  getTurnosPorEspecialista(especialista: string): Observable<Array<any>> {
    const q = query(this.coleccion, where('especialista', '==', especialista));

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }

  getTurnosPorEspecialistaFinalizados(
    especialista: string
  ): Observable<Array<any>> {
    const q = query(
      this.coleccion,
      where('especialista', '==', especialista),
      where('estado', 'in', ['Finalizado'])
    );

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }

  // getTurnosPorEspecialistaYEspecialidad(especialista: string, especialidad: string): Observable<Array<any>> {
  //   const q = query(
  //     this.coleccion,
  //     where('especialista', '==', especialista),
  //     where('especialidad', '==', especialidad)
  //   );

  //   // Fetching data from Firestore using the created query and explicitly defining the type
  //   return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  // }

  getTurnosPorEspecialistaYEspecialidad(
    especialista: string,
    especialidad: string
  ): Observable<Array<any>> {
    const q = query(
      this.coleccion,
      where('especialista', '==', especialista),
      where('especialidad', '==', especialidad),
      where('estado', 'in', ['Solicitado', 'Aceptado', 'Finalizado'])
    );

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }

  setTurno(turno: any): Promise<DocumentReference<any>> {
    return addDoc(this.coleccion, { ...turno });
  }

  deleteTurno(id: string): Promise<void> {
    const documento = doc(this.coleccion, id);
    return deleteDoc(documento);
  }

  updateTurno(turno: any): Promise<void> {
    const documento = doc(this.coleccion, turno.id);
    return updateDoc(documento, {
      ...turno,
    });
  }

  async generarPDF(turnos: any): Promise<void> {
    try {
      const imgDataURL = await this.getImageDataURL('./assets/imgs/logo.png');

      const content: any[] = [
        {
          columns: [
            { image: imgDataURL, width: 70, margin: [0, 10, 10, 0] },
            {
              stack: [
                {
                  text: 'Atenciones realizadas',
                  style: 'header',
                  margin: [0, 10, 0, 20],
                },
                `Fecha de emisión: ${new Date().toLocaleDateString('es-AR', {
                  dateStyle: 'full',
                })}`,
              ],
            },
          ],
        },
      ];

      for (let turno of turnos) {
        let tabla = {
          margin: [0, 5, 0, 15],
          table: {
            body: [
              ['Paciente', turno.paciente || ''],
              ['Especialista', turno.especialista || ''],
              ['Especialidad', turno.especialidad || ''],
              ['Estado', turno.estado || ''],
              [
                'Fecha',
                new Date(turno.fecha.seconds * 1000).toLocaleDateString(
                  'es-AR',
                  {
                    dateStyle: 'full',
                  }
                ) || '',
              ],
            ],
          },
        };

        content.push(tabla);
      }

      const doc = { content: content };
      pdfMake.createPdf(doc).open();
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async getImageDataURL(imagePath: string): Promise<string> {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
}
