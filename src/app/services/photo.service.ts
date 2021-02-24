import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PhotoService {
  constructor(private http: HttpClient) {}

  private readonly odataUrl =
    (environment.production ? "" : "http://localhost") +
    environment.apiPath +
    "/odata/v1/Photos";
  private readonly apiUrl =
    (environment.production ? "" : "http://localhost") +
    environment.apiPath +
    "/api/v1/Photos";
  private readonly privateUrl = this.apiUrl + "/private?";
  private readonly privateByIdUrl = this.apiUrl + "/privateById?";

  public getPhotos(
    tag: string,
    top: number,
    skip: number,
    paths: string[]
  ): Observable<any> {
    const reducer = (accumulator: string, currentValue: string) =>
      accumulator +
      ` or startswith(Path, '${encodeURIComponent(
        this.escapeQuote(currentValue)
      )}')`;
    const startWithPaths =
      paths.length === 0
        ? ""
        : ` and (${paths.reduce(reducer, "").substring(4)})`;
    const url =
      this.odataUrl +
      `?$filter=Tags/any(s:contains(s, '${tag}'))${startWithPaths}&$top=${top}&$skip=${skip}&$count=true&$orderby=Path,dateTaken`;
    return this.http.get(url);
  }

  private escapeQuote(input: string): string {
    return input.replace("'", "''");
  }

  public markPrivate(path: string): Observable<any> {
    return this.http.patch(this.privateUrl + `path=${path}`, null, {
      responseType: "text",
    });
  }

  public markPublic(path: string): Observable<any> {
    return this.http.patch(
      this.privateUrl + `path=${path}&toPrivate=false`,
      null,
      { responseType: "text" }
    );
  }

  public markPrivateById(id: string): Observable<any> {
    return this.http.patch(this.privateByIdUrl + `id=${id}`, null, {
      responseType: "text",
    });
  }

  public markPublicById(id: string): Observable<any> {
    return this.http.patch(
      this.privateByIdUrl + `id=${id}&toPrivate=false`,
      null,
      { responseType: "text" }
    );
  }

  public updateTags(id: string, newTags: string[]): Observable<any> {
    return this.http.patch(
      this.odataUrl + `?key=${id}`,
      { tags: newTags },
      { responseType: "text" }
    );
  }

  public movePhotos(photoIds: string[], folderId: string): Observable<any> {
    return this.http.patch(
      this.apiUrl + `/move?folderId=${folderId}`,
      photoIds,
      { responseType: "text" }
    );
  }
}
