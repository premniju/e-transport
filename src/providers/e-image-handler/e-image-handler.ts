import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { EMailProvider } from '../e-mail/e-mail';
 
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as html2canvas from 'html2canvas';
import { AppVariables } from "../../config/app-variables";

/*
  Generated class for the EImageHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare let cordova: any;
@Injectable()
export class EImageHandlerProvider {

pdfObj = null;
docDefinition:any=[];
externalDataRetrievedFromServer:any=[];
  constructor(public http: HttpClient,
  private file: File,
  private fileOpener: FileOpener,
  public _email: EMailProvider,
  public socialSharing: SocialSharing,
  private plt: Platform) {
    console.log('Hello EImageHandlerProvider Provider');
    this.externalDataRetrievedFromServer = [
    { name: 'Bartek', age: 34 },
    { name: 'John', age: 27 },
    { name: 'Elizabeth', age: 30 },
];
   // console.log(this.imageToBase64('../../assets/imgs/ericsson_logo.png'));
  }
   
imageToBase64(url)
{
    var canvas, ctx, dataURL, base64;
    var img = new Image();
    img.src =url;
    img.onload = function() {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    dataURL = canvas.toDataURL("image/png");
    base64 = dataURL.replace(/^data:image\/png;base64,/, "");
    return base64;
     }
}



buildTableBody(data, columns) {
    var body = [];

  //  body.push(columns);

    data.forEach(function(row) {
        var dataRow = [];

        columns.forEach(function(column) {
            dataRow.push(row[column].toString());
        })

        body.push(dataRow);
    });

    return body;
}

table(data, columns) {
    return {
        table: {
            headerRows: 1,
            body: this.buildTableBody(data, columns)
        }
    };
}
  downloadPdf(charts:any) {
  
     
     

   
 this.docDefinition = {
      // header: function(currentPage, pageCount, pageSize) {
      //       return [
      //           { image: this.imageToBase64('../../assets/imgs/ericsson_logo.png'), height: 30, width: 100 }
      //       ]
      //   },
      content: [
        { text: 'TRANSPORT DIMENSION TOOL', style: 'header' },      
        // charts,
      //   { image: pieChart,
      // alignment: 'center',
      // fit: [400, 400] }, 
      // { image: stackedChart,
      // alignment: 'center',
      // fit: [400, 400] }, 
      // { image: barChart,
      // alignment: 'center',
      // fit: [400, 400] }, 
      // this.table(this.externalDataRetrievedFromServer, ['name', 'age'])
      

       
 
        //{ text: "Simple PDF", style: 'story', margin: [0, 20, 0, 20] } 
       
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        },
        image:{
          alignment: 'center',
          fit: [400, 400],
          // width: '400px',           
          margin: [10, 10, 10, 10],
          // padding:[20,20,20,20]
        },
        squareImage:{
          alignment: 'center',
          //fit: [300, 300],
           width: '300px',           
          margin: [10, 10, 10, 10],
          // padding:[20,20,20,20]
        }
      }
    }
charts.forEach((item, index) => {
//console.log(this.docDefinition.content.)
this.docDefinition.content.push(item);
});
 
      this.pdfObj = pdfMake.createPdf(this.docDefinition);

        if (this.plt.is('cordova')) {
              this.pdfObj.getBuffer((buffer) => {
                var blob = new Blob([buffer], { type: 'application/pdf' });        
                // Save the PDF to the data Directory of our App
                this.file.writeFile(this.file.dataDirectory, 'eReport.pdf', blob, { replace: true }).then(fileEntry => {
                 
                  // Open the PDf with the correct OS tools
                 this.fileOpener.open(this.file.dataDirectory + 'eReport.pdf', 'application/pdf');
                }).catch(err => {
                console.log('Directory doesn\'t exist');
                console.log(err);
              });
              });
        } else {
          // On a browser simply use download!
         
       this.pdfObj.download("eReport.pdf");
        }
           
      
    }

  generatePDF() {
    const div = document.getElementById("exportthis");
    const options = { background: "white", height: div.clientHeight, width: div.clientWidth };
    html2canvas(div, options).then((canvas) => {
      var data = canvas.toDataURL();
      var docDefinition = {
        content: [{
          image: data,
          width: 300,
        }]
      };
      let attach = pdfMake.createPdf(docDefinition).download("Score_Details.pdf");;
      // attach.getBuffer((buffer) => {
      //   var blob = new Blob([buffer], { type: 'application/pdf' });
      //   console.log(cordova.file.dataDirectory);

      //   let filePath:any = "F:\\xampp\\htdocs\\e-transport\\download\\";
        // Save the PDF to the data Directory of our App
//         this.file.writeFile(filePath, 'eReport.pdf', blob, { replace: true }).then(fileEntry => {
//  console.log("File created");
//           // Open the PDf with the correct OS tools
//           this.fileOpener.open(filePath + 'eReport.pdf', 'application/pdf');
//         }).catch(err => {
//                 console.log('Directory doesn\'t exist');
//                 console.log(err);
//               });
       // let attach = "F:\\xampp\\htdocs\\e-transport\\download\\eReport.pdf";
        // let attachments = attach.split(':');

        // attachments[0] ='';
        // let attachment =  attachments.join("");
        // console.log(attachment);

      //   this._email.sendMail(AppVariables.EXECUTIVE_EMAIL, AppVariables.EXECUTIVE_EMAIL, AppVariables.EXECUTIVE_EMAIL, attach, AppVariables.EMAIL_SUBJECT, null);
      // });

      //   .download("Score_Details.pdf");
   });
  }


    

}
