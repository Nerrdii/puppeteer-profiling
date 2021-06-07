import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService, User } from '../services/app.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  public users$: Observable<User[]>;

  constructor(private appService: AppService) {
    this.users$ = new Observable();
  }

  ngOnInit(): void {
    this.users$ = this.appService.getUsers();
  }
}
