import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, interval, Observable, of } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const users: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: 2,
    firstName: 'Sally',
    lastName: 'Mae',
  },
  {
    id: 3,
    firstName: 'Chris',
    lastName: 'Williams',
  },
];

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private value$: Observable<number>;

  constructor(private http: HttpClient) {
    this.value$ = interval(1000);
  }

  getValue(): Observable<number> {
    return this.value$;
  }

  getUsers(): Observable<User[]> {
    return of(users);
  }

  getUser(id: number): Observable<User> {
    return from(users).pipe(first((user) => user.id === id));
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
  }
}
