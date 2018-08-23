import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams,AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { AppVariables,AppVariables_Tech } from "../../config/app-variables";
import { EDimmensionProvider } from "../../providers/e-dimmension/e-dimmension";

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
  public config: any = 'A';
  public nCellsList: any = AppVariables.NCELLS;
  public qamList: any = AppVariables.QAM;
  public channelCapacityList: any = AppVariables.CHANNEL_CAPACITY;
  public mimoList: any = AppVariables.MIMO;
  public baseline:any=[];
  public carrier:Number=0;
  public selectedCarrierList:any=[];
  public cb:Number;
  public technology:any=[];
  public technologyList:any=AppVariables_Tech.TECHNOLOGY_LIST;
  public selectedTechnologies:any=[];
  public techCb:Number;
  
  
  

  constructor(public navCtrl: NavController,
   public navParams: NavParams, 
   public app: App,
   private _eDim: EDimmensionProvider,
   private altCtrl: AlertController) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
        // pre-load operator configuration information.
        this.operator['A'] = AppVariables.OPERATOR_A;
        this.operator['B'] = AppVariables.OPERATOR_B;
        this.operator['C'] = AppVariables.OPERATOR_C;
        this.operator['M'] =[];
    
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
  onOperatorChange(operator: any) {
    console.log("asdasdas",operator);
    //this.reset();
    console.log("Am I here");
    operator = (operator)?operator:'A';
   this.populateOperatorInfo(operator);
    this.getCbValue();

  }
  /**
 * load the operator default configuration
 */
  populateOperatorInfo(operator) {
    
   this.carrier = this.operator[operator].length;
   this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    this.baseline =[];
    this.operator[operator].forEach((item, index) => {
      let i = index + 1;
      this.baseline['nCells_' + i] = item.nCells;
      this.baseline['chCapacity_' + i] = item.chCapacity;
      this.baseline['qam_' + i] = item.qam;
      this.baseline['mimo_' + i] = item.mimo;
      this.baseline['mimoValue_' + i] = this.baseline['mimo_' + i];
      this.baseline['cprValue_' + i] = item.cpr;
      this.onBaselineChange(item.mimo, 'mimo_', i);     

    });
    console.log(this.baseline)
  }
  addRow(section:any,technology:any){
    if(section == 'Baseline'){

      if(AppVariables.CARRIER_LIMIT > this.carrier){
    this.carrier = +this.carrier+1;
    this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    }else{

      this.altCtrl.create({
          title: 'Alert',
          subTitle: "Maximum carrier is exceed!!",
          buttons: ['OK']
        }).present();

    }

    }else{

      let tech = this.selectedTechnologies.filter(function(el) {
     return el.name == technology;
  });
  let carrier = tech[0].carrier;
 
    if(AppVariables.CARRIER_LIMIT > carrier){
    carrier = +tech[0].carrier+1;  
    this.selectedTechnologies.filter(function(el) {
     return el.name == technology;
  })[0].carrier = carrier;

  this.selectedTechnologies.filter(function(el) {
     return el.name == technology;
  })[0].carrierList = this.carrierlist.slice(0, carrier);
    }else{

      this.altCtrl.create({
          title: 'Alert',
          subTitle: "Maximum carrier is exceed!!",
          buttons: ['OK']
        }).present();

    }
    console.log(this.selectedTechnologies)

    }

    
  }

  /**
   * Define the default value on carrier change;
   */
  onCarrierChange(selectedValue: any) {

    this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    this.formElements['selectedCarrier'] = this.carrier;
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {

      // this.formElements['thresholdValue_' + i] = (typeof this.formElements['thresholdValue_' + i] == 'undefined') ? this.tn : this.formElements['thresholdValue_' + i];
      // this.formElements['isShow' + i] = false;
      // this.formElements['icon' + i] = 'add-circle';
      // this.formElements['advanceEditBtn' + i] = "Advance Edit";
      // this.formElements['advanceEditIcon' + i] = "ios-create-outline";
      // this.formElements['eTnValue_' + i] = (typeof this.formElements['eTnValue_' + i] == 'undefined') ? this.tn : this.formElements['eTnValue_' + i];
      // this.formElements['eMimoValue_' + i] = (typeof this.formElements['eMimoValue_' + i] == 'undefined') ? this.formElements['mimo_' + i] : this.formElements['eMimoValue_' + i];

      // this.formElements['cprValue_' + i] = (typeof this.formElements['cprValue_' + i] == 'undefined') ? this.cpr : this.formElements['cprValue_' + i];
      // this.formElements['eCprValue_' + i] = (typeof this.formElements['eCprValue_' + i] == 'undefined') ? this.cpr : this.formElements['eCprValue_' + i];

      // this.formElements['ca_' + i] = (typeof this.formElements['ca_' + i] == 'undefined') ? 0 : this.formElements['ca_' + i];
    }

    this.getCbValue();

  }
  /**
   * Calculate the Cb value
   */
  getCbValue() {

    this.cb = 0;
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {
      this.cb += (typeof this.baseline['ca_' + i] == 'undefined') ? 0 : this.baseline['ca_' + i]
    }
    this.techCb=0;
    this.selectedTechnologies.forEach((item, index) => {
    //  this.formElements['ca_' + item.shortname] = 0;
      let selectedCarrier =item.carrier;
      for (var c = 1; c < (selectedCarrier + 1); c++) {
        //this.formElements['ca_' + item.shortname] += (typeof this.formElements['ca_' + c + "_" + item.shortname] == 'undefined') ? 0 : this.formElements['ca_' + c + "_" + item.shortname];

        this.techCb += (typeof this.technology['ca_' + c + "_" + item.shortname] == 'undefined') ? 0 : this.technology['ca_' + c + "_" + item.shortname];
      }
    });


  }

  /**
   * All Baseline form value change event.
   */
  onBaselineChange(selectedValue: any, field: any, item: any) {
    this.baseline[field + item] = selectedValue;
    let nCells = this.baseline['nCells_' + item];
    let chCapacity = this.baseline['chCapacity_' + item];
    let qam = this.baseline['qam_' + item];

    if (field == 'mimo_') {
      this.baseline['mimoValue_' + item] = this.baseline['mimo_' + item];
    }
    let mimo = (this.baseline['mimoValue_' + item] != null) ? this.baseline['mimoValue_' + item] : this.baseline['mimo_' + item];
    let tn = this.baseline['thresholdValue_' + item];
    let cpr = this.baseline['cprValue_' + item];
    if (nCells != null && chCapacity != null && qam != null && mimo != null) {
      this.baseline['ca_' + item] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, tn, cpr);
    }
    console.log(this.baseline)
    this.getCbValue();

  }
  selectedTechnology(data:any){
    
    if (data.checked == true) {
    this.selectedTechnologies.push(data);
  } else {
    let newArray = this.selectedTechnologies.filter(function(el) {
     return el.name !== data.name;
  });
  this.selectedTechnologies = newArray;   
 }
 console.log(this.selectedTechnologies);
  }

  /**
   * All Baseline form value change event.
   */
  onEvoluationChange(selectedValue: any, field: any, carrier: any,technology:any) {
    
    this.technology[field + carrier+ '_' + technology] = selectedValue;
    let nCells = this.technology['nCells_'  + carrier+ '_' + technology];
    let chCapacity = this.technology['chCapacity_' + carrier+ '_' + technology];
    let qam = this.technology['qam_' + carrier+ '_' + technology];

    if (field == 'mimo_') {
      this.technology['mimoValue_' + carrier+ '_' + technology] = this.technology['mimo_' + carrier+ '_' + technology];
    }
    let mimo = (this.technology['mimoValue_' + carrier+ '_' + technology] != null) ? this.technology['mimoValue_' + carrier+ '_' + technology] : this.technology['mimo_' + carrier+ '_' + technology];
    let tn = this.technology['thresholdValue_' + carrier+ '_' + technology];
    
    let cpr =  AppVariables.CPR.filter(item => item.name === technology)[0].value;
    if (nCells != null && chCapacity != null && qam != null && mimo != null) {
      this.technology['ca_' + carrier+ '_' + technology] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, technology,tn, cpr);
    }
    console.log(this.technology)
    this.getCbValue();

  }
  
}

