import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule} from '@angular/http';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ChatPage } from '../pages/chat/chat';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NomePipe } from '../pages/chat/nomePipe';

import { ApiService } from '../providers/restapi-service/restapi-service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    RegisterPage,
    ChatPage,
    NomePipe
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    RegisterPage,
    ChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NomePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiService
  ]
})
export class AppModule {}
