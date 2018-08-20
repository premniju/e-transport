import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { AppVariables } from "../../config/app-variables";

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
  //public customerList: any = ['Manual', 'Large Operator', 'Medium Operator', 'Small Operator'];
  public operator: any = [];
  public formElements: any = [];
  public customerList: any = AppVariables.OPERATOR;
  public carrierlist: any = AppVariables.NCARRIERS;
  public config: any = null;
  public nCellsList: any = AppVariables.NCELLS;
  public qamList: any = AppVariables.QAM;
  public channelCapacityList: any = AppVariables.CHANNEL_CAPACITY;
  public mimoList: any = AppVariables.MIMO;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
        // pre-load operator configuration information.
        this.operator['A'] = AppVariables.OPERATOR_A;
        this.operator['B'] = AppVariables.OPERATOR_B;
        this.operator['C'] = AppVariables.OPERATOR_C;
    
        console.log(this.carrierlist);
  }

  /**
   * Logout
   */
  logout() {
    let nav = this.app.getRootNav();
    nav.setRoot(LoginPage);

  }
  /**
   * Load the pre configure information on customer change 
   */
  onCustomerChange1(operator: any) {
    console.log("asdasdas",operator);
    //this.reset();
    console.log("Am I here");
   // this.loadOperator1(operator);
    //this.getCbValue();

  }
  /**
 * load the operator default configuration
 */
  loadOperator1(operator) {
    console.log("asdasd");
    console.log(this.operator);
    //alert(this.config);
    this.operator[operator].forEach((item, index) => {
      let i = index + 1;
      this.formElements['nCells_' + i] = item.nCells;
      this.formElements['chCapacity_' + i] = item.chCapacity;
      this.formElements['qam_' + i] = item.qam;
      this.formElements['mimo_' + i] = item.mimo;
      this.formElements['mimoValue_' + i] = this.formElements['mimo_' + i];
      this.formElements['cprValue_' + i] = item.cpr;
      // this.onChange(item.mimo, 'mimo_', i);

    });
  }

  
}

