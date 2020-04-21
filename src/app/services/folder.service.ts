import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Folder } from '../models/folder';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  private readonly baseUrl = (environment.production ?"" :"http://localhost") + "/MyPhotos/odata/Folders";
  
  public getFolders(): Observable<Folder[]> {  
    return this.http.get<Folder[]>(this.baseUrl);
  }

}
