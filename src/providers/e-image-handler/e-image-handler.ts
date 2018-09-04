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
  docDefinition: any = [];
  externalDataRetrievedFromServer: any = [];
  constructor(public http: HttpClient,
    private file: File,
    private fileOpener: FileOpener,
    public _email: EMailProvider,
    public socialSharing: SocialSharing,
    private plt: Platform) {
    console.log('Hello EImageHandlerProvider Provider');

  }

  downloadPdf(charts: any) {




    this.docDefinition = {

      content: [
        { text: 'TRANSPORT DIMENSION TOOL', style: 'header' },
        charts,
        {
          image: charts,
          alignment: 'center',
          fit: [400, 400]
        }
      ],
      unbreakable: true,
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
        image: {
          alignment: 'center',
          fit: [400, 400],
          margin: [10, 10, 10, 10],
        },
        squareImage: {
          alignment: 'center',
          margin: [2, 2, 2, 2]
        }
      }
    }  
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

  generatePDF(charts:any) {
   



    this.docDefinition = {

      content: [
        { text: 'TRANSPORT DIMENSION TOOL', style: 'header' },
        charts,
        {
          image: charts,
          alignment: 'center',
          fit: [400, 400]
        }
      ],
      unbreakable: true,
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
        image: {
          alignment: 'center',
          fit: [400, 400],
          margin: [10, 10, 10, 10],
        },
        squareImage: {
          alignment: 'center',
          margin: [2, 2, 2, 2]
        }
      }
    }
    charts.forEach((item, index) => {
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




}
