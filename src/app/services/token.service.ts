import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Md5 } from "ts-md5/dist/md5";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Store } from "@ngrx/store";
import { UserState } from "../store/reducers/user.reducer";
import { loginStateChange } from "../store/actions/user.actions";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  private readonly baseUrl =
    (environment.production ? "" : "http://localhost") +
    environment.apiPath +
    "/api/v1/Default/validate";
  constructor(private http: HttpClient, private _store: Store<UserState>) {
    let token = this.getToken();
    switch (token) {
      case "unauthorized":
        this._store.dispatch(loginStateChange({ newState: "unauthorized" }));
        break;
      case "":
        this._store.dispatch(loginStateChange({ newState: "loggedout" }));
        break;
      default:
        this._store.dispatch(loginStateChange({ newState: "loggedin" }));
    }
  }

  public setToken(data: string): void {
    if (data === undefined || data === null || data === "") {
      this.setLocalStorageToken(""); //log out
      this._store.dispatch(loginStateChange({ newState: "loggedout" }));
      return;
    }

    // md5Value =  Md5.hashStr(data) as string;
    this.http
      .get(this.baseUrl + `?userPass=${data}`, { responseType: "text" })
      .subscribe(
        (hasedValue) => {
          this.setLocalStorageToken(hasedValue);
          this._store.dispatch(loginStateChange({ newState: "loggedin" }));
        },
        (err) => {
          this.setLocalStorageToken("unauthorized"); // password not authorized
          this._store.dispatch(loginStateChange({ newState: "unauthorized" }));
        }
      );
  }

  private setLocalStorageToken(token: string): void {
    window.localStorage["token"] = token;
  }

  public getToken(): string {
    var data = window.localStorage["token"];
    if (data === undefined || data === null || data === "") {
      return "";
    }
    return data;
  }
}
