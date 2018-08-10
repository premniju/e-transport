import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { EMailProvider } from '../../providers/e-mail/e-mail';
import {EImageHandlerProvider} from "../../providers/e-image-handler/e-image-handler";

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

   public pieChartEl                : any;
   public barChartEl                : any;
   public lineChartEl               : any;
   public chartLabels               : any    = [];
   public chartValues               : any    = [];
   public chartColours              : any    = [];
   public chartHoverColours         : any    = [];
   public chartLoading            : any;
   public colors:any=[];
   public report: any =[];
  constructor(public navCtrl: NavController,
  public _email: EMailProvider,
  public _image: EImageHandlerProvider, 
  public navParams: NavParams) {
    console.log(this.navParams.data);
   this.report = this.navParams.data.report;

    // color code for the charts
    this.colors['Carrier 1'] = '#FFC939';
    this.colors['Carrier 2'] = '#F6702E';
    this.colors['Carrier 3'] = '#F26762';
    this.colors['Carrier 4'] = '#760C16';
    this.colors['Carrier 5'] = '#EF3529';
    this.colors['Carrier 6'] = '#0A0740';
    this.colors['LAA'] = '#0072A8';
    this.colors['5G Small cell'] = '#438F9D';
    this.colors['Massive MIMO'] = '#E91E63';
    this.colors['FWA'] = '#01673F';
    this.colors['eMBB'] = '#7030A2';
    this.colors['Manual'] = '#28A745';
    
  }

  ionViewDidLoad() {
 this.defineChartData();
  this.createPieChart();
}
defineChartData()
{
      let k : any;

      for(k in this.report)
      {
       
        var tech  =      this.report[k];
        

         this.chartLabels.push(tech.technology);
         this.chartValues.push(tech.value);
         this.chartColours.push(this.colors[tech.technology]);
        // this.chartHoverColours.push(tech.hover);
      }
     
   }

createPieChart()
{

   this.pieChartEl 				= 	new Chart(this.pieChart.nativeElement,
   {
      type: 'pie',
      data: {
         labels: this.chartLabels,
         datasets: [{
            label                 : 'Daily Technology usage',
            data                  : this.chartValues,
            duration              : 2000,
            easing                : 'easeInQuart',
            backgroundColor       : this.chartColours,
            //hoverBackgroundColor  : this.chartHoverColours
         }]
      },
      options : {
         maintainAspectRatio: false,
         layout: {
            padding: {
               left     : 50,
               right    : 0,
               top      : 0,
               bottom   : 0
            }
         },
         animation: {
            duration : 5000
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
  

}
