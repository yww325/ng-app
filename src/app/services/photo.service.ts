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
  private readonly privateUrl = (environment.production ?"" :"http://localhost") + "/MyPhotos/api/v1/Default/private?";
  private readonly privateByIdUrl = (environment.production ?"" :"http://localhost") + "/MyPhotos/api/v1/Default/privateById?";  

  public getPhotos(tag : string, top: number, skip : number, paths : string[]): Observable<any> {  
    const reducer = (accumulator, currentValue) => accumulator + ` or startswith(Path, '${currentValue}')`;
    let startWithPaths = paths.length ==0 ? "" : ` and (${paths.reduce(reducer,"").substring(4)})`;
    let url = this.baseUrl + `$filter=Tags/any(s:contains(s, '${tag}'))${startWithPaths}&$top=${top}&$skip=${skip}&$count=true&$orderby=Path,dateTaken`;
    return this.http.get(url);
  }

  public markPrivate(path: string): Observable<any>  {
    return this.http.patch(this.privateUrl + `path=${path}`, null, {responseType: 'text'});
  }

  public markPublic(path: string): Observable<any>  {
    return this.http.patch(this.privateUrl + `path=${path}&toPrivate=false`, null, {responseType: 'text'});
  }

  public markPrivateById(id: string): Observable<any>  {
    return this.http.patch(this.privateByIdUrl + `id=${id}`, null, {responseType: 'text'});
  }

  public markPublicById(id: string): Observable<any>  {
    return this.http.patch(this.privateByIdUrl + `id=${id}&toPrivate=false`, null, {responseType: 'text'});
  }
}
