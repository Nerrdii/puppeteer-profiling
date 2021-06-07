import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppService, Post } from '../services/app.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  post$: Observable<Post> = new Observable();

  constructor(private route: ActivatedRoute, private appService: AppService) {}

  ngOnInit(): void {
    this.post$ = this.route.params.pipe(
      switchMap((params) => this.appService.getPost(+params['id']))
    );
  }
}
