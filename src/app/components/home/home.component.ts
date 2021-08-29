import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { loadUsers } from "../../store/actions/user.actions";
import { selectUsersInfo } from "src/app/store/selectors/user.selectors";
import { UserState } from "src/app/store/reducers/user.reducer";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  h1Style: boolean = true;
  users$ = this._store.pipe(select(selectUsersInfo));

  constructor(private _store: Store<UserState>) {}

  ngOnInit() {
    this._store.dispatch(loadUsers());
  }

  firstClick() {
    this.h1Style = !this.h1Style;
  }
}
