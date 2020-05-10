import { Injectable } from '@angular/core'; 
import { Observable, Subject } from 'rxjs'; 
import {Md5} from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly baseUrl = (environment.production ?"" :"http://localhost") + "/MyPhotos/api/v1/Default/validate";
  constructor(private http: HttpClient) { }

  AuthenticationChanged = new Subject<string>();

  public setToken(data: string) : void {     
      if (data === undefined || data === null || data === '') {  
        this.setLocalStorageToken(''); //log out
        return;
      }  

      // md5Value =  Md5.hashStr(data) as string;
      this.http.get(this.baseUrl+`?userPass=${data}`,{responseType: 'text'}).subscribe(
        hasedValue =>{
          this.setLocalStorageToken(hasedValue);
        }, err=>{
          this.setLocalStorageToken('unauthorized'); // not authorized
        }
      );  
  }

  private setLocalStorageToken(token : string) :void {
    window.localStorage['token'] = token;
    this.AuthenticationChanged.next(this.getToken())
  }

  public getToken(): string {
      var data =  window.localStorage['token']; 
      if (data === undefined || data === null || data === '') {
        return '';
      }
      return data;
    }
 
}
