export const AppVariables = {
  EAUTH_URL: "http://192.168.34.237:3500/auth",
  APP_TOKEN: "V4Z0miz5nybWlzAzSQ",
  NCARRIERS: [1, 2, 3, 4, 5, 6],
  NCELLS: [{ value: 1, name: 1 }, { value: 2, name: 2 }, { value: 3, name: 3 }],
  QAM: [{ value: 64, name: '64 QAM' }, { value: 256, name: '256 QAM' }],
  CHANNEL_CAPACITY: [{ value: 5, name: 5 }, { value: 10, name: 10 }, { value: 15, name: 15 }, { value: 20, name: 20 }, { value: 40, name: 40 }, { value: 60, name: 60 }, { value: 80, name: 80 }],
  MIMO: [{ value: 1.73, name: '2x2 MIMO' }, { value: 2.25, name: '4x2 MIMO' }, { value: 3.15, name: '4x4 MIMO' }, { value: 5.57, name: '32 MIMO' }, { value: 10.4, name: '64 MIMO' }],
  CPR: [{ value: 1121, name: 'laa' }, { value: 900, name: 'smallCell' }, { value: 150, name: 'massiveMimo' }, { value: 50, name: 'fwa' }, { value: 900, name: 'embb' }, { value: 150, name: 'default' }, { value: 150, name: 'manual' }],
  OPERATOR: ['Manual', 'Option A', 'Option B', 'Option C'],
  OPERATOR_A: [{
      carrier: 1,
      nCells: 3,
      chCapacity: 15,
      qam: 64,
      mimo: 1.73
    }, {
        carrier: 2,
        nCells: 3,
        chCapacity: 20,
        qam: 64,
        mimo: 1.73
      }, {
        carrier: 3,
        nCells: 3,
        chCapacity: 15,
        qam: 64,
        mimo: 3.15
      }, {
        carrier: 4,
        nCells: 3,
        chCapacity: 10,
        qam: 64,
        mimo: 3.15
      }, {
        carrier: 5,
        nCells: 3,
        chCapacity: 15,
        qam: 64,
        mimo: 3.15
      }, {
        carrier: 6,
        nCells: 3,
        chCapacity: 10,
        qam: 64,
        mimo: 3.15
      }
    ],
  OPERATOR_B: [{
      carrier: 1,
      nCells: 3,
      chCapacity: 10,
      qam: 64,
      mimo: 1.73
    }, {
        carrier: 2,
        nCells: 3,
        chCapacity: 20,
        qam: 64,
        mimo: 1.73
      }, {
        carrier: 3,
        nCells: 3,
        chCapacity: 10,
        qam: 64,
        mimo: 3.15
      }, {
        carrier: 4,
        nCells: 3,
        chCapacity: 15,
        qam: 64,
        mimo: 3.15
      }, {
        carrier: 5,
        nCells: 3,
        chCapacity: 5,
        qam: 64,
        mimo: 3.15
      }
    ],
  OPERATOR_C: [{
      carrier: 1,
      nCells: 3,
      chCapacity: 10,
      qam: 64,
      mimo: 1.73
    }, {
        carrier: 2,
        nCells: 3,
        chCapacity: 20,
        qam: 64,
        mimo: 1.73
      }, {
        carrier: 3,
        nCells: 3,
        chCapacity: 10,
        qam: 64,
        mimo: 3.15
      }
  ],
    EXECUTIVE_EMAIL: "nijanthan.p@lnttechservices.com",
    EMAIL_SUBJECT: "Transport Capacity Dimensioning - Report",
}

// technology input information
export const AppVariables_Tech = {
  TECHNOLOGY_LIST: [
    {
      name: "Manual", shortname: "manual", fields: [{
        label: "No of Radios",
        name: "nCells_",
        type: '1',
        options: AppVariables.NCELLS//this.nCellsList
      }, {
        label: "Channel BW",
        name: "chCapacity_",
        type: 2
      }, {
        label: "MIMO",
        name: "mimo_",
        type: 1,
        options: AppVariables.MIMO//this.mimoList
      }, {
        label: "QAM",
        name: "qam_",
        type: 1,
        options: AppVariables.QAM// this.qamList
      }
      ]    
    }, {
      name: "LAA", shortname: "laa", fields: [{
        label: "No of Radios",
        name: "nCells_",
        type: '1',
        options: AppVariables.NCELLS// this.nCellsList
      }, {
        label: "Channel BW",
        name: "chCapacity_",
        type: 1,
        options: AppVariables.CHANNEL_CAPACITY// this.channelCapacityList
      }, {
        label: "MIMO",
        name: "mimo_",
        type: 1,
        options: AppVariables.MIMO// this.mimoList
      }, {
        label: "QAM",
        name: "qam_",
        type: 1,
        options: AppVariables.QAM// this.qamList
      }
      ]
    },
    {
      name: "5G Small cell", shortname: "smallCell", fields: [{
        label: "No of Radios",
        name: "nCells_",
        type: 1,
        options: AppVariables.NCELLS //this.nCellsList
      }, {
        label: "Channel BW",
        name: "chCapacity_",
        type: 1,
        options: AppVariables.CHANNEL_CAPACITY// this.channelCapacityList
      }, {
        label: "MIMO",
        name: "mimo_",
        type: 1,
        options: AppVariables.MIMO// this.mimoList
      }, {
        label: "QAM",
        name: "qam_",
        type: 1,
        options: AppVariables.QAM// this.qamList
      }
      ]
    },
    {
      name: "Massive MIMO", shortname: "massiveMimo", fields: [{
        label: "No of Radios",
        name: "nCells_",
        type: 1,
        options: AppVariables.NCELLS// this.nCellsList
      }, {
        label: "MIMO",
        name: "mimo_",
        type: 1,
        options: [{ value: 5.57, name: '32 MIMO' }, { value: 10.4, name: '64 MIMO' }]
      }, {
        label: "Channel BW",
        name: "chCapacity_",
        type: 1,
        options: AppVariables.CHANNEL_CAPACITY// this.channelCapacityList
      }]
    },
    {
      name: "FWA", shortname: "fwa", fields: [{
        label: "No of Radios",
        name: "nCells_",
        type: 1,
        options: AppVariables.NCELLS// this.nCellsList
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
        options: AppVariables.MIMO// this.mimoList
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
        options: AppVariables.NCELLS// this.nCellsList
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
        options: AppVariables.MIMO// this.mimoList
      }
        // , {
        //   label: "Cell Peak",
        //   type: 2,
        //   options: null
        // }
      ]
    }
  ]
}
