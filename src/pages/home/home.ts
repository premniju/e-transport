import { Component, ViewChild } from '@angular/core';
import { NavController, App, Platform, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { EDimmensionProvider } from "../../providers/e-dimmension/e-dimmension";
import { ChartPage } from '../chart/chart';
import { AppVariables,AppVariables_Tech } from "../../config/app-variables";
import { Chart } from 'chart.js';
import { EMailProvider } from '../../providers/e-mail/e-mail';

const NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('pieChart') pieChart;

  public imageUrl: any;
  public customer: string = "ATT";
  public carrier: number = 0;
  public selectedCarrierList: any = [];
  public tab: string = 'baseline';
  public technology: string = '';
  public customClass: string = null;
  public technologyList: any = [];
  public cb: any = 0;
  public formElements: any = [];
  public selectedTechnology: any = [];
  public customerList: any = AppVariables.OPERATOR;
  public carrierlist: any = AppVariables.NCARRIERS;
  public config: any = 'Option A';
  public nCellsList: any = AppVariables.NCELLS;
  public qamList: any = AppVariables.QAM;
  public channelCapacityList: any = AppVariables.CHANNEL_CAPACITY;
  public mimoList: any = AppVariables.MIMO;
  public showDetails: Boolean = false;
  public operator: any = [];
  public tn: any = 1.17;
  public unregisterBackButtonAction: any;

  public cpr: any = 150;
  public cprList: any = AppVariables.CPR;


  public pieChartEl: any;
  public barChartEl: any;
  public lineChartEl: any;
  public chartLabels: any = [];
  public chartValues: any = [];
  public chartColours: any = [];
  public chartHoverColours: any = [];
  public chartLoading: any;
  public colors: any = [];
  public report: any = [];
  public formData: any = [];
  public isApp: Boolean;


  constructor(public navCtrl: NavController,
    public app: App,
    private plt: Platform,
    private _eDim: EDimmensionProvider,
    private altCtrl: AlertController,
    private _email: EMailProvider) {
    this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    // pre-load operator configuration information.
    this.operator['Option A'] = AppVariables.OPERATOR_A;
    this.operator['Option B'] = AppVariables.OPERATOR_B;
    this.operator['Option C'] = AppVariables.OPERATOR_C;

    this.operator['Manual'] = [];



    // color code for the charts
    this.colors['Carrier 1'] = '#0099ff';
    this.colors['Carrier 2'] = '#66ff99';
    this.colors['Carrier 3'] = '#ff6666';
    this.colors['Carrier 4'] = '#00ffdd';
    this.colors['Carrier 5'] = '#ff99ff';
    this.colors['Carrier 6'] = '#ffff66';
    this.colors['LAA'] = '#66ffff';
    this.colors['5G Small cell'] = '#ff9999';
    this.colors['Massive MIMO'] = '#ffcc99';
    this.colors['FWA'] = '#cc99ff';
    this.colors['eMBB'] = '#cc9999';
    this.colors['Manual'] = '#33ffcc';

    if (this.plt.is('core')) {
      this.isApp = false;
    } else {
      this.isApp = true;
    }

    // define the dafult carriers
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {
      this.formElements['nCells_' + i] = null;
      this.formElements["chCapacity_" + i] = null;
      this.formElements['qam_' + i] = null;
      this.formElements['mimo_' + i] = null;
      this.formElements['ca_' + i] = 0;
      this.formElements['cprValue_' + i] = this.cpr;
    }
    // define the default technology ca;
    this.formElements['ca_laa'] = 0;
   // this.technologyList = AppVariables.TECHNOLOGY_LIST;
    // technology input information
    this.technologyList = AppVariables_Tech.TECHNOLOGY_LIST;
   
    let temp = this.technology;
    this.selectedTechnology = this.technologyList.filter(function (obj) {
      return (temp.indexOf(obj.name) > -1);
    });


    this.selectedTechnology.forEach((item, index) => {
      let shortName = item.shortname;
      let selectedCarrier = [];
      if (typeof this.formElements['selectedcarrier_' + shortName] != 'undefined') {
        selectedCarrier = this.formElements['selectedcarrier_' + shortName];
      }

      for (var c = 1; c < (selectedCarrier.length + 1); c++) {
        this.formElements['icon' + c + '_' + shortName] = "add-circle";
        this.formElements['advanceEditBtn' + c + '_' + shortName] = "Advance Edit";
        this.formElements['advanceEditIcon' + c + '_' + shortName] = "ios-create-outline";
        this.formElements['thresholdValue_' + c + '_' + shortName] = (typeof this.formElements['thresholdValue_' + c + '_' + shortName] == 'undefined') ? 1.17 : this.formElements['thresholdValue_' + c + '_' + shortName];
      }
    });

    this.customClass = (this.plt.is('core') || this.plt.is('mobileweb')) ? "browser-view" : null;
    this.onCustomerChange('Option A');
  }
  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
    if (!this.isApp) {
      this.showchart();
    }

  }
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.plt.registerBackButtonAction(function (event) {
      console.log('Prevent Back Button Page Change');
    }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
  }

  /**
   * Logout
   */
  logout() {
    let nav = this.app.getRootNav();
    nav.setRoot(LoginPage);

  }


  /**
   * load the operator default configuration
   */
  loadOperator(operator) {
    console.log("asdasd");
    this.carrier = this.operator[operator].length;
    this.onCarrierChange(this.carrier);
    this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    this.operator[operator].forEach((item, index) => {
      let i = index + 1;
      this.formElements['nCells_' + i] = item.nCells;
      this.formElements['chCapacity_' + i] = item.chCapacity;
      this.formElements['qam_' + i] = item.qam;
      this.formElements['mimo_' + i] = item.mimo;
      this.formElements['mimoValue_' + i] = this.formElements['mimo_' + i];
      this.formElements['cprValue_' + i] = item.cpr;
      this.onChange(item.mimo, 'mimo_', i);

    });

  }
  /**
   * Load the pre configure information on customer change 
   */
  onCustomerChange(operator: any) {
    this.reset();
    this.loadOperator(operator);
    this.getCbValue();

  }
  /**
   * Reset the form values.
   */
  reset() {
    this.formElements = [];
  }
  /**
   * Define the default value on carrier change;
   */
  onCarrierChange(selectedValue: any) {

    this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    this.formElements['selectedCarrier'] = this.carrier;
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {

      this.formElements['thresholdValue_' + i] = (typeof this.formElements['thresholdValue_' + i] == 'undefined') ? this.tn : this.formElements['thresholdValue_' + i];
      this.formElements['isShow' + i] = false;
      this.formElements['icon' + i] = 'add-circle';
      this.formElements['advanceEditBtn' + i] = "Advance Edit";
      this.formElements['advanceEditIcon' + i] = "ios-create-outline";
      this.formElements['eTnValue_' + i] = (typeof this.formElements['eTnValue_' + i] == 'undefined') ? this.tn : this.formElements['eTnValue_' + i];
      this.formElements['eMimoValue_' + i] = (typeof this.formElements['eMimoValue_' + i] == 'undefined') ? this.formElements['mimo_' + i] : this.formElements['eMimoValue_' + i];

      this.formElements['cprValue_' + i] = (typeof this.formElements['cprValue_' + i] == 'undefined') ? this.cpr : this.formElements['cprValue_' + i];
      this.formElements['eCprValue_' + i] = (typeof this.formElements['eCprValue_' + i] == 'undefined') ? this.cpr : this.formElements['eCprValue_' + i];

      this.formElements['ca_' + i] = (typeof this.formElements['ca_' + i] == 'undefined') ? 0 : this.formElements['ca_' + i];
    }

    this.getCbValue();

  }
  /**
   * Load the pre configuration information on technology carrier change.
   */
  onTechCarrierChange(selectedValue: any, technology: any) {
    let carrier = this.formElements['carrier_' + technology];
    this.formElements['selectedcarrier_' + technology] = this.carrierlist.slice(0, carrier);
    for (var i = 1; i < (this.formElements['selectedcarrier_' + technology].length + 1); i++) {
      this.formElements['ca_' + i + "_" + technology] = (typeof this.formElements['ca_' + i + '_' + technology] == 'undefined') ? 0 : this.formElements['ca_' + i + '_' + technology];
      this.formElements['isShow' + i + '_' + technology] = false;
      this.formElements['icon' + i + '_' + technology] = "add-circle";
      this.formElements['advanceEditBtn' + i + '_' + technology] = "Advance Edit";
      this.formElements['advanceEditIcon' + i + '_' + technology] = "ios-create-outline";
      this.formElements['eMimoValue_' + i + '_' + technology] = (typeof this.formElements['eMimoValue_' + i + '_' + technology] == 'undefined') ? this.formElements['mimo_' + i + '_' + technology] : this.formElements['eMimoValue_' + i + '_' + technology];
      this.formElements['eTnValue_' + i + '_' + technology] = (typeof this.formElements['eTnValue_' + i + '_' + technology] == 'undefined') ? this.tn : this.formElements['eTnValue_' + i + '_' + technology];
      this.formElements['thresholdValue_' + i + '_' + technology] = (typeof this.formElements['thresholdValue_' + i + '_' + technology] == 'undefined') ? this.tn : this.formElements['thresholdValue_' + i + '_' + technology];
      this.formElements['cprValue_' + i + '_' + technology] = (typeof this.formElements['cprValue_' + i + '_' + technology] == 'undefined') ? this.cprList.filter(item => item.name === technology)[0].value : this.formElements['cprValue_' + i + '_' + technology];

      this.formElements['eCprValue_' + i + '_' + technology] = (typeof this.formElements['eCprValue_' + i + '_' + technology] == 'undefined') ? this.cprList.filter(item => item.name === technology)[0].value : this.formElements['eCprValue_' + i + '_' + technology];

    }
    this.getCbValue();
  }
  /**
   * All Baseline form value change event.
   */
  onChange(selectedValue: any, field: any, item: any) {
    this.formElements[field + item] = selectedValue;
    let nCells = this.formElements['nCells_' + item];
    let chCapacity = this.formElements['chCapacity_' + item];
    let qam = this.formElements['qam_' + item];

    if (field == 'mimo_') {
      this.formElements['mimoValue_' + item] = this.formElements['mimo_' + item];
    }
    let mimo = (this.formElements['mimoValue_' + item] != null) ? this.formElements['mimoValue_' + item] : this.formElements['mimo_' + item];
    let tn = this.formElements['thresholdValue_' + item];
    let cpr = this.formElements['cprValue_' + item];
    if (nCells != null && chCapacity != null && qam != null && mimo != null) {
      this.formElements['ca_' + item] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, tn, cpr);
    }
    this.getCbValue();

  }

  /**
   * Load the technology default form elements.
   */
  onTechnologySelect(selectedValue: any) {

    let temp = this.technology;
    this.selectedTechnology = this.technologyList.filter(function (obj) {
      return (temp.indexOf(obj.name) > -1);
    });
    this.formElements['selectedTechnologies'] = this.selectedTechnology;
    this.selectedTechnology.forEach((item, index) => {
      let shortName = item.shortname;
      this.formElements['icon' + shortName] = "add-circle";
      this.formElements['advanceEditBtn' + shortName] = "Advance Edit";
      this.formElements['advanceEditIcon' + shortName] = "ios-create-outline";      
      this.formElements['ca_' + shortName] = (typeof this.formElements['ca_' + shortName] == 'undefined') ? 0 : this.formElements['ca_' + shortName];
    });
    this.getCbValue();
  }

  /**
   * Evolution form element changes.
   */
  onEvolutionChange(selectedValue: any, fieldModel: any, technology: any, carrier: any) {

    this.formElements[fieldModel + carrier + '_' + technology] = selectedValue;

    let nCells = this.formElements['nCells_' + carrier + '_' + technology];
    let chCapacity = this.formElements['chCapacity_' + carrier + '_' + technology];
    let qam = this.formElements['qam_' + carrier + '_' + technology];

    if (fieldModel == 'mimo_') {
      this.formElements['mimoValue_' + carrier + '_' + technology] = this.formElements['mimo_' + carrier + '_' + technology];
    }
    let mimo = (this.formElements['mimoValue_' + carrier + '_' + technology] != null) ? this.formElements['mimoValue_' + carrier + '_' + technology] : this.formElements['mimo_' + carrier + '_' + technology];
    let tn = this.formElements['thresholdValue_' + carrier + '_' + technology];
    let cpr = this.formElements['cprValue_' + carrier + '_' + technology] = (this.formElements['cprValue_' + carrier + '_' + technology] != null) ? (this.formElements['cprValue_' + carrier + '_' + technology]) : ((technology == null) ? this.cpr : this.cprList.filter(item => item.name === technology)[0].value);

    if (nCells != null && chCapacity != null && mimo != null) {
      this.formElements['ca_' + carrier + "_" + technology] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, technology, tn, cpr);
      this.getCbValue();
    }
  }
  /**
   * Calculate the Cb value
   */
  getCbValue() {

    this.cb = 0;
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {
      this.cb += (typeof this.formElements['ca_' + i] == 'undefined') ? 0 : this.formElements['ca_' + i]
    }

    this.selectedTechnology.forEach((item, index) => {
      this.formElements['ca_' + item.shortname] = 0;
      let selectedCarrier = (typeof this.formElements['selectedcarrier_' + item.shortname] != "undefined") ? this.formElements['selectedcarrier_' + item.shortname] : [];
      for (var c = 1; c < (selectedCarrier.length + 1); c++) {
        this.formElements['ca_' + item.shortname] += (typeof this.formElements['ca_' + c + "_" + item.shortname] == 'undefined') ? 0 : this.formElements['ca_' + c + "_" + item.shortname];

        this.cb += (typeof this.formElements['ca_' + c + "_" + item.shortname] == 'undefined') ? 0 : this.formElements['ca_' + c + "_" + item.shortname];
      }
    });


  }
  /**
   * Load the chart report
   */
  loadChart() {

    if (!this.isApp) {
      this.showchart();
    } else {
      let report = [];
      let isValueExist = 0;
      for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {

        let value = (typeof this.formElements['ca_' + i] == 'undefined') ? 0 : this.formElements['ca_' + i];
        let technology = 'Carrier ' + i;

        if (value > 0) {
          isValueExist++;
        }
        report.push({ technology: technology, value: value });
      }

      this.selectedTechnology.forEach((item, index) => {

        let value = (typeof this.formElements['ca_' + item.shortname] == 'undefined') ? 0 : this.formElements['ca_' + item.shortname];
        let technology = item.name;
        if (value > 0) {
          isValueExist++;
        }
        report.push({ technology: technology, value: value });
      });

      if (isValueExist > 1) {
        this.navCtrl.push(ChartPage, { 'report': report, 'formdata': this.formElements });
      } else {

        this.altCtrl.create({
          title: 'Alert',
          subTitle: "Minimum two carriers / technology infomartion is required to view graph!!",
          buttons: ['OK']
        }).present();
      }

    }
  }
  /**
   * Form Hide/Show toggle 
   */
  toggleDetails(item: any, technology: any = null) {

    let add = (technology) ? ('_' + technology) : '';
    if (this.formElements['isShow' + item + add]) {
      this.formElements['isShow' + item + add] = false;
      this.formElements['icon' + item + add] = 'add-circle';
      this.formElements['isShowAdvanceEditable' + item + add] = false;
      this.formElements['advanceEditBtn' + item + add] = "Advance Edit";
      this.formElements['advanceEditIcon' + item + add] = "ios-create-outline";

    } else {
      this.formElements['isShow' + item + add] = true;
      this.formElements['icon' + item + add] = 'remove-circle';
    }
  }
  /**
   * Advance Edit/Save Toggle
   */
  toggleAdvanceEditable(item: any, technology: any = null) {

    let add = (technology) ? ('_' + technology) : '';

    if (this.formElements['isShowAdvanceEditable' + item + add]) {
      console.log("here1");
      this.formElements['isShowAdvanceEditable' + item + add] = false;      
      this.formElements['advanceEditBtn' + item + add] = "Advance Edit";
      this.formElements['advanceEditIcon' + item + add] = "ios-create-outline";

      this.formElements['eMimoValue_' + item + add] = this.formElements['mimoValue_' + item + add];

      this.formElements['eTnValue_' + item + add] = this.formElements['thresholdValue_' + item + add];

      this.formElements['eCprValue_' + item + add] = this.formElements['cprValue_' + item + add];

      this.updateCa(item, technology);
    } else {

      this.formElements['advanceEditBtn' + item + add] = "Save";
      this.formElements['advanceEditIcon' + item + add] = "md-checkmark";
      this.formElements['isShowAdvanceEditable' + item + add] = true;     
      this.formElements['mimoValue_' + item + add] = (this.formElements['eMimoValue_' + item + add] == null) ? this.formElements['mimo_' + item + add] : this.formElements['eMimoValue_' + item + add];
      this.formElements['thresholdValue_' + item + add] = this.formElements['eTnValue_' + item + add];

      this.formElements['cprValue_' + item + add] = this.formElements['eCprValue_' + item + add];


    }
  }
  /**
   * Update the Ca values
   */
  updateCa(item: any, technology: any = null) {
    let add = (technology) ? ('_' + technology) : '';
    let concatStr = item + add
    let nCells = this.formElements['nCells_' + concatStr];
    let chCapacity = this.formElements['chCapacity_' + concatStr];
    let qam = this.formElements['qam_' + concatStr];

    let mimo = (this.formElements['mimoValue_' + concatStr] != null) ? this.formElements['mimoValue_' + concatStr] : this.formElements['mimo_' + concatStr];
    let tn = this.formElements['thresholdValue_' + concatStr];
    let cpr = this.formElements['cprValue_' + concatStr];
    if (nCells != null && chCapacity != null && qam != null && mimo != null) {
      this.formElements['ca_' + concatStr] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, technology, tn, cpr);
    }
    this.getCbValue();
    //this.formElements['cprValue_' + concatStr] = cpr;
  }
  /**
   * Number form field vaildation
   */
  public onKeyUp(event: any) {

    let newValue = event.target.value;
    let regExp = new RegExp(NUMBER_REGEXP);

    if (!regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
    }
  }

  showchart() {
    this.defineChartData();
    this.createPieChart();
    this.formData = [];
    let data = [];
    for (let i = 1; i <= this.formElements.selectedCarrier; i++) {

      let chCapacity = this.formElements["chCapacity_" + i];
      let qam = this.formElements["qam_" + i];
      let nCell = this.formElements["nCells_" + i];
      let mimoValue = this.formElements["mimo_" + i];
      let carrier = "Carrier " + i;
      let ca = this.formElements["ca_" + i];
      let mimoName = AppVariables.MIMO.filter(item => item.value === mimoValue);
      let mimo = (mimoName.length > 0) ? AppVariables.MIMO.filter(item => item.value === mimoValue)[0].name : null;
      data.push({ name: carrier, sectors: nCell, channelBw: chCapacity, mimo: mimo, qam: qam, ca: ca, class: ('c-' + i) });
      if (data.length == 2) {
        this.formData.push(data);
        data = [];
      }
    }

    if (this.formElements['selectedTechnologies']) {
      for (let s = 0; s < this.formElements['selectedTechnologies'].length; s++) {

        let techShortName = this.formElements.selectedTechnologies[s].shortname;
        let technology = this.formElements.selectedTechnologies[s].name;

        if (this.formElements['selectedcarrier_' + techShortName]) {

          for (let t = 1; t <= this.formElements['selectedcarrier_' + techShortName].length; t++) {

            let chCapacity = this.formElements["chCapacity_" + t + "_" + techShortName];
            let qam = this.formElements["qam_" + t + "_" + techShortName];
            let nCell = this.formElements["nCells_" + t + "_" + techShortName];
            let mimoValue = this.formElements["mimo_" + t + "_" + techShortName];
            let carrier = "Carrier " + t + " " + technology;
            let ca = this.formElements["ca_" + t + "_" + techShortName];
            console.log(AppVariables.MIMO.filter(item => item.value === parseFloat(mimoValue)));
            let mimoName = AppVariables.MIMO.filter(item => item.value === parseFloat(mimoValue));
            console.log(mimoName)
            let mimo = (mimoName.length == 0) ? null : mimoName[0].name;
            if (ca > 0)
              data.push({ name: carrier, sectors: nCell, channelBw: chCapacity, mimo: mimo, qam: qam, ca: ca, class: ('c-' + techShortName) });
            if (data.length == 2) {
              this.formData.push(data);
              data = [];
            }
          }
        }
      }
    }
    this.formData.push(data);

  }


  defineChartData() {

    this.report = [];
    
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {

      let value = (typeof this.formElements['ca_' + i] == 'undefined') ? 500 : this.formElements['ca_' + i];
      let technology = 'Carrier ' + i;     
      this.report.push({ technology: technology, value: value });
    }

    this.selectedTechnology.forEach((item, index) => {

      let value = (typeof this.formElements['ca_' + item.shortname] == 'undefined') ? 0 : this.formElements['ca_' + item.shortname];
      let technology = item.name;      
      this.report.push({ technology: technology, value: value });
    });

    let k: any;
    this.chartLabels = [];
    this.chartValues = [];
    this.chartColours = [];
    for (k in this.report) {

      var tech = this.report[k];


      this.chartLabels.push(tech.technology);
      this.chartValues.push(tech.value);
      this.chartColours.push(this.colors[tech.technology]);

    }

  }

  createPieChart() {
    if (this.pieChartEl !== undefined)
      this.pieChartEl.destroy();
    this.pieChartEl = new Chart(this.pieChart.nativeElement,
      {
        type: 'pie',
        data: {
          labels: this.chartLabels,
          datasets: [{
            label: 'Daily Technology usage',
            data: this.chartValues,
            duration: 2000,
            easing: 'easeInQuart',
            backgroundColor: this.chartColours,            
          }]
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 50,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          animation: {
            duration: 5000
          },
          legend: {
            display: false            
          }
        }
      });

    this.chartLoading = this.pieChartEl.generateLegend();
  }
  getValueAtIndexOrDefault = (value, index, defaultValue) => {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    if (this.isArray(value)) {
      return index < value.length ? value[index] : defaultValue;
    }

    return value;
  };

  isArray = Array.isArray ?
    function (obj) {
      return Array.isArray(obj);
    } :
    function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };

  sendMail() {
    var canvas : any =document.getElementById("pieChart");
  //  console.log(canvas)
      var ctx=canvas.getContext("2d");
  let attachment = this.pieChartEl.toBase64Image();
  //console.log(ctx.getImageData(0,0,224,300));
    this._email.sendMail(AppVariables.EXECUTIVE_EMAIL, AppVariables.EXECUTIVE_EMAIL, AppVariables.EXECUTIVE_EMAIL,attachment, AppVariables.EMAIL_SUBJECT, null);
  }



}
