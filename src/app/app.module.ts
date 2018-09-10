import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
// import { LoginPage } from '../pages/login/login';
import { ChartPage } from '../pages/chart/chart';
import { AdvanceEditPage } from '../pages/advance-edit/advance-edit';
// import {DashboardPage} from '../pages/dashboard/dashboard';
import { EAuthProvider } from '../providers/e-auth/e-auth';
import { HttpClientModule } from '@angular/common/http';
import { EmailComposer } from '@ionic-native/email-composer';
import { EMailProvider } from '../providers/e-mail/e-mail';
import { EImageHandlerProvider } from '../providers/e-image-handler/e-image-handler';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { EDimmensionProvider } from '../providers/e-dimmension/e-dimmension';
import {SocialSharing} from '@ionic-native/social-sharing';
import { EPdfProvider } from '../providers/e-pdf/e-pdf';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    // LoginPage,
    ChartPage,
    //  DashboardPage,
    AdvanceEditPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    
    IonicModule.forRoot(MyApp,{
      preloadModules: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // LoginPage,
    HomePage,
    ChartPage,
    // DashboardPage,
    AdvanceEditPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmailComposer,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EAuthProvider,
    EMailProvider,
    EImageHandlerProvider,
    File,
    FileOpener,
    EDimmensionProvider,
    EPdfProvider
  ]
})
export class AppModule {}
