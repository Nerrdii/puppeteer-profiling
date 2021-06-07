import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService, Post } from '../services/app.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  posts$: Observable<Post[]> = new Observable();

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.posts$ = this.appService.getPosts();
  }
}
