import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController,Platform } from 'ionic-angular';
import { EAuthProvider } from '../../providers/e-auth/e-auth';
import {HomePage} from '../home/home';
import {DashboardPage} from '../dashboard/dashboard';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'login',
  segment: ''
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  private login = { username: '', password: '' };
  private loading: Loading;
          responseData:any;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,  
  public auth: EAuthProvider,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public plt: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginAuthentication(event) {
    
    this.showLoading()
      this.auth.validateEAuth(this.login).then((result) => {
        this.responseData = result;
          if (this.responseData.success) {
            localStorage.setItem('userData', JSON.stringify(this.responseData.user));
             console.log(this.plt.is('core'))
             if(this.plt.is('core')){
               this.navCtrl.push('my-dashboard');
             }else{
                this.navCtrl.push(HomePage);
             }
            
          } else {
             this.showError(this.responseData.message);
          }
      }, (err) => {      
         this.showError(err.message);       
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
