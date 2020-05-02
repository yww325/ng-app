import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  
  constructor(private http: HttpClient) { }

  private readonly baseUrl = (environment.production ?"" :"http://localhost") + "/MyPhotos/odata/v1/Photos?";

  public getPhotos(tag : string, mediaType:string, top: number, skip : number, paths : string[]): Observable<any> {  
    let url = this.baseUrl + `$filter=Tags/any(s:contains(s, '${tag}')) and mediaType eq '${mediaType}'&$top=${top}&$skip=${skip}&$count=true&$orderby=dateTaken`;
    return this.http.get(url);
  }
}
