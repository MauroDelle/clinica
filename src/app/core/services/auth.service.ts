import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from './firestore.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators'; // Corrected import for operators
import { HorarioService } from './horario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: FirestoreService,
    private afStorage: AngularFireStorage,
    private horarioService: HorarioService
  ) {}

  async registerUser(
    email: string,
    password: string,
    userData: any,
    imgs: any
  ) {
    try {
      const userCredential: any =
        await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Include the UID in the data to be uploaded to Firestore
      userData.uid = user.uid;

      // Upload images and get download URLs
      const downloadUrls: string[] = await this.uploadImages(user.uid, imgs);

      // Add image URLs to userData
      if (imgs.imagen_a && downloadUrls[0]) {
        userData.imagen_a_url = downloadUrls[0];
      }

      if (imgs.imagen_b && downloadUrls[1]) {
        userData.imagen_b_url = downloadUrls[1];
      }

      // Convert observable values to their final form
      if (userData.imagen_a_url) {
        userData.imagen_a_url = await userData.imagen_a_url.toPromise();
      }

      if (userData.imagen_b_url) {
        userData.imagen_b_url = await userData.imagen_b_url.toPromise();
      }

      // Save userData to Firestore
      await this.afs.setUsuario(userData);

      if (userData.rol === 'especialista') {
        const horarios = [
          { dia: 'Lunes', especialidad: '', turno: 'Completo' },
          { dia: 'Martes', especialidad: '', turno: 'Completo' },
          { dia: 'Miércoles', especialidad: '', turno: 'Completo' },
          { dia: 'Jueves', especialidad: '', turno: 'Completo' },
          { dia: 'Viernes', especialidad: '', turno: 'Completo' },
          { dia: 'Sábado', especialidad: '', turno: 'Completo' },
        ];

        const especialista = userData.email;
        const horariosConEspecialista = { especialista, horarios };

        this.horarioService.setHorario(horariosConEspecialista);
      }

      // Send email verification and return the observable
      const sendEmailVerificationObservable = user.sendEmailVerification();

      // Logout after user registration
      this.logout();

      // Return the observable
      return sendEmailVerificationObservable;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async uploadImages(userId: string, imgs: any): Promise<string[]> {
    const downloadUrls: string[] = [];

    try {
      // Upload image A
      if (imgs.imagen_a) {
        const pathImgA = `userImgs/${userId}/${imgs.imagen_a}`;
        await this.afStorage.upload(pathImgA, imgs.imagen_a_file);
        const downloadUrlA = await this.afStorage
          .ref(pathImgA)
          .getDownloadURL();
        downloadUrls.push(downloadUrlA as unknown as string);
      }

      // Upload image B
      if (imgs.imagen_b) {
        const pathImgB = `userImgs/${userId}/${imgs.imagen_b}`;
        await this.afStorage.upload(pathImgB, imgs.imagen_b_file);
        const downloadUrlB = await this.afStorage
          .ref(pathImgB)
          .getDownloadURL();
        downloadUrls.push(downloadUrlB as unknown as string);
      }

      return downloadUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  login(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        return this.getUserData().pipe(
          switchMap((userData) => {
            // Check if the email is verified
            if (userData) {
              if (userData!['test'] == 'f') {
                if (!user?.emailVerified) {
                  throw Error('Debes verificar tu email para poder ingresar!!');
                }

                // Check the user's role and verification status
                if (
                  userData['rol'] === 'especialista' &&
                  userData['verificado'] === 'f'
                ) {
                  throw Error(
                    'El usuario no esta habilitado por un admin para ingresar!!'
                  );
                }
              }
            } else {
              throw Error(
                'Usuario no registrado'
              );
            }

            // For example, you can return a success message
            return 'Login successful';
          })
        );
      })
    );
  }

  getUserData() {
    return this.afAuth.user.pipe(
      switchMap((user) => {
        if (user) {
          // User is authenticated, so you can use their UID
          return this.afs.get('usuarios').pipe(
            map((collection) => {
              const userDoc = collection.find((doc) => doc['uid'] === user.uid);
              return userDoc;
            })
          );
        } else {
          // User is not authenticated
          return of(null);
        }
      })
    );
  }

  getLoggedUser() {
    return this.afAuth.authState;
  }

  logout() {
    return this.afAuth.signOut();
  }
}
