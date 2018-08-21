import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';

/*
  Generated class for the EMailProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EMailProvider {

  constructor(public http: HttpClient,
    public emailComposer: EmailComposer) {
    console.log('Hello EMailProvider Provider');
  }

  sendMail(to: string,
    cc: string,
    bcc: string,
    attachment: string,
    subject: string,
    body: string): void {
    
let filename         = 'report.png';
    let base64parts = attachment.split(',');
base64parts[0] = "base64:" + filename + "//";
let compatableAttachment =  base64parts.join("");
console.log(compatableAttachment)
    this.emailComposer.isAvailable().then((available: boolean) => {


      this.emailComposer.hasPermission()
        .then((isPermitted: boolean) => {
          let email = {
            app 			: 'mailto',
            to: to,
            cc: cc,
            bcc: bcc,
            attachments: [
              compatableAttachment
            ],
            subject: subject,
            body: body,
            isHtml: true

          };

          // Send a text message using default options
          this.emailComposer.open(email);
        }).catch((error: any) => {
          console.log('No access permission granted');
          console.dir(error);
        });




    }).catch((error: any) => {
      console.log('User does not appear to have device e-mail account');
      console.dir(error);
    });


  }
}
