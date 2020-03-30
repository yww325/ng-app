import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromUser from '../../store/reducers/user.reducer';
import { loadUsers } from '../../store/actions/user.actions';
import { selectUsersInfo } from 'src/app/store/selectors/user.selectors';
import { catchError, map, concatMap } from 'rxjs/operators';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  h1Style : boolean = true;
  users$ = this._store.pipe(select(selectUsersInfo));

  constructor(private _store: Store<fromUser.State>) { }

  ngOnInit() {
    this._store.dispatch(loadUsers())
  }

  firstClick()
  {
    this.h1Style = !this.h1Style;
  }
}
