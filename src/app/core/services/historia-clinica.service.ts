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
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoriaClinicaService {
  private coleccion: any;

  constructor(private firestore: Firestore) {
    this.coleccion = collection(this.firestore, 'historia-clinica');
  }

  getHistoriasClinicas(): Observable<Array<any>> {
    return collectionData(this.coleccion, { idField: 'id' });
  }

  getHistoriaPorPaciente(paciente: string): Observable<Array<any>> {
    const q = query(this.coleccion, where('paciente', '==', paciente));

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }

  getHistoriaPorEspecialista(especialista: string): Observable<Array<any>> {
    const q = query(this.coleccion, where('especialista', '==', especialista));

    // Fetching data from Firestore using the created query and explicitly defining the type
    return collectionData<any>(q, { idField: 'id' }) as Observable<Array<any>>;
  }

  setHistoriaClinica(historia: any): Promise<DocumentReference<any>> {
    return addDoc(this.coleccion, { ...historia });
  }

  deleteHistoriaClinica(id: string): Promise<void> {
    const documento = doc(this.coleccion, id);
    return deleteDoc(documento);
  }

  updateHistoriaClinica(historia: any): Promise<void> {
    const documento = doc(this.coleccion, historia.id);
    return updateDoc(documento, {
      ...historia,
    });
  }

  async generarPDF(historias: any): Promise<void> {
    try {
      const imgDataURL = await this.getImageDataURL('./assets/imgs/logo.png');

      const content: any[] = [
        {
          columns: [
            { image: imgDataURL, width: 70, margin: [0, 10, 10, 0] },
            {
              stack: [
                {
                  text: 'Historia Clínica',
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

      for (let historia of historias) {
        let tabla = {
          margin: [0, 5, 0, 15],
          table: {
            body: [
              ['Paciente', historia.paciente || ''],
              ['Especialista', historia.especialista || ''],
              ['Especialidad', historia.especialidad || ''],
              ['Altura', historia.altura || ''],
              ['Peso', historia.peso || ''],
              ['Temperatura', historia.temperatura || ''],
              ['Presión', historia.presion || ''],
            ],
          },
        };

       // Add 'adicionales' to the body of the table
       if (historia.adicionales && historia.adicionales.length > 0) {
        for (let adicional of historia.adicionales) {
          // Capitalize the first letter of adicional.key
          const capitalizedKey = adicional.key.charAt(0).toUpperCase() + adicional.key.slice(1);
          tabla.table.body.push([capitalizedKey, adicional.value]);
        }
      }

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
