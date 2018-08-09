import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVariables } from "../../config/app-variables";

/*
  Generated class for the EAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EAuthProvider {

  constructor(public http: HttpClient) {
    console.log('Hello EAuthProvider Provider');
  }

  validateEAuth(credentials) {
   return new Promise((resolve, reject) => {     

		 
		 if(credentials.username=="admin" && credentials.password=="1qazZAQ!"){
				resolve({success:true,user:{ username:credentials.username,password:credentials.password}});
		 }else{
  		reject({message:"Invalid user credentials!"});
		 }
		/*
		let headers= new HttpHeaders();   
    headers = headers
		.append('Access-Control-Allow-Origin', '*')
		.append('Authorization',  "Bearer " + AppVariables.APP_TOKEN)
		.append('Access-Control-Allow-Methods' , 'POST, GET, OPTIONS, PUT')
		.append('Content-Type',  'application/json; charset=utf-8');

			this.http.post(AppVariables.EAUTH_URL, credentials, { headers : headers} ).subscribe(res => {
					console.log(res);
					   resolve(res);
					   },
					(err) => {
					console.log(err);
					  reject(err);
				});
				 */
				});

}

}
