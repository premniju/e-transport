import { Component, ViewChild } from '@angular/core';
import { IonicPage, App, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AdvanceEditPage } from '../advance-edit/advance-edit';
import { AppVariables, AppVariables_Tech } from "../../config/app-variables";
import { EDimmensionProvider } from "../../providers/e-dimmension/e-dimmension";
import * as  Papa from 'papaparse';
import { EMailProvider } from '../../providers/e-mail/e-mail';
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
  public isPdf: any = false;
  public pdfCss: any = '';
  


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

    let userInfo = JSON.parse(localStorage.getItem("userData"));

    if (userInfo == null) {
     // this.logout();
    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    // pre-load operator configuration information.
    this.operator['A'] = AppVariables.OPERATOR_A;
    this.operator['B'] = AppVariables.OPERATOR_B;
    this.operator['C'] = AppVariables.OPERATOR_C;
    this.operator['M'] = [];


  }

  /**
   * Logout
   */
  logout() {


    localStorage.clear();
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

      let name = (typeof this.baseline[index] == 'undefined') ? "Carrier " + i : this.baseline[index].name;
      let thresholdValue = (typeof this.baseline[index] == 'undefined') ? AppVariables.TRANSPORTTHRESHOLD : this.baseline[index].thresholdValue;
      let cprValue = (typeof this.baseline[index] == 'undefined') ? AppVariables.CPR.filter(item => item.name === 'manual')[0].value : this.baseline[index].cprValue;
      let data = { 'name': name, nCells: item.nCells, chCapacity: item.chCapacity, qam: item.qam, mimo: item.mimo, mimoValue: item.mimo, thresholdValue: thresholdValue, cprValue: cprValue };
      this.baseline.push(data);
      this.onBaselineChange(item.mimo, 'mimo', index);

    });

  }
  addRow(section: any, technology: any) {
    if (section == 'Baseline') {

      if (AppVariables.CARRIER_LIMIT > this.carrier) {
        let index: any = this.carrier;
        this.carrier = +this.carrier + 1;

        if (typeof this.baseline[index] == 'undefined')
          this.baseline[index] = {};

        this.baseline[index]['name'] = 'Carrier ' + this.carrier;
        this.baseline[index]['thresholdValue'] = (typeof this.baseline[index].thresholdValue == 'undefined') ? AppVariables.TRANSPORTTHRESHOLD : this.baseline[index].thresholdValue;
        this.baseline[index]['cprValue'] = (typeof this.baseline[index].cprValue == 'undefined') ? AppVariables.CPR.filter(item => item.name === 'manual')[0].value : this.baseline[index].cprValue;
        this.baseline[index]['mimoValue'] = (typeof this.baseline[index].mimoValue == 'undefined') ? null : this.baseline[index].mimoValue;

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

      let index = carrier;
      if (AppVariables.CARRIER_LIMIT > carrier) {
        carrier = +tech[0].carrier + 1;
        this.selectedTechnologies.filter(function (el) {
          return el.name == technology;
        })[0].carrier = carrier;

        this.selectedTechnologies.filter(function (el) {
          return el.name == technology;
        })[0].carrierList = this.carrierlist.slice(0, carrier);

        if (typeof this.technology[shortname] == 'undefined')
          this.technology[shortname] = [];
        if (typeof this.technology[shortname][index] == 'undefined')
          this.technology[shortname][index] = {};


        this.technology[shortname][index]['name'] = tech[0].name + ' ' + carrier;
        this.technology[shortname][index]['thresholdValue'] = (typeof this.technology[shortname][index].thresholdValue == 'undefined') ? AppVariables.TRANSPORTTHRESHOLD : this.technology[shortname][index]['thresholdValue'];
        this.technology[shortname][index]['cprValue'] = (typeof this.technology[shortname][index].cprValue == 'undefined') ? AppVariables.CPR.filter(item => item.name === shortname)[0].value : this.technology[shortname][index]['cprValue'];
        this.technology[shortname][index]['mimoValue'] = (typeof this.technology[shortname][index].mimoValue == 'undefined') ? null : this.technology[shortname][index]['mimoValue'];

      } else {

        this.altCtrl.create({
          title: 'Alert',
          subTitle: "Maximum carrier is exceed!!",
          buttons: ['OK']
        }).present();

      }


    }


  }

  /**
   * Calculate the Cb value
   */
  getCbValue() {

    this.cb = 0;
    this.baseline.forEach((item, index) => {
      this.cb += (typeof item.ca == 'undefined') ? 0 : item.ca;
    });
    this.techCb = 0;
    this.selectedTechnologies.forEach((tech, t) => {
      this.technology[tech.shortname]['ca'] = 0;
      this.technology[tech.shortname].forEach((item, index) => {
        this.technology[tech.shortname]['ca'] += (typeof item.ca == 'undefined') ? 0 : Number(item.ca);
        this.techCb += (typeof item.ca == 'undefined') ? 0 : item.ca;
      })

    });
    this.TTPeakValue = Math.round(this.cb + this.techCb);

    this.showchart();
  }

  /**
   * All Baseline form value change event.
   */
  onBaselineChange(selectedValue: any, field: any, item: any, value?: any) {

    if (field == "name") {
      this.baseline[item].name = value;
    }
    else {
      if (typeof this.baseline[item] != 'undefined')
        this.baseline[item][field] = selectedValue;
    }

    let baseline = this.baseline[item];
    let nCells = baseline.nCells;
    let chCapacity = baseline.chCapacity
    let qam = baseline.qam;

    if (field == 'mimo') {

      this.baseline[item].mimoValue = baseline.mimo;
    }
    let mimo = (baseline.mimo != null) ? baseline.mimoValue : baseline.mimo;
    let tn = baseline.thresholdValue;
    let cpr = baseline.cprValue;
    if (nCells != null && chCapacity != null && qam != null && mimo != null) {
      this.baseline[item]['ca'] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, 'carrier', tn, cpr);
    }

    this.getCbValue();

  }
  selectedTechnology(data: any) {

    if (data.checked == true) {
      this.selectedTechnologies.push(data);

      if (typeof this.technology[data.shortname] == 'undefined')
        this.technology[data.shortname] = [];

      this.technology[data.shortname]['ca'] = ((typeof this.technology[data.shortname]['ca'] == 'undefined') ? 0 : this.technology[data.shortname]['ca']);
    } else {
      let newArray = this.selectedTechnologies.filter(function (el) {
        return el.name !== data.name;
      });
      this.selectedTechnologies = newArray;
    }
    this.getCbValue();
  }
  hideShowTechnology(data: any) {

    if (data.icon == 'md-arrow-dropup') {

      this.selectedTechnologies.filter(function (el) {
        return el.name == data.name;
      })[0].icon = 'md-arrow-dropdown';
    } else {

      this.selectedTechnologies.filter(function (el) {
        return el.name == data.name;
      })[0].icon = 'md-arrow-dropup';
    }

  }

  /**
   * All Baseline form value change event.
   */
  onEvoluationChange(selectedValue: any, field: any, carrier: any, technology: any, value?: any) {

    if (field == "name") {
      this.technology[technology][carrier][field] = value || 1;

    }
    else {
      this.technology[technology][carrier][field] = selectedValue;

    }

    let nCells = this.technology[technology][carrier]['nCells'];
    let chCapacity = this.technology[technology][carrier]['chCapacity'];
    let qam = this.technology[technology][carrier]['qam'];

    if (field == 'mimo') {
      this.technology[technology][carrier]['mimoValue'] = this.technology[technology][carrier]['mimo'];

    }
    let mimo = (this.technology[technology][carrier]['mimoValue'] != null) ? this.technology[technology][carrier]['mimoValue'] : this.technology[technology][carrier]['mimo'];
    let tn = this.technology[technology][carrier]['thresholdValue'];

    let cpr = AppVariables.CPR.filter(item => item.name === technology)[0].value;
    if (nCells != null && chCapacity != null && qam != null && mimo != null) {
      this.technology[technology][carrier]['ca'] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, technology, tn, cpr);
    }

    this.getCbValue();

  }
  upload_file(event: any) {

    let fileName = event.target.files[0].name.split('.');


    if (fileName[1].toLowerCase() == 'csv') {
      Papa.parse(event.target.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          this.inputData = results.data;


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


    objArray = JSON.parse(localStorage.getItem("Input_Data"));
    if (objArray == null) {
      this.altCtrl.create({
        title: 'Alert',
        subTitle: "Please upload the input file inorder to download the report!!",
        buttons: ['OK']
      }).present();
      return;
    }

    objArray.map(obj => {
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
      let h = i - f;
      obj["Evolution Theoritical Peak Througput (in Mbps)"] = h;
      obj["Total Theoritical Peak Throuput Required (Mbps)"] = this.TTPeakValue;
      let j = Math.round(i * utilization);
      obj["Capacity Required (in Mbps)"] = j;

      outputArray.push(obj);
    });

    let output_csv = Papa.unparse(outputArray, { header: true });


    let blob = new Blob([output_csv]);
    let a: any = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }



  advanceEdit(item: any, shortName: any = 'baseline') {
    let tn, cpr, mimo;
    if (shortName == 'baseline') {

      tn = this.baseline[item].thresholdValue;
      cpr = this.baseline[item].cprValue;
      mimo = this.baseline[item].mimoValue;

    } else {

      tn = this.technology[shortName][item]['thresholdValue'];
      cpr = this.technology[shortName][item]['cprValue'];
      mimo = this.technology[shortName][item]['mimoValue'];

    }
    let myModal = this.modalCtrl.create(AdvanceEditPage, { 'data': { tn: tn, cpr: cpr, mimo: mimo, shortName: shortName, item: item } });
    myModal.onDidDismiss(data => {

      if (data) {
        if (data.shortName == 'baseline') {

          this.baseline[item]['thresholdValue'] = data.tn;
          this.baseline[item]['cprValue'] = data.cpr;
          this.baseline[item]['mimoValue'] = data.mimo;
          this.onBaselineChange(this.baseline[item]['nCells'], 'nCells', item);
        } else {
          this.technology[shortName][item]['thresholdValue'] = data.tn;
          this.technology[shortName][item]['cprValue'] = data.cpr;
          this.technology[shortName][item]['mimoValue'] = data.mimo;
          this.onEvoluationChange(this.technology[shortName][item]['nCells'], 'nCells', item, shortName);
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


    this.baseline.forEach((item, index) => {

      let chCapacity = item.chCapacity;
      let qam = item.qam;
      let nCell = item.nCells;
      let mimoValue = item.mimo;
      let carrier = item.name;
      let ca = item.ca;
      let mimoName = AppVariables.MIMO.filter(item => item.value === mimoValue);
      let mimo = (mimoName.length > 0) ? AppVariables.MIMO.filter(item => item.value === mimoValue)[0].name : null;
      data.push({ name: carrier, sectors: nCell, channelBw: chCapacity, mimo: mimo, qam: qam, ca: ca, class: ('c-' + (index + 1)) });
      if (data.length == 4) {
        this.formData.push(data);
        data = [];
      }
    });


    this.selectedTechnologies.forEach((item, index) => {

      let techShortName = item.shortname;


      this.technology[techShortName].forEach((item, index) => {



        let chCapacity = item.chCapacity;
        let qam = item.qam;
        let nCell = item.nCells;
        let mimoValue = item.mimo;
        let carrier = item.name;
        let ca = item.ca;

        let mimoName = AppVariables.MIMO.filter(item => item.value === parseFloat(mimoValue));

        let mimo = (mimoName.length == 0) ? null : mimoName[0].name;
        if (ca > 0)
          data.push({ name: carrier, sectors: nCell, channelBw: chCapacity, mimo: mimo, qam: qam, ca: ca, class: ('c-' + techShortName) });
        if (data.length == 4) {
          this.formData.push(data);
          data = [];
        }

      });
    });

    if (data.length > 0)
      this.formData.push(data);

  }


  defineChartData() {

    this.report = [];


    this.baseline.forEach((item, index) => {

      let value = (typeof item.ca == 'undefined') ? 0 : item.ca;
      if (value > 0) {
        let technology = (typeof item.name == 'undefined') ? 'Carrier ' + (index + 1) : item.name;
        this.report.push({ technology: technology, value: value, index: (index + 1) });
      }
    });

    this.selectedTechnologies.forEach((item, index) => {


      let value = (typeof this.technology[item.shortname]['ca'] == 'undefined') ? 0 : this.technology[item.shortname]['ca'];
      let technology = item.name;

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
    var fontSize = (height / 174).toFixed(2);
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
            label: 'CSR Capacity',
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
    this.isPdf = true;
    this.pdfCss = 'e-opacity';
    let charts = [];
    var obj = this;
    if (this.formData.length <= 3) {
      let exportStackedChart = document.getElementById("exportStackedChart");

      let options = { background: "white", height: exportStackedChart.clientHeight, width: exportStackedChart.clientWidth };
      html2canvas(exportStackedChart, options).then((canvas) => {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 5, 5, 5],width:500 });
        let exportSquareChart = document.getElementById("exportSquareChart");
        let squareChartOptions = { background: "white", height: exportSquareChart.clientHeight, width: (exportSquareChart.clientWidth - 10) };

        return html2canvas(exportSquareChart, squareChartOptions);
      }).then(function (canvas) {      
        
        charts.push({ image: canvas.toDataURL(),height:canvas.height,width: canvas.width,alignment: 'center', margin: [5, 20, 5, 10], style: 'squareImage' });
        obj._epdf.generatePDF(charts);
        obj.isPdf = false;
        obj.pdfCss = '';
      })
        .catch((err) => {
          console.log("error canvas", err);

        });
    } else if (this.formData.length > 3 && this.formData.length < 10) {

      let exportStackedChart = document.getElementById("exportStackedChart");
      let options = { background: "white", height: exportStackedChart.clientHeight, width: exportStackedChart.clientWidth };
      html2canvas(exportStackedChart, options).then((canvas) => {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 5, 5, 5],width:500 });
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
          obj.isPdf = false;
          obj.pdfCss = '';
        })
        .catch((err) => {
          console.log("error canvas", err);

        });

    } else if (this.formData.length >= 10) {

      let exportStackedChart = document.getElementById("exportStackedChart");
      let options = { background: "white", height: exportStackedChart.clientHeight, width: exportStackedChart.clientWidth };
      html2canvas(exportStackedChart, options).then((canvas) => {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 5, 5, 5],width:500 });
        let exportSquareChart = document.getElementById("exportSquareChart");
        let squareChartOptions = { background: "white", height: exportSquareChart.clientHeight, width: (exportSquareChart.clientWidth - 10) };

        return html2canvas(exportSquareChart, squareChartOptions);
      }).then(function (canvas) {

        charts.push({ image: canvas.toDataURL(), alignment: 'center', margin: [5, 10, 5, 5], style: 'squareImage', pageBreak: 'after' });

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
          obj.isPdf = false;
          obj.pdfCss = '';
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

  removeRow(item: any, technology: any) {

    let alert = this.altCtrl.create({
      title: 'Confirmation!',
       subTitle: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Delete',
          handler: data => {

            if (technology == 'baseline') {
              this.baseline.splice(item, 1);
              this.carrier = +this.carrier - 1;
              this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
            } else {
              let tech = this.selectedTechnologies.filter(function (el) {
                return el.shortname == technology;
              });

              let carrier = tech[0].carrier - 1;

              this.technology[technology].splice(item, 1);
              this.selectedTechnologies.filter(function (el) {
                return el.shortname == technology;
              })[0].carrier = carrier;

              this.selectedTechnologies.filter(function (el) {
                return el.shortname == technology;
              })[0].carrierList = this.carrierlist.slice(0, carrier);

            }

            this.getCbValue();

          }
        }
      ]
    });
    alert.present();



  }



}

