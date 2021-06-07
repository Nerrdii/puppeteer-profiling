import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AppService, User } from '../services/app.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  public user$: Observable<User>;

  constructor(private route: ActivatedRoute, private appService: AppService) {
    this.user$ = new Observable();
  }

  ngOnInit(): void {
    this.user$ = this.route.params.pipe(
      switchMap((params) => this.appService.getUser(+params['id']))
    );
  }
}
