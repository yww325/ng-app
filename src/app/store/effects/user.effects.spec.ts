import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { UserEffects } from './user.effects';
import { DataService } from 'src/app/services/data.service';
import { HttpClientModule } from '@angular/common/http';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        UserEffects, DataService,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(UserEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
