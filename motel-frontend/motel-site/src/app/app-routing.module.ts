import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PostDetailComponent } from './components/post/post-detail/post-detail.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component';
import { FilterPageComponent } from './components/filter-page/filter-page.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { MyPostListComponent } from './components/profile/my-post-list/my-post-list.component';
import { AccountManagementComponent } from './components/profile/account-management/account-management.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthGuard } from './auth/authguard';
import { FavoritePostComponent } from './components/post/favorite-post/favorite-post.component';
import { SignupComponent } from './components/signup/signup.component';
import { PaymentComponent } from './components/payment/payment.component';

const routes: Routes = [
{path: 'thanh-toan', component: PaymentComponent},
  {path: 'post/:id', component: PostDetailComponent},
  {path: 'tin-yeu-thich', component: FavoritePostComponent},
  {path: 'dang-tin', component: CreatePostComponent, canActivate: [AuthGuard]},
  {path: 'filter', component: FilterPageComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'signup', component:SignupComponent},
  {path: 'trang-ca-nhan', component: ProfileComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'danh-sach-tin-dang', // child route path
        component: MyPostListComponent, // child route component that the router renders

      },
      {
        path: 'thong-tin-ca-nhan',
        component: AccountManagementComponent, // another child route component that the router renders
      },
    ],}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
