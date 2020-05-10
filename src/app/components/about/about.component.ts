import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Subscription } from 'rxjs';
 

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  sub : Subscription;
  hide = true;
  showMessage = false;
  loggedIn = false;
  password: string = null;

  constructor(private tokenService : TokenService) { }

  ngOnDestroy(): void {
     this.sub.unsubscribe();
  }

  ngOnInit(): void {
    let token = this.tokenService.getToken();
    this.loggedIn =  token !== '' && token !== 'unauthorized';
    this.sub = this.tokenService.AuthenticationChanged.subscribe(t=>{
      if (t === 'unauthorized') {
        this.showMessage = true; 
      }
      else {
        this.showMessage = false;
        this.loggedIn = t !== '';
      } 
    }) 
  } 
  login(): void { 
    if (this.loggedIn) {
      this.tokenService.setToken('');  
    } else {
      this.tokenService.setToken(this.password);
  
    } 
  } 
}
