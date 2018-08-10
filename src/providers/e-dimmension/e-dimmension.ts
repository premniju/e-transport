import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the EDimmensionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EDimmensionProvider {

  constructor(public http: HttpClient) {
    console.log('Hello EDimmensionProvider Provider');
  }

  generateCa(chCapacity: any, qam: any, mimo: any, nCells: any = 1, technology: any = 'carrier', tn: any = 1.17,cellPeak:any=150) {

   // console.log("Inside CA",cellPeak);
    //let tn=1.17; //Transport overhead
    //let cellPeak = 150;
    let spEfficiency = mimo ? mimo : 0; //Spectrum Efficiency

    switch (technology) {
      case 'laa':
        //cellPeak = 1121;
        spEfficiency = 0.88 * mimo;
        break;
      case 'smallCell':
        //cellPeak = 900;
        spEfficiency = 1.25 * mimo;
        break;
      case 'massiveMimo':
        //cellPeak = 150;
        spEfficiency = 2.7 * mimo;
        break;
      case 'fwa':
        //cellPeak = 50;
        spEfficiency = 1 * mimo;
        break;
      case 'embb':
        //cellPeak = 900;
        spEfficiency = 3.0 * mimo;
        break;
      default:
        //cellPeak = 150;
        spEfficiency = mimo ? mimo : 0;
        break;

    }
    console.log(technology)

    //let nCells=3; //Number of cells under DU/Baseband

    let bw = chCapacity; // Band Width
    let mean = spEfficiency * bw; // Mean throughput in loaded network scenario
    let std = 0.6 * mean; //Standard deviation of the throughput distribution
    let k = 1.28; //factor to get certain percentile of throughput distribution

  //TNOH *Max{CellPeak;nCells *Mean K *Std *Mean* *√nCells }
  let Ca = Math.round(tn*Math.max(cellPeak, (nCells*mean+k*std*Math.sqrt(nCells))));
return Ca;
  }

}
