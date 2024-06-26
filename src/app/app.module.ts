import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { CoreModule } from 'src/app/core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserModule } from '@angular/platform-browser';


const firebaseConfig = {
  apiKey: "AIzaSyB8ka1B0FtMuaew9FzOZ-89CB1QTlmNs9U",
  authDomain: "clinica-17fc5.firebaseapp.com",
  projectId: "clinica-17fc5",
  storageBucket: "clinica-17fc5.appspot.com",
  messagingSenderId: "208172909317",
  appId: "1:208172909317:web:67975b08b030097ddb6d6c"
};


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp({  apiKey: "AIzaSyB8ka1B0FtMuaew9FzOZ-89CB1QTlmNs9U",
      authDomain: "clinica-17fc5.firebaseapp.com",
      projectId: "clinica-17fc5",
      storageBucket: "clinica-17fc5.appspot.com",
      messagingSenderId: "208172909317",
      appId: "1:208172909317:web:67975b08b030097ddb6d6c"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

