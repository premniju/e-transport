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

/*
  Generated class for the EImageHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
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
  downloadPdf(b64Data) {
  
      
      //TODO:: Download Image

            //   let contentType = '';
            //   let sliceSize = 512;

            // b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

            //   let byteCharacters = atob(b64Data);
            //   let byteArrays = [];

            //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            //     let slice = byteCharacters.slice(offset, offset + sliceSize);
          
            //     let byteNumbers = new Array(slice.length);
            //     for (let i = 0; i < slice.length; i++) {
            //         byteNumbers[i] = slice.charCodeAt(i);
            //     }
          
            //     let byteArray = new Uint8Array(byteNumbers);
            //     byteArrays.push(byteArray);
            //   }

            //   let blob = new Blob(byteArrays, {type: contentType});

            //   let urlCreator = window.URL
            //   const a = document.createElement('a');
            //   let url = urlCreator.createObjectURL(blob);
            //   console.log(url)
           
              // a.href = urlCreator.createObjectURL(blob);
              // a.download = "report.png";
              // document.body.appendChild(a);
              // a.click();

   
 this.docDefinition = {
      // header: function(currentPage, pageCount, pageSize) {
      //       return [
      //           { image: this.imageToBase64('../../assets/imgs/ericsson_logo.png'), height: 30, width: 100 }
      //       ]
      //   },
      content: [
        { text: 'TRANSPORT DIMENSION TOOL', style: 'header' },      

        { image: b64Data,
      alignment: 'center',
      fit: [400, 400] }, 
      this.table(this.externalDataRetrievedFromServer, ['name', 'age'])
      

       
 
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
          width: '400px',           
          margin: [0, 20, 0, 20]
        }
      }
    }


 
      this.pdfObj = pdfMake.createPdf(this.docDefinition);
//       this.pdfObj.getDataUrl((dataUrl) => {


//        // Share via email
// this.socialSharing.shareViaEmail('Body', 'Subject', [dataUrl]).then(() => {
//   // Success!
// }).catch((err) => {
//   // Error!
//   console.log(err)
// });
//          //   this._email.sendMail("nijanthan.p@lnttechservices.com", "nijanthan.p@lnttechservices.com", "nijanthan.p@lnttechservices.com",dataUrl, "Hii", "Hello Niju");
//             console.log(dataUrl)
            
//       });
        if (this.plt.is('cordova')) {
              this.pdfObj.getBuffer((buffer) => {
                var blob = new Blob([buffer], { type: 'application/pdf' });        
                // Save the PDF to the data Directory of our App
                this.file.writeFile(this.file.dataDirectory, 'eReport.pdf', blob, { replace: true }).then(fileEntry => {
                 
                  // Open the PDf with the correct OS tools
                 this.fileOpener.open(this.file.dataDirectory + 'eReport.pdf', 'application/pdf');
                })
              });
        } else {
          // On a browser simply use download!
         
       this.pdfObj.download("eReport.pdf");
        }
           
      
    }


    

}
