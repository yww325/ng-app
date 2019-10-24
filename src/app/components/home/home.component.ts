import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:  [ DataService ]
})
export class HomeComponent implements OnInit {

  h1Style : boolean = true;
  users: Object;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.getJSON().subscribe(data => {
      this.users = data
      console.log(this.users);
    }
  );
  }

  firstClick()
  {
    this.h1Style = !this.h1Style;
  }
}
