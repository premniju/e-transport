import { Component } from '@angular/core';
import { IonicPage,App, NavController, NavParams } from 'ionic-angular';
import {LoginPage} from '../login/login';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  public customerList: any = ['Manual', 'Large Operator', 'Medium Operator', 'Small Operator'];
  constructor(public navCtrl: NavController, public navParams: NavParams,public app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

  /**
   * Logout
   */
  logout() {
    let nav = this.app.getRootNav();
    nav.setRoot(LoginPage);

  }

}
