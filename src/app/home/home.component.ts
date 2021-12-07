import { Component, OnInit } from '@angular/core';
import { User } from '../_models/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  users: User[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }
 
}
