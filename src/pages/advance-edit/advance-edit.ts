import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController  } from 'ionic-angular';

/**
 * Generated class for the AdvanceEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-advance-edit',
  templateUrl: 'advance-edit.html',
})
export class AdvanceEditPage {
data: string;
  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public viewCtrl: ViewController) {
    this.data = navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdvanceEditPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  save(){
     this.viewCtrl.dismiss(this.data);
  }

}
