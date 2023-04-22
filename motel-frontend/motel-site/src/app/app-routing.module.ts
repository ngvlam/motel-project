import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PostDetailComponent } from './components/post/post-detail/post-detail.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component';

const routes: Routes = [

  {path: 'post/:id', component: PostDetailComponent},
  {path: 'dang-tin', component: CreatePostComponent},
  
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
