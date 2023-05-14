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
import { TestNotComponent } from './components/test-not/test-not.component';
import { NotificationManagementComponent } from './components/profile/notification-management/notification-management.component';
import { ChatComponent } from './components/chat/chat.component';
import { DepositComponent } from './components/profile/deposit/deposit.component';
import { PaymentResultComponent } from './components/profile/payment-result/payment-result.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { EditPostComponent } from './components/post/edit-post/edit-post.component';

const routes: Routes = [
{path: 'thanh-toan', component: PaymentComponent},
{path: 'a', component: TestNotComponent},
  {path: 'post/:id', component: PostDetailComponent},
  {path: 'tin-yeu-thich', component: FavoritePostComponent},
  {path: 'dang-tin', component: CreatePostComponent, canActivate: [AuthGuard]},
  {path: 'post/:id/sua-tin', component: EditPostComponent, canActivate: [AuthGuard]},
  {path: 'filter', component: FilterPageComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'signup', component:SignupComponent},
  {path: 'chat', component: ChatComponent},
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
      {
        path: 'thong-bao',
        component: NotificationManagementComponent
      },

      {
        path: 'nap-tien',
        component: DepositComponent
      },

      {
        path: 'ket-qua-thanh-toan',
        component: PaymentResultComponent
      },

      {
        path: 'lich-su-thanh-toan',
        component: PaymentHistoryComponent
      }
    ],}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
