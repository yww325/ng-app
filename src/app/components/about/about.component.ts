import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { select, Store } from "@ngrx/store";
import { UserState } from "src/app/store/reducers/user.reducer";
import { loginUser, logoutUser } from "src/app/store/actions/user.actions";
import { selectLoginState } from "src/app/store/selectors/user.selectors";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent {
  sub: Subscription;
  hide = true;
  password: string = null;

  loginState$ = this._store.pipe(select(selectLoginState));

  constructor(private _store: Store<UserState>) {}

  login(event): void {
    if (event.currentTarget.innerText === "Logout") {
      this._store.dispatch(logoutUser());
    } else {
      this._store.dispatch(loginUser({ password: this.password }));
    }
  }
}
