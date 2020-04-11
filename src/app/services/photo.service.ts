import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  
  constructor(private http: HttpClient) { }

  private readonly baseUrl = "http://localhost/MyPhotos/odata/Photos?";

  public getPhotos(key : string): Observable<any> {
    return this.http.get(this.baseUrl + `$filter=Tags/any(s:contains(s, '${key}'))`);
  }
}
