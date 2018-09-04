import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { EMailProvider } from '../../providers/e-mail/e-mail';
import {EImageHandlerProvider} from "../../providers/e-image-handler/e-image-handler";
import { AppVariables } from "../../config/app-variables";
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

/**
 * Generated class for the ChartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})
export class ChartPage {
  @ViewChild('pieChart') pieChart;

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
  fileName:string;
  constructor(public navCtrl: NavController,
    public _email: EMailProvider,
    public _image: EImageHandlerProvider,
    public navParams: NavParams,
    private file:File,
    private fileOpener : FileOpener) {

    this.report = this.navParams.data.report;


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

    let data = [];
    for (let i = 1; i <= this.navParams.data.formdata.selectedCarrier; i++) {

      let chCapacity = this.navParams.data.formdata["chCapacity_" + i];
      let qam = this.navParams.data.formdata["qam_" + i];
      let nCell = this.navParams.data.formdata["nCells_" + i];
      let mimoValue = this.navParams.data.formdata["mimo_" + i];
      let carrier = "Carrier " + i;
      let ca = this.navParams.data.formdata["ca_" + i];

      let mimo = AppVariables.MIMO.filter(item => item.value === mimoValue)[0].name;
      data.push({ name: carrier, sectors: nCell, channelBw: chCapacity, mimo: mimo, qam: qam, ca: ca, class: ('c-' + i) });
      if (data.length == 2) {
        this.formData.push(data);
        data = [];
      }
    }

    if (this.navParams.data.formdata['selectedTechnologies']) {
      for (let s = 0; s < this.navParams.data.formdata['selectedTechnologies'].length; s++) {

        let techShortName = this.navParams.data.formdata.selectedTechnologies[s].shortname;
        let technology = this.navParams.data.formdata.selectedTechnologies[s].name;

        if (this.navParams.data.formdata['selectedcarrier_' + techShortName]) {

          for (let t = 1; t <= this.navParams.data.formdata['selectedcarrier_' + techShortName].length; t++) {

            let chCapacity = this.navParams.data.formdata["chCapacity_" + t + "_" + techShortName];
            let qam = this.navParams.data.formdata["qam_" + t + "_" + techShortName];
            let nCell = this.navParams.data.formdata["nCells_" + t + "_" + techShortName];
            let mimoValue = this.navParams.data.formdata["mimo_" + t + "_" + techShortName];
            let carrier = "Carrier " + t + " " + technology;
            let ca = this.navParams.data.formdata["ca_" + t + "_" + techShortName];
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
    console.log(this.formData)
  }

  ionViewDidLoad() {
    this.defineChartData();
    this.createPieChart();
  }
  defineChartData() {
    let k: any;

    for (k in this.report) {

      var tech = this.report[k];


      this.chartLabels.push(tech.technology);
      this.chartValues.push(tech.value);
      this.chartColours.push(this.colors[tech.technology]);
      // this.chartHoverColours.push(tech.hover);
    }

  }

  createPieChart() {

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
            //hoverBackgroundColor  : this.chartHoverColours
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
            display: true,
            position: 'bottom',
            fullWidth: true,
            onClick: () => {}, //prevent filter by default
            labels: {
                  generateLabels: (chart) => {

                    chart.legend.afterFit = function () {
                     // var width = this.width; 


                      this.lineWidths = this.lineWidths.map( () => this.width-12 );

                       this.options.labels.padding = 5;
                      this.options.labels.boxWidth = 10;
                    };

                    var data = chart.data;

                    if (data.labels.length && data.datasets.length) {
                      return data.labels.map((label, i) => {
                        var meta = chart.getDatasetMeta(0);
                        var ds = data.datasets[0];
                        var arc = meta.data[i];
                        var custom = arc && arc.custom || {};
                        var getValueAtIndexOrDefault = this.getValueAtIndexOrDefault;
                        var arcOpts = chart.options.elements.arc;
                        var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                        var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                        var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                        console.log(label)
                        return {
                          text: label,
                          fillStyle: fill,
                          strokeStyle: stroke,
                          lineWidth: bw,
                        //  hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

                          // Extra data used for toggling the correct item
                          index: i
                        };
                      });
                    }
                    return [];
                  }
            }
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

  /**
   * Download the PDF Report
   */
  download() {

    let dataBlob = this._image.downloadPdf(this.pieChartEl.toBase64Image());

  }

  /**
   * Send Mail
   */
  send() {
    this._image.downloadPdf(this.pieChartEl.toBase64Image());

  }

  generatePdf(){
    const div = document.getElementById("Html2Pdf");
    const options = {background:"white",height :div.clientHeight , width : div.clientWidth  };
    html2canvas(div,options).then((canvas)=>{
      //Initialize JSPDF
      var doc = new jsPDF("p","mm","a4");
      //Converting canvas to Image
      let imgData = canvas.toDataURL("image/PNG");
      //Add image Canvas to PDF
      doc.addImage(imgData, 'PNG', 20,20 );
      let pdfOutput = doc.output();
      let buffer = new ArrayBuffer(pdfOutput.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < pdfOutput.length; i++) {
          array[i] = pdfOutput.charCodeAt(i);
      }


      //This is where the PDF file will stored , you can change it as you like
      // for more information please visit https://ionicframework.com/docs/native/file/
      const directory = this.file.dataDirectory ;

      //Name of pdf
      const fileName ="eReport.pdf";

      var blob = new Blob([buffer], { type: 'application/pdf' });    
      
      //Writing File to Device
      // this.file.writeFile(this.file.dataDirectory,fileName,blob)
      // .then((success) => {
      //   console.log("File created Succesfully" + JSON.stringify(success));
      //   //open File
      //   //success.nativeURL
      //   this.fileOpener.open(this.file.dataDirectory + fileName, "application/pdf")
      //   .then((success) =>{
      //     console.log("File Opened Succesfully" + JSON.stringify(success));
      //   })
      //   .catch((error)=> console.log("Cannot Open File " +JSON.stringify(error))); 
        
        
      // })
      // .catch((error)=> console.log("Cannot Create File " +JSON.stringify(error)));


     // this.pdfObj.getBuffer((buffer) => {
                var blob = new Blob([buffer], { type: 'application/pdf' });        
                // Save the PDF to the data Directory of our App
                this.file.writeFile(this.file.dataDirectory, 'eReport.pdf', blob, { replace: true }).then(fileEntry => {
                 
                  // Open the PDf with the correct OS tools
                 this.fileOpener.open(this.file.dataDirectory + 'eReport.pdf', 'application/pdf');
                })
             // });
  
  
    });
  }
checkFile(){
    //check if file exist on device
    const directory = this.file.externalApplicationStorageDirectory  ;
    const fileName = this.fileName + ".pdf";
    this.file.checkFile(directory,fileName)
    .then((success)=> console.log("PDF file exsit : " + JSON.stringify(success)))
    .catch((error)=> console.log("Cannot find Pdf file : " +JSON.stringify(error)));
  }

}
