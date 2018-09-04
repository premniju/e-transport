import { Component, ViewChild } from '@angular/core';
import { IonicPage, App, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { AdvanceEditPage } from '../advance-edit/advance-edit';
import { AppVariables, AppVariables_Tech } from "../../config/app-variables";
import { EDimmensionProvider } from "../../providers/e-dimmension/e-dimmension";
import * as  Papa from 'papaparse';
import { EMailProvider } from '../../providers/e-mail/e-mail';
import { EPdfProvider } from '../../providers/e-pdf/e-pdf';
import { EImageHandlerProvider } from '../../providers/e-image-handler/e-image-handler';
import { Chart } from 'chart.js';
import * as html2canvas from 'html2canvas';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage({
  name: 'my-dashboard',
  segment: 'my-dashboard'
})
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  @ViewChild('pieChart') pieChart;
  @ViewChild('barChart') barChart;
  @ViewChild('stackedChart') stackedChart;


  public operator: any = [];
  public formElements: any = [];
  public customerList: any = AppVariables.OPERATOR;
  public carrierlist: any = AppVariables.NCARRIERS;
  public config: any = 'A';
  public nCellsList: any = AppVariables.NCELLS;
  public qamList: any = AppVariables.QAM;
  public channelCapacityList: any = AppVariables.CHANNEL_CAPACITY;
  public mimoList: any = AppVariables.MIMO;
  public baseline: any = [];
  public carrier: Number = 0;
  public selectedCarrierList: any = [];
  public cb: number = 0;
  public technology: any = [];
  public technologyList: any = AppVariables_Tech.TECHNOLOGY_LIST;
  public selectedTechnologies: any = [];
  public techCb: number;
  public isPdf:any =false;
  public pdfCss:any='';


  public inputData: any[] = [];
  public headerRow: any[] = [];


  public TTPeakValue: number = 0;

  public pieChartEl: any;
  public barChartEl: any;
  public chartLabels: any = [];

  public chartValues: any = [];
  public chartColours: any = [];
  public chartHoverColours: any = [];
  public chartLoading: any;
  public colors: any = [];
  public report: any = [];
  public formData: any = [];
  public isApp: Boolean;

  public barStackedChartEl: any;
  public stackedChartData: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    private _eDim: EDimmensionProvider,
    private altCtrl: AlertController,
    private modalCtrl: ModalController,
    private _email: EMailProvider,
    private _epdf: EImageHandlerProvider) {

    // color code for the charts
    this.colors[1] = '#0099ff';
    this.colors[2] = '#66ff99';
    this.colors[3] = '#ff6666';
    this.colors[4] = '#00ffdd';
    this.colors[5] = '#ff99ff';
    this.colors[6] = '#ffff66';
    this.colors['LAA'] = '#66ffff';
    this.colors['5G Small cell'] = '#ff9999';
    this.colors['Massive MIMO'] = '#ffcc99';
    this.colors['FWA'] = '#cc99ff';
    this.colors['eMBB'] = '#cc9999';
    this.colors['Manual'] = '#33ffcc';


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    // pre-load operator configuration information.
    this.operator['A'] = AppVariables.OPERATOR_A;
    this.operator['B'] = AppVariables.OPERATOR_B;
    this.operator['C'] = AppVariables.OPERATOR_C;
    this.operator['M'] = [];

    console.log(this.carrierlist);
  }

  /**
   * Logout
   */
  logout() {
    let nav = this.app.getRootNav();
    nav.setRoot('login');

  }
  /**
   * Load the pre configure information on customer change 
   */
  onOperatorChange(operator: any) {
    operator = (operator) ? operator : 'A';
    this.populateOperatorInfo(operator);
    this.getCbValue();

  }
  /**
 * load the operator default configuration
 */
  populateOperatorInfo(operator) {

    this.carrier = this.operator[operator].length;
    this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    this.baseline = [];
    this.operator[operator].forEach((item, index) => {
      let i = index + 1;
      this.baseline['name_' + i] = (typeof this.baseline['name_' + i] == 'undefined') ? "Carrier " + i : this.baseline['name_' + i];
      this.baseline['nCells_' + i] = item.nCells;
      this.baseline['chCapacity_' + i] = item.chCapacity;
      this.baseline['qam_' + i] = item.qam;
      this.baseline['mimo_' + i] = item.mimo;
      this.baseline['mimoValue_' + i] = this.baseline['mimo_' + i];

      this.baseline['thresholdValue_' + i] = (typeof this.baseline['thresholdValue_' + i] == 'undefined') ? AppVariables.TRANSPORTTHRESHOLD : this.baseline['thresholdValue_' + i];
      this.baseline['cprValue_' + i] = (typeof this.baseline['cprValue_' + i] == 'undefined') ? AppVariables.CPR.filter(item => item.name === 'manual')[0].value : this.baseline['cprValue_' + i];

      this.onBaselineChange(item.mimo, 'mimo_', i);

    });
    console.log(this.baseline)
  }
  addRow(section: any, technology: any) {
    if (section == 'Baseline') {

      if (AppVariables.CARRIER_LIMIT > this.carrier) {
        this.carrier = +this.carrier + 1;

        this.baseline['name_' + this.carrier] = 'Carrier ' + this.carrier;
        this.baseline['thresholdValue_' + this.carrier] = (typeof this.baseline['thresholdValue_' + this.carrier] == 'undefined') ? AppVariables.TRANSPORTTHRESHOLD : this.baseline['thresholdValue_' + this.carrier];
        this.baseline['cprValue_' + this.carrier] = (typeof this.baseline['cprValue_' + this.carrier] == 'undefined') ? AppVariables.CPR.filter(item => item.name === 'manual')[0].value : this.baseline['cprValue_' + this.carrier];
        this.baseline['mimoValue_' + this.carrier] = (typeof this.baseline['mimoValue_' + this.carrier] == 'undefined') ? null : this.baseline['mimoValue_' + this.carrier];

        this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
      } else {

        this.altCtrl.create({
          title: 'Alert',
          subTitle: "Maximum carrier is exceed!!",
          buttons: ['OK']
        }).present();

      }

    } else {

      let tech = this.selectedTechnologies.filter(function (el) {
        return el.name == technology;
      });
      let carrier = tech[0].carrier;
      let shortname = tech[0].shortname;

      if (AppVariables.CARRIER_LIMIT > carrier) {
        carrier = +tech[0].carrier + 1;
        this.selectedTechnologies.filter(function (el) {
          return el.name == technology;
        })[0].carrier = carrier;

        this.selectedTechnologies.filter(function (el) {
          return el.name == technology;
        })[0].carrierList = this.carrierlist.slice(0, carrier);

        this.technology['name_' + carrier + '_' + shortname] = tech[0].name + ' ' + carrier;
        this.technology['thresholdValue_' + carrier + '_' + shortname] = (typeof this.technology['thresholdValue_' + carrier + '_' + shortname] == 'undefined') ? AppVariables.TRANSPORTTHRESHOLD : this.technology['thresholdValue_' + carrier + '_' + shortname];
        this.technology['cprValue_' + carrier + '_' + shortname] = (typeof this.technology['cprValue_' + carrier + '_' + shortname] == 'undefined') ? AppVariables.CPR.filter(item => item.name === shortname)[0].value : this.technology['cprValue_' + carrier + '_' + shortname];
        this.technology['mimoValue_' + carrier + '_' + shortname] = (typeof this.technology['mimoValue_' + carrier + '_' + shortname] == 'undefined') ? null : this.technology['mimoValue_' + carrier + '_' + shortname];

      } else {

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
    this.techCb = 0;
    this.selectedTechnologies.forEach((item, index) => {
      //  this.formElements['ca_' + item.shortname] = 0;
      let selectedCarrier = item.carrier;
      this.technology['ca_' + item.shortname] = 0;
      for (var c = 1; c < (selectedCarrier + 1); c++) {
        this.technology['ca_' + item.shortname] += (typeof this.technology['ca_' + c + "_" + item.shortname] == 'undefined') ? 0 : Number(this.technology['ca_' + c + "_" + item.shortname]);

        this.techCb += (typeof this.technology['ca_' + c + "_" + item.shortname] == 'undefined') ? 0 : this.technology['ca_' + c + "_" + item.shortname];
      }
    });
    this.TTPeakValue = Math.round(this.cb + this.techCb);

    this.showchart();
  }

  /**
   * All Baseline form value change event.
   */
  onBaselineChange(selectedValue: any, field: any, item: any, value?: any) {

    if (field == "name_") {
      this.baseline[field + item] = value;
    }
    else {
      this.baseline[field + item] = selectedValue;
    }
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
      this.baseline['ca_' + item] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, 'carrier', tn, cpr);
    }
    console.log(this.baseline)
    this.getCbValue();

  }
  selectedTechnology(data: any) {

    if (data.checked == true) {
      this.selectedTechnologies.push(data);
      this.technology['ca_' + data.shortname] = ((typeof this.technology['ca_' + data.shortname] == 'undefined') ? 0 : this.technology['ca_' + data.shortname]) ;
    } else {
      let newArray = this.selectedTechnologies.filter(function (el) {
        return el.name !== data.name;
      });
      this.selectedTechnologies = newArray;
    }
    console.log(this.selectedTechnologies);
  }
  hideShowTechnology(data: any) {

    if (data.icon == 'md-arrow-dropup') {
      console.log('close');
      this.selectedTechnologies.filter(function (el) {
        return el.name == data.name;
      })[0].icon = 'md-arrow-dropdown';
    } else {
      console.log('open');
      this.selectedTechnologies.filter(function (el) {
        return el.name == data.name;
      })[0].icon = 'md-arrow-dropup';
    }

  }

  /**
   * All Baseline form value change event.
   */
  onEvoluationChange(selectedValue: any, field: any, carrier: any, technology: any, value?: any) {

    if (field == "name_") {
      this.technology[field + carrier + '_' + technology] = value || 1;
    }
    else {
      this.technology[field + carrier + '_' + technology] = selectedValue;
    }
    this.technology[field + carrier + '_' + technology] = selectedValue;
    let nCells = this.technology['nCells_' + carrier + '_' + technology];
    let chCapacity = this.technology['chCapacity_' + carrier + '_' + technology];
    let qam = this.technology['qam_' + carrier + '_' + technology];

    if (field == 'mimo_') {
      this.technology['mimoValue_' + carrier + '_' + technology] = this.technology['mimo_' + carrier + '_' + technology];
    }
    let mimo = (this.technology['mimoValue_' + carrier + '_' + technology] != null) ? this.technology['mimoValue_' + carrier + '_' + technology] : this.technology['mimo_' + carrier + '_' + technology];
    let tn = this.technology['thresholdValue_' + carrier + '_' + technology];

    let cpr = AppVariables.CPR.filter(item => item.name === technology)[0].value;
    if (nCells != null && chCapacity != null && qam != null && mimo != null) {
      this.technology['ca_' + carrier + '_' + technology] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, technology, tn, cpr);
    }
    console.log("this.technology---", this.technology);
    this.getCbValue();

  }
  upload_file(event: any) {
    console.log(event.target.files[0].name)
    let fileName = event.target.files[0].name.split('.');
    console.log(fileName[1].toLowerCase())

    if (fileName[1].toLowerCase() == 'csv') {
      Papa.parse(event.target.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          this.inputData = results.data;

          console.log("input data", this.inputData);
          localStorage.setItem("Input_Data", JSON.stringify(this.inputData));
        }
      });
    } else {
      this.altCtrl.create({
        title: 'Alert',
        subTitle: "CSV format file only supported!!",
        buttons: ['OK']
      }).present();
    }
  }

  download_file() {
    let objArray: any = [];
    let outputArray: any = [];
    //console.log("Download data", JSON.parse(localStorage.getItem("Input_Data")));

    objArray = JSON.parse(localStorage.getItem("Input_Data"));
    console.log("objArray", objArray);
    var result = objArray.map(obj => {
      if (obj["S. No"] === null) {
        return;
      }

      let c = obj["Configured CIR (in Mbps)"];
      let d = obj["Current Bandwidth Utilization (in Mbps)"];

      let e = Math.round((d / c) * 100);
      obj["Current Bandwidth Utilization (%)"] = e + "%";

      let f: number = obj["Baseline Theoritical Peak (Mbps)"] = this.cb;
      let utilization = (d / f);
      let g = Math.round(utilization * 100);
      obj["Utilization (%) based on theoritical peak"] = g + "%";

      let i: number = this.TTPeakValue;
      let h = obj["Evolution Theoritical Peak Througput (in Mbps)"] = i - f;
      obj["Total Theoritical Peak Throuput Required (Mbps)"] = this.TTPeakValue;
      let j = obj["Capacity Required (in Mbps)"] = Math.round(i * utilization);

      outputArray.push(obj);
    });

    let output_csv = Papa.unparse(outputArray, { header: true });
    //console.log("JSON-CSV", output_csv);

    let blob = new Blob([output_csv]);
    let a: any = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  presentPrompt(item: any, shortName: any = 'baseline') {
    let tn, cpr, mimo;
    if (shortName == 'baseline') {
      tn = this.baseline['thresholdValue_' + item];
      cpr = this.baseline['cprValue_' + item];
      mimo = this.baseline['mimoValue_' + item];
    } else {

      tn = this.technology['thresholdValue_' + item + '_' + shortName];
      cpr = this.technology['cprValue_' + item + '_' + shortName];
      mimo = this.technology['mimoValue_' + item + '_' + shortName];

    }

    let alert = this.altCtrl.create({
      title: 'Advance Edit',
      inputs: [
        {
          label: 'Spectrum Efficiency',
          name: 'spectrumEfficiency',
          placeholder: 'Spectrum Efficiency',
          value: mimo
        },
        {
          label: 'TN Overhead',
          name: 'tnOverhead',
          placeholder: 'TN Overhead',
          value: tn
        },
        {
          label: 'Cell Peak Rate',
          name: 'cellPeakRate',
          placeholder: 'Cell Peak Rate',
          type: 'text',
          value: cpr
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (shortName == 'baseline') {
              this.baseline['thresholdValue_' + item] = data.tnOverhead;
              this.baseline['cprValue_' + item] = data.cellPeakRate;
              this.baseline['mimoValue_' + item] = data.spectrumEfficiency;
              this.onBaselineChange(this.baseline['mimo_' + item], 'mimo_', item);
            } else {
              this.technology['thresholdValue_' + item + '_' + shortName] = data.tnOverhead;
              this.technology['cprValue_' + item + '_' + shortName] = data.cellPeakRate;
              this.technology['mimoValue_' + item + '_' + shortName] = data.spectrumEfficiency;
              this.onEvoluationChange(this.technology['mimo_' + item + '_' + shortName], 'mimo_', item, shortName);
            }
          }
        }
      ]
    });
    alert.present();
  }
  advanceEdit(item: any, shortName: any = 'baseline') {
    let tn, cpr, mimo;
    if (shortName == 'baseline') {
      tn = this.baseline['thresholdValue_' + item];
      cpr = this.baseline['cprValue_' + item];
      mimo = this.baseline['mimoValue_' + item];
    } else {

      tn = this.technology['thresholdValue_' + item + '_' + shortName];
      cpr = this.technology['cprValue_' + item + '_' + shortName];
      mimo = this.technology['mimoValue_' + item + '_' + shortName];

    }
    let myModal = this.modalCtrl.create(AdvanceEditPage, { 'data': { tn: tn, cpr: cpr, mimo: mimo, shortName: shortName, item: item } });
    myModal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        if (data.shortName == 'baseline') {
          this.baseline['thresholdValue_' + item] = data.tn;
          this.baseline['cprValue_' + item] = data.cpr;
          this.baseline['mimoValue_' + item] = data.mimo;
          this.onBaselineChange(this.baseline['mimo_' + item], 'mimo_', item);
        } else {
          this.technology['thresholdValue_' + item + '_' + shortName] = data.tn;
          this.technology['cprValue_' + item + '_' + shortName] = data.cpr;
          this.technology['mimoValue_' + item + '_' + shortName] = data.mimo;
          this.onEvoluationChange(this.technology['mimo_' + item + '_' + shortName], 'mimo_', item, shortName);
        }
      }
    });
    myModal.present();
  }
  sendMail() {
    let attachment = this.pieChartEl.toBase64Image();
    this._email.sendMail(AppVariables.EXECUTIVE_EMAIL, AppVariables.EXECUTIVE_EMAIL, AppVariables.EXECUTIVE_EMAIL, attachment, AppVariables.EMAIL_SUBJECT, null);
  }

  showchart() {
    this.defineChartData();
    this.createPieChart();
    this.createBarChart();
    this.createStackedChart();


    this.formData = [];
    let data = [];
    // for (let i = 1; i <= this.formElements.selectedCarrier; i++) {
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {

      let chCapacity = this.baseline["chCapacity_" + i];
      let qam = this.baseline["qam_" + i];
      let nCell = this.baseline["nCells_" + i];
      let mimoValue = this.baseline["mimo_" + i];
      let carrier = this.baseline['name_' + i];
      let ca = this.baseline["ca_" + i];
      let mimoName = AppVariables.MIMO.filter(item => item.value === mimoValue);
      let mimo = (mimoName.length > 0) ? AppVariables.MIMO.filter(item => item.value === mimoValue)[0].name : null;
      data.push({ name: carrier, sectors: nCell, channelBw: chCapacity, mimo: mimo, qam: qam, ca: ca, class: ('c-' + i) });
      if (data.length == 4) {
        this.formData.push(data);
        data = [];
      }
    }

    // if (this.formElements['selectedTechnologies']) {
    //   for (let s = 0; s < this.formElements['selectedTechnologies'].length; s++) {
    this.selectedTechnologies.forEach((item, index) => {

      let techShortName = item.shortname;
      let technology = item.name;
      let selectedCarrier = item.carrier;

      // if (this.formElements['selectedcarrier_' + techShortName]) {

      for (let t = 1; t <= selectedCarrier; t++) {

        let chCapacity = this.technology["chCapacity_" + t + "_" + techShortName];
        let qam = this.technology["qam_" + t + "_" + techShortName];
        let nCell = this.technology["nCells_" + t + "_" + techShortName];
        let mimoValue = this.technology["mimo_" + t + "_" + techShortName];
        let carrier = this.technology['name_' + t + '_' + techShortName];
        let ca = this.technology["ca_" + t + "_" + techShortName];
        console.log(AppVariables.MIMO.filter(item => item.value === parseFloat(mimoValue)));
        let mimoName = AppVariables.MIMO.filter(item => item.value === parseFloat(mimoValue));
        console.log(mimoName)
        let mimo = (mimoName.length == 0) ? null : mimoName[0].name;
        if (ca > 0)
          data.push({ name: carrier, sectors: nCell, channelBw: chCapacity, mimo: mimo, qam: qam, ca: ca, class: ('c-' + techShortName) });
        if (data.length == 4) {
          this.formData.push(data);
          data = [];
        }
        // }
        // }
      }
    });

    if (data.length > 0)
      this.formData.push(data);

  }


  defineChartData() {

    this.report = [];

    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {

      let value = ((typeof this.baseline['ca_' + i] == 'undefined') ? 0 : this.baseline['ca_' + i]) + '';
      let technology = (typeof this.baseline['name_' + i] == 'undefined') ? 'Carrier ' + i : this.baseline['name_' + i];
      this.report.push({ technology: technology, value: value, index: i });
    }

    this.selectedTechnologies.forEach((item, index) => {

      let value = (typeof this.technology['ca_' + item.shortname] == 'undefined') ? 0 : this.technology['ca_' + item.shortname];
      let technology = item.name;
      //let technology = (typeof this.technology['name_' + index + "_" + item.shortname] == 'undefined') ? item.shortname + index : this.technology['name_' + index + "_" + item.shortname];
      if (value > 0)
        this.report.push({ technology: technology, value: value });
    });

    let k: any;
    this.chartLabels = [];
    this.chartValues = [];
    this.chartColours = [];
    this.stackedChartData = [];
    for (k in this.report) {

      var tech = this.report[k];
      let color = (typeof this.colors[tech.technology] == 'undefined') ? this.colors[tech.index] : this.colors[tech.technology];

      this.stackedChartData.push({ data: [tech.value], backgroundColor: color, label: tech.technology });

      this.chartLabels.push(tech.technology);
      this.chartValues.push(tech.value);
      this.chartColours.push(color);

    }

  }
  drawTotals(chart) {

    var width = chart.chart.width,
      height = chart.chart.height,
      ctx = chart.chart.ctx;

    ctx.restore();
    var fontSize = (height / 154).toFixed(2);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";

    var text = chart.config.centerText.text,
      textX = Math.round((width - ctx.measureText(text).width) / 2) + 25,
      textY = (height / 2);

    ctx.fillText(text, textX, textY);
    ctx.save();
  }

  createPieChart() {

    let curObj = this;

    if (this.pieChartEl !== undefined)
      this.pieChartEl.destroy();
    this.pieChartEl = new Chart(this.pieChart.nativeElement,
      {
        plugins: [{
          beforeDraw: function (chart, options) {
            if (chart.config.centerText.display !== null &&
              typeof chart.config.centerText.display !== 'undefined' &&
              chart.config.centerText.display) {
              curObj.drawTotals(chart);
            }
          }
        }],
        type: 'doughnut',
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
        },
        centerText: {
          display: true,
          text: this.TTPeakValue + ' Mbps'
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

  createBarChart() {
    if (this.barChartEl !== undefined)
      this.barChartEl.destroy();
    this.barChartEl = new Chart(this.barChart.nativeElement,
      {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: [{
            label: 'CSR Capacity',
            data: this.chartValues,
            duration: 2000,
            easing: 'easeInQuart',
            backgroundColor: this.chartColours,
            // hoverBackgroundColor  : this.chartHoverColours
          }]
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false,
            boxWidth: 80,
            fontSize: 15,
            padding: 0
          },
          scales: {
            yAxes: [{
              ticks: {
                //  beginAtZero:true,
                // stepSize: 100,
                // max : 10000
              }
            }],
            xAxes: [{
              ticks: {
                autoSkip: false
              }
            }]
          }
        }
      });
  }


  createStackedChart() {
    if (this.barStackedChartEl !== undefined)
      this.barStackedChartEl.destroy();
    this.barStackedChartEl = new Chart(this.stackedChart.nativeElement,
      {
        type: 'horizontalBar',
        data: {
          labels: this.chartLabels,
          datasets: this.stackedChartData
          //  [
          //    {
          //    label                 : 'CSR Capacity',
          //     data                  : this.chartValues,
          //     duration              : 2000,
          //     easing                : 'easeInQuart',
          //     backgroundColor       : this.chartColours,
          //     // hoverBackgroundColor  : this.chartHoverColours
          //  }
          //  ]
        },
        options: {
          legend: {
            display: true, // hides the legend
            onClick: (e) => e.stopPropagation()
          },
          tooltips: {
            enabled: false // hides the tooltip.
          },
          scales: {
            xAxes: [{
              barPercentage: 1.0,
              barThickness: 50,
              display: false, // hides the horizontal scale
              stacked: true // stacks the bars on the x axis
            }],
            yAxes: [{
              barPercentage: 1.0,
              barThickness: 50,
              display: false, // hides the vertical scale
              stacked: true // stacks the bars on the y axis
            }]
          }
        }
      });
  }
  downloadPdf() {
this.isPdf =true;
this.pdfCss='e-opacity';
    let charts = [];
    var obj = this;
    if (this.formData.length <= 3) {
      let exportStackedChart = document.getElementById("exportStackedChart");

      let options = { background: "white", height: exportStackedChart.clientHeight, width: exportStackedChart.clientWidth };
      html2canvas(exportStackedChart, options).then((canvas) => {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 5, 5, 5] });
        let exportSquareChart = document.getElementById("exportSquareChart");
        let squareChartOptions = { background: "white", height: exportSquareChart.clientHeight, width: (exportSquareChart.clientWidth - 10) };

        return html2canvas(exportSquareChart, squareChartOptions);
      }).then(function (canvas) {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 20, 5, 5], style: 'squareImage' });
        obj._epdf.generatePDF(charts);
        obj.isPdf =false;
        obj.pdfCss='';
      })
        .catch((err) => {
          console.log("error canvas", err);

        });
    } else if (this.formData.length > 3 && this.formData.length < 10) {

      let exportStackedChart = document.getElementById("exportStackedChart");
      let options = { background: "white", height: exportStackedChart.clientHeight, width: exportStackedChart.clientWidth };
      html2canvas(exportStackedChart, options).then((canvas) => {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 5, 5, 5] });
        let exportSquareChart = document.getElementById("exportSquareChart");
        let squareChartOptions = { background: "white", height: exportSquareChart.clientHeight, width: (exportSquareChart.clientWidth - 10) };

        return html2canvas(exportSquareChart, squareChartOptions);
      }).then(function (canvas) {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 20, 5, 5], style: 'squareImage', pageBreak: 'after' });

        let exportSquareChart2 = document.getElementById("exportSquareChart2");
        let squareChartOptions2 = { background: "white", height: exportSquareChart2.clientHeight, width: (exportSquareChart2.clientWidth - 10) };
        return html2canvas(exportSquareChart2, squareChartOptions2);
      })
        .then(function (canvas) {
          charts.push({ image: canvas.toDataURL(), alignment: 'center', style: 'squareImage' });
          obj._epdf.generatePDF(charts);
          obj.isPdf =false;
          obj.pdfCss='';
        })
        .catch((err) => {
          console.log("error canvas", err);

        });

    } else if (this.formData.length >= 10) {

      let exportStackedChart = document.getElementById("exportStackedChart");
      let options = { background: "white", height: exportStackedChart.clientHeight, width: exportStackedChart.clientWidth };
      html2canvas(exportStackedChart, options).then((canvas) => {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 5, 5, 5] });
        let exportSquareChart = document.getElementById("exportSquareChart");
        let squareChartOptions = { background: "white", height: exportSquareChart.clientHeight, width: (exportSquareChart.clientWidth - 10) };

        return html2canvas(exportSquareChart, squareChartOptions);
      }).then(function (canvas) {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 20, 5, 5], style: 'squareImage', pageBreak: 'after' });

        let exportSquareChart2 = document.getElementById("exportSquareChart2");
        let squareChartOptions2 = { background: "white", height: exportSquareChart2.clientHeight, width: (exportSquareChart2.clientWidth - 10) };
        return html2canvas(exportSquareChart2, squareChartOptions2);
      }).then(function (canvas) {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 20, 5, 5], style: 'squareImage', pageBreak: 'after' });

        let exportSquareChart3 = document.getElementById("exportSquareChart3");
        let squareChartOptions3 = { background: "white", height: exportSquareChart3.clientHeight, width: (exportSquareChart3.clientWidth - 10) };
        return html2canvas(exportSquareChart3, squareChartOptions3);
      })
        .then(function (canvas) {
          charts.push({ image: canvas.toDataURL(), alignment: 'center', style: 'squareImage' });
          obj._epdf.generatePDF(charts);
          obj.isPdf =false;
          obj.pdfCss='';
        })
        .catch((err) => {
          console.log("error canvas", err);

        });


    }



  }

  checkPdfPagination(i: any, type: any) {
    if (type == 2 && i >= 3 && i <= 8) {
      return true;
    } else if (type == 3 && i >= 9) {
      return true;
    } else {
      return false;
    }
  }



}

