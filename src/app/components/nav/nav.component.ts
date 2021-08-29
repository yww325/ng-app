import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { UserState } from "src/app/store/reducers/user.reducer";
import { selectLoginState } from "src/app/store/selectors/user.selectors";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit {
  appTitle: string = "MyPhotos";
  loginState$ = this._store.pipe(select(selectLoginState));

  constructor(private _store: Store<UserState>) {}

  ngOnInit() {}
}
