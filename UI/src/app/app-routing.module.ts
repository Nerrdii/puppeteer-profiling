import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemoryLeakComponent } from './memory-leak/memory-leak.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostsComponent } from './posts/posts.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'memory-leak', component: MemoryLeakComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'posts/:id', component: PostDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
