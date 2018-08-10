import { Component } from '@angular/core';
import { NavController, App, Platform, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { EDimmensionProvider } from "../../providers/e-dimmension/e-dimmension";
import { ChartPage } from '../chart/chart';
import { AppVariables } from "../../config/app-variables";

const NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  public imageUrl: any;
  public customer: string = "ATT";
  public carrier: number = 0;
  public selectedCarrierList: any = [];
  public tab: string = 'baseline';
  public technology: string = '';
  public customClass: string = null;
  public technologyList: any = [];
  public cb: any = 0;
  public formElements: any = [];
  public selectedTechnology: any = [];
  public customerList: any = AppVariables.OPERATOR;
  public carrierlist: any = AppVariables.NCARRIERS;
  public config: any = null;
  public nCellsList: any = AppVariables.NCELLS;
  public qamList: any = AppVariables.QAM;
  public channelCapacityList: any = AppVariables.CHANNEL_CAPACITY;
  public mimoList: any = AppVariables.MIMO;
  public colors: any = [];
  public showDetails: Boolean = false;
  public operator: any = [];
  public tn: any = 1.17;
  public unregisterBackButtonAction: any;

  public cpr: any = 150;
  public cprList: any = AppVariables.CPR;


  constructor(public navCtrl: NavController,
    public app: App,
    private plt: Platform,
    private _eDim: EDimmensionProvider,
    private altCtrl: AlertController) {
    this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    // pre-load operator configuration information.
    this.operator['Option A'] = AppVariables.OPERATOR_A;
    this.operator['Option B'] = AppVariables.OPERATOR_B;
    this.operator['Option C'] = AppVariables.OPERATOR_C;

    this.operator['Manual'] = [];

    // define the dafult carriers
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {
      this.formElements['nCells_' + i] = null;
      this.formElements["chCapacity_" + i] = null;
      this.formElements['qam_' + i] = null;
      this.formElements['mimo_' + i] = null;
      this.formElements['ca_' + i] = 0;
      this.formElements['cprValue_' + i] = this.cpr;
    }
    // define the default technology ca;
    this.formElements['ca_laa'] = 0;

    // technology input information
    this.technologyList = [
      {
        name: "Manual", shortname: "manual", fields: [{
          label: "No of Radios",
          name: "nCells_",
          type: '1',
          options: this.nCellsList
        }, {
          label: "Channel BW",
          name: "chCapacity_",
          type: 2
        }, {
          label: "MIMO",
          name: "mimo_",
          type: 1,
          options: this.mimoList
        }, {
          label: "QAM",
          name: "qam_",
          type: 1,
          options: this.qamList
        }
        ]
      }, {
        name: "LAA", shortname: "laa", fields: [{
          label: "No of Radios",
          name: "nCells_",
          type: '1',
          options: this.nCellsList
        }, {
          label: "Channel BW",
          name: "chCapacity_",
          type: 1,
          options: this.channelCapacityList
        }, {
          label: "MIMO",
          name: "mimo_",
          type: 1,
          options: this.mimoList
        }, {
          label: "QAM",
          name: "qam_",
          type: 1,
          options: this.qamList
        }
        ]
      },
      {
        name: "5G Small cell", shortname: "smallCell", fields: [{
          label: "No of Radios",
          name: "nCells_",
          type: 1,
          options: this.nCellsList
        }, {
          label: "Channel BW",
          name: "chCapacity_",
          type: 1,
          options: this.channelCapacityList
        }, {
          label: "MIMO",
          name: "mimo_",
          type: 1,
          options: this.mimoList
        }, {
          label: "QAM",
          name: "qam_",
          type: 1,
          options: this.qamList
        }
        ]
      },
      {
        name: "Massive MIMO", shortname: "massiveMimo", fields: [{
          label: "No of Radios",
          name: "nCells_",
          type: 1,
          options: this.nCellsList
        }, {
          label: "MIMO",
          name: "mimo_",
          type: 1,
          options: [{ value: 5.57, name: '32 MIMO' }, { value: 10.4, name: '64 MIMO' }]
        }, {
          label: "Channel BW",
          name: "chCapacity_",
          type: 1,
          options: this.channelCapacityList
        }]
      },
      {
        name: "FWA", shortname: "fwa", fields: [{
          label: "No of Radios",
          name: "nCells_",
          type: 1,
          options: this.nCellsList
        },
        // {
        //     label: "Band",
        //     type: 2,
        //     options: null
        //   }, 
        {
          label: "Channel BW",
          name: "chCapacity_",
          type: 2,
          options: null
        }, {
          label: "MIMO",
          name: "mimo_",
          type: 1,
          options: this.mimoList
        }
          // , {
          //   label: "Cell Peak",
          //   type: 2,
          //   options: null
          // }
        ]
      },
      {
        name: "eMBB", shortname: "embb", fields: [{
          label: "No of Radios",
          name: "nCells_",
          type: 1,
          options: this.nCellsList
        },
        // {
        //     label: "Band",
        //     type: 2,
        //     options: null
        //   },
        {
          label: "Channel BW",
          name: "chCapacity_",
          type: 2,
          options: null
        }, {
          label: "MIMO",
          name: "mimo_",
          type: 1,
          options: this.mimoList
        }
          // , {
          //   label: "Cell Peak",
          //   type: 2,
          //   options: null
          // }
        ]
      }
    ];

    let temp = this.technology;
    this.selectedTechnology = this.technologyList.filter(function (obj) {
      return (temp.indexOf(obj.name) > -1);
    });


    this.selectedTechnology.forEach((item, index) => {
      let shortName = item.shortname;
      let selectedCarrier = [];
      if (typeof this.formElements['selectedcarrier_' + shortName] != 'undefined') {
        selectedCarrier = this.formElements['selectedcarrier_' + shortName];
      }

      for (var c = 1; c < (selectedCarrier.length + 1); c++) {
        this.formElements['icon' + c + '_' + shortName] = "add-circle";
        this.formElements['advanceEditBtn' + c + '_' + shortName] = "Advance Edit";
        this.formElements['advanceEditIcon' + c + '_' + shortName] = "ios-create-outline";
        this.formElements['thresholdValue_' + c + '_' + shortName] = (typeof this.formElements['thresholdValue_' + c + '_' + shortName] == 'undefined') ? 1.17 : this.formElements['thresholdValue_' + c + '_' + shortName];
      }
    });

    this.customClass = (this.plt.is('core') || this.plt.is('mobileweb')) ? "browser-view" : null;

  }
  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
  }
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.plt.registerBackButtonAction(function (event) {
      console.log('Prevent Back Button Page Change');
    }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
  }

  /**
   * Logout
   */
  logout() {
    let nav = this.app.getRootNav();
    nav.setRoot(LoginPage);

  }


  /**
   * load the operator default configuration
   */
  loadOperator(operator) {
    console.log("asdasd");
    this.carrier = this.operator[operator].length;
    this.onCarrierChange(this.carrier);
    this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    this.operator[operator].forEach((item, index) => {
      let i = index + 1;
      this.formElements['nCells_' + i] = item.nCells;
      this.formElements['chCapacity_' + i] = item.chCapacity;
      this.formElements['qam_' + i] = item.qam;
      this.formElements['mimo_' + i] = item.mimo;
      this.formElements['mimoValue_' + i] = this.formElements['mimo_' + i];
      this.formElements['cprValue_' + i] = item.cpr;
      this.onChange(item.mimo, 'mimo_', i);

    });

  }
  /**
   * Load the pre configure information on customer change 
   */
  onCustomerChange(operator: any) {
    this.reset();
    this.loadOperator(operator);
    this.getCbValue();

  }
  /**
   * Reset the form values.
   */
  reset() {
    this.formElements = [];
  }
  /**
   * Define the default value on carrier change;
   */
  onCarrierChange(selectedValue: any) {

    this.selectedCarrierList = this.carrierlist.slice(0, this.carrier);
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {

      this.formElements['thresholdValue_' + i] = (typeof this.formElements['thresholdValue_' + i] == 'undefined') ? this.tn : this.formElements['thresholdValue_' + i];
      this.formElements['isShow' + i] = false;
      this.formElements['icon' + i] = 'add-circle';
      this.formElements['advanceEditBtn' + i] = "Advance Edit";
      this.formElements['advanceEditIcon' + i] = "ios-create-outline";
      this.formElements['eTnValue_' + i] = (typeof this.formElements['eTnValue_' + i] == 'undefined') ? this.tn : this.formElements['eTnValue_' + i];
      this.formElements['eMimoValue_' + i] = (typeof this.formElements['eMimoValue_' + i] == 'undefined') ? this.formElements['mimo_' + i] : this.formElements['eMimoValue_' + i];

      this.formElements['cprValue_' + i] = (typeof this.formElements['cprValue_' + i] == 'undefined') ? this.cpr : this.formElements['cprValue_' + i];
      /*console.log(typeof this.formElements['cprValue_' + i]);
      console.log(this.cpr);
      console.log(this.formElements['cprValue_' + i]);*/
      this.formElements['ca_' + i] = (typeof this.formElements['ca_' + i] == 'undefined') ? 0 : this.formElements['ca_' + i];
    }

    this.getCbValue();

  }
  /**
   * Load the pre configuration information on technology carrier change.
   */
  onTechCarrierChange(selectedValue: any, technology: any) {
    let carrier = this.formElements['carrier_' + technology];
    this.formElements['selectedcarrier_' + technology] = this.carrierlist.slice(0, carrier);
    for (var i = 1; i < (this.formElements['selectedcarrier_' + technology].length + 1); i++) {
      this.formElements['ca_' + i + "_" + technology] = (typeof this.formElements['ca_' + i + '_' + technology] == 'undefined') ? 0 : this.formElements['ca_' + i + '_' + technology];
      this.formElements['isShow' + i + '_' + technology] = false;
      this.formElements['icon' + i + '_' + technology] = "add-circle";
      this.formElements['advanceEditBtn' + i + '_' + technology] = "Advance Edit";
      this.formElements['advanceEditIcon' + i + '_' + technology] = "ios-create-outline";
      this.formElements['eMimoValue_' + i + '_' + technology] = (typeof this.formElements['eMimoValue_' + i + '_' + technology] == 'undefined') ? this.formElements['mimo_' + i + '_' + technology] : this.formElements['eMimoValue_' + i + '_' + technology];
      this.formElements['eTnValue_' + i + '_' + technology] = (typeof this.formElements['eTnValue_' + i + '_' + technology] == 'undefined') ? this.tn : this.formElements['eTnValue_' + i + '_' + technology];
      this.formElements['thresholdValue_' + i + '_' + technology] = (typeof this.formElements['thresholdValue_' + i + '_' + technology] == 'undefined') ? this.tn : this.formElements['thresholdValue_' + i + '_' + technology];
      this.formElements['cprValue_' + i + '_' + technology] = (typeof this.formElements['cprValue_' + i + '_' + technology] == 'undefined') ? this.cpr : this.formElements['cprValue_' + i + '_' + technology];

    }
    this.getCbValue();
  }
  /**
   * All Baseline form value change event.
   */
  onChange(selectedValue: any, field: any, item: any) {
    this.formElements[field + item] = selectedValue;
    let nCells = this.formElements['nCells_' + item];
    let chCapacity = this.formElements['chCapacity_' + item];
    let qam = this.formElements['qam_' + item];

    if (field == 'mimo_') {
      this.formElements['mimoValue_' + item] = this.formElements['mimo_' + item];
    }
    let mimo = (this.formElements['mimoValue_' + item] != null) ? this.formElements['mimoValue_' + item] : this.formElements['mimo_' + item];
    let tn = this.formElements['thresholdValue_' + item];
    let cpr = this.formElements['cprValue_' + item];
    if (nCells != null && chCapacity != null && qam != null && mimo != null) {
      this.formElements['ca_' + item] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, tn, cpr);
    }
    this.getCbValue();

  }

  /**
   * Load the technology default form elements.
   */
  onTechnologySelect(selectedValue: any) {

    let temp = this.technology;
    this.selectedTechnology = this.technologyList.filter(function (obj) {
      return (temp.indexOf(obj.name) > -1);
    });

    this.selectedTechnology.forEach((item, index) => {
      let shortName = item.shortname;
      this.formElements['icon' + shortName] = "add-circle";
      this.formElements['advanceEditBtn' + shortName] = "Advance Edit";
      this.formElements['advanceEditIcon' + shortName] = "ios-create-outline";
      //  this.formElements['thresholdValue_' + shortName] = (typeof this.formElements['thresholdValue_' + shortName] == 'undefined') ? 1.17 : this.formElements['thresholdValue_' + shortName];
      this.formElements['ca_' + shortName] = (typeof this.formElements['ca_' + shortName] == 'undefined') ? 0 : this.formElements['ca_' + shortName];
    });
    this.getCbValue();
  }

  /**
   * Evolution form element changes.
   */
  onEvolutionChange(selectedValue: any, fieldModel: any, technology: any, carrier: any) {

    this.formElements[fieldModel + carrier + '_' + technology] = selectedValue;

    let nCells = this.formElements['nCells_' + carrier + '_' + technology];
    let chCapacity = this.formElements['chCapacity_' + carrier + '_' + technology];
    let qam = this.formElements['qam_' + carrier + '_' + technology];

    if (fieldModel == 'mimo_') {
      this.formElements['mimoValue_' + carrier + '_' + technology] = this.formElements['mimo_' + carrier + '_' + technology];
    }
    let mimo = (this.formElements['mimoValue_' + carrier + '_' + technology] != null) ? this.formElements['mimoValue_' + carrier + '_' + technology] : this.formElements['mimo_' + carrier + '_' + technology];
    let tn = this.formElements['thresholdValue_' + carrier + '_' + technology];
    let cpr = this.formElements['cprValue_' + carrier + '_' + technology] = (technology == null) ? this.cpr : this.cprList.filter(item => item.name === technology)[0].value;;

    if (nCells != null && chCapacity != null && mimo != null) {
      this.formElements['ca_' + carrier + "_" + technology] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, technology, tn);
      this.getCbValue();
    }
  }
  /**
   * Calculate the Cb value
   */
  getCbValue() {

    this.cb = 0;
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {
      this.cb += (typeof this.formElements['ca_' + i] == 'undefined') ? 0 : this.formElements['ca_' + i]
    }

    this.selectedTechnology.forEach((item, index) => {
      this.formElements['ca_' + item.shortname] = 0;
      let selectedCarrier = (typeof this.formElements['selectedcarrier_' + item.shortname] != "undefined") ? this.formElements['selectedcarrier_' + item.shortname] : [];
      for (var c = 1; c < (selectedCarrier.length + 1); c++) {
        this.formElements['ca_' + item.shortname] += (typeof this.formElements['ca_' + c + "_" + item.shortname] == 'undefined') ? 0 : this.formElements['ca_' + c + "_" + item.shortname];

        this.cb += (typeof this.formElements['ca_' + c + "_" + item.shortname] == 'undefined') ? 0 : this.formElements['ca_' + c + "_" + item.shortname];
      }
    });
    console.log(this.formElements)
  }
  /**
   * Load the chart report
   */
  loadChart() {

    let report = [];
    let isValueExist = 0;
    for (var i = 1; i < (this.selectedCarrierList.length + 1); i++) {

      // let color = this.colors['carrier_' + i];
      // let hover = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
      let value = (typeof this.formElements['ca_' + i] == 'undefined') ? 0 : this.formElements['ca_' + i];
      let technology = 'Carrier ' + i;

      if (value > 0) {
        isValueExist++;
      }
      report.push({ technology: technology, value: value });
    }

    this.selectedTechnology.forEach((item, index) => {
      // let color = this.colors['technology_' + item.shortname];
      // let hover = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
      let value = (typeof this.formElements['ca_' + item.shortname] == 'undefined') ? 0 : this.formElements['ca_' + item.shortname];
      let technology = item.name;
      if (value > 0) {
        isValueExist++;
      }
      report.push({ technology: technology, value: value });
    });

    if (isValueExist > 1) {
      this.navCtrl.push(ChartPage, { 'report': report });
    } else {

      this.altCtrl.create({
        title: 'Alert',
        subTitle: "Minimum two carriers / technology infomartion is required to view graph!!",
        buttons: ['OK']
      }).present();
    }


  }
  /**
   * Form Hide/Show toggle 
   */
  toggleDetails(item: any, technology: any = null) {

    let add = (technology) ? ('_' + technology) : '';
    if (this.formElements['isShow' + item + add]) {
      this.formElements['isShow' + item + add] = false;
      this.formElements['icon' + item + add] = 'add-circle';
      this.formElements['isShowAdvanceEditable' + item + add] = false;
      this.formElements['advanceEditBtn' + item + add] = "Advance Edit";
      this.formElements['advanceEditIcon' + item + add] = "ios-create-outline";

    } else {
      this.formElements['isShow' + item + add] = true;
      this.formElements['icon' + item + add] = 'remove-circle';
    }
  }
  /**
   * Advance Edit/Save Toggle
   */
  toggleAdvanceEditable(item: any, technology: any = null) {

    let add = (technology) ? ('_' + technology) : '';

    if (this.formElements['isShowAdvanceEditable' + item + add]) {
      console.log("here1");
      this.formElements['isShowAdvanceEditable' + item + add] = false;
      //this.formElements['isShow' + item + add] = false;
      //this.formElements['icon' + item + add] = 'add-circle';
      this.formElements['advanceEditBtn' + item + add] = "Advance Edit";
      this.formElements['advanceEditIcon' + item + add] = "ios-create-outline";

      this.formElements['eMimoValue_' + item + add] = this.formElements['mimoValue_' + item + add];

      this.formElements['eTnValue_' + item + add] = this.formElements['thresholdValue_' + item + add];

     // this.formElements['cprValue_' + item + add] = this.formElements['cprValue_' + item + add];

      this.updateCa(item,technology);
    } else {

      this.formElements['advanceEditBtn' + item + add] = "Save";
      this.formElements['advanceEditIcon' + item + add] = "md-checkmark";
      this.formElements['isShowAdvanceEditable' + item + add] = true;
      //this.formElements['isShow' + item + add] = true;
      //  this.formElements['icon' + item + add] = 'remove-circle';
      this.formElements['mimoValue_' + item + add] = (this.formElements['eMimoValue_' + item + add] == null) ? this.formElements['mimo_' + item + add] : this.formElements['eMimoValue_' + item + add];
      this.formElements['thresholdValue_' + item + add] = this.formElements['eTnValue_' + item + add];
      if (this.formElements['cprValue_' + item + add] == null) {
        this.formElements['cprValue_' + item + add] = (technology == null) ? this.cpr : this.cprList.filter(item => item.name === technology)[0].value;
      }

      //let item1 = cprList.filter(item => item.name === technology)[0];
      //console.log("sdfsdf",item1.value);

    }
  }
  /**
   * Update the Ca values
   */
  updateCa(item: any, technology: any = null) {
    let add = (technology) ? ('_' + technology) : '';
    let concatStr = item + add
    let nCells = this.formElements['nCells_' + concatStr];
    let chCapacity = this.formElements['chCapacity_' + concatStr];
    let qam = this.formElements['qam_' + concatStr];

    let mimo = (this.formElements['mimoValue_' + concatStr] != null) ? this.formElements['mimoValue_' + concatStr] : this.formElements['mimo_' + concatStr];
    let tn = this.formElements['thresholdValue_' + concatStr];
    let cpr = this.formElements['cprValue_' + concatStr];
    if (nCells != null && chCapacity != null && qam != null && mimo != null) {
      this.formElements['ca_' + concatStr] = this._eDim.generateCa(chCapacity, qam, mimo, nCells, technology, tn, cpr);
<<<<<<< HEAD

=======
>>>>>>> a01fcefe75362fbb19f564de215252ccb3e6de60
    }
    this.getCbValue();
    //this.formElements['cprValue_' + concatStr] = cpr;
  }
  /**
   * Number form field vaildation
   */
  public onKeyUp(event: any) {

    let newValue = event.target.value;
    let regExp = new RegExp(NUMBER_REGEXP);

    if (!regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
    }
  }




}
