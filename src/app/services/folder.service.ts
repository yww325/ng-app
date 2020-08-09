import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { Folder } from '../models/folder';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  private readonly odataUrl = (environment.production ?"" :"http://localhost") + environment.apiPath + "/odata/v1/Folders";
  private readonly apiUrl = (environment.production ?'' :'http://localhost') + environment.apiPath + '/api/v1/Folders';
  
  public getFolders(): Observable<Folder[]> {  
    return this.http.get<Folder[]>(this.odataUrl);
  }

  public createNewFolder(parentFolderId : string, newFolderName: string): Observable<any> {  
    return this.http.put(this.apiUrl+`?parentFolderId=${parentFolderId}&folderName=${newFolderName}`, null, {responseType: 'text'});
    // ob.pipe(map(a=>{
    //     console.log(a);
    //   }),
    //   catchError(err=>{
    //     console.log(err);
    //     return throwError(err);
    //   })
    // );
  }

}
