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
    attachment: any,
    subject: string,
    body: string): void {
    //console.log(attachment)

let base64parts = attachment.split(',');
base64parts[0] = 'base64:report.png//';
let compatableAttachment =  base64parts.join("");
console.log(compatableAttachment)
body = "<p>Hello world</p>";
console.log(body)
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
            body: body,//'<img src="'+attachment+'"></img></body>',
            isHtml: true

          };

          // Send a text message using default options
          this.emailComposer.open(email).then(null, function () {
            console.log("sd")
   // user cancelled email
 });
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
