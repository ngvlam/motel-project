import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostManagementComponent } from './components/post/post-management/post-management.component';
import { PostDetailComponent } from './components/post/post-detail/post-detail.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { UserEditProfileComponent } from './components/user/user-edit-profile/user-edit-profile.component';
import { UserChangePassComponent } from './components/user/user-change-pass/user-change-pass.component';
import { UserCreateNewComponent } from './components/user/user-create-new/user-create-new.component';
import { LoginComponent } from './components/fragments/login/login.component';
import { LogoutComponent } from './components/fragments/logout/logout.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ViolateComponent } from './components/violate/violate.component';
import { AuthGuard } from './auth/authguard';
import { RoleGuard } from './auth/roleguard';
import { AccessDeniedComponent } from './components/error/access-denied/access-denied.component';
import { LoginLayoutComponent } from './components/login-layout/login-layout.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {requireRole: ['ROLE_ADMIN', 'ROLE_MODERATOR']}},

  {path: 'posts', component: PostManagementComponent, canActivate: [AuthGuard, RoleGuard], data: {requireRole: ['ROLE_ADMIN', 'ROLE_MODERATOR'] }},
  {path: 'posts', data: {breadcrumb: 'Quản lý bài đăng', title: 'Danh sách bài đăng', requireRole: ['ROLE_ADMIN', 'ROLE_MODERATOR'] },
      canActivateChild: [AuthGuard, RoleGuard],
      
        children: [
          {path: ':id/detail', component: PostDetailComponent, data: {breadcrumb: 'Chi tiết bài đăng', title: 'Chi tiết bài đăng'}}
        ]
  },
  
  {path: 'users', component: UserListComponent,
  canActivate: [AuthGuard, RoleGuard], data: {requireRole: ['ROLE_ADMIN'] }},
      {path: 'users',
        data: {breadcrumb: 'Quản lý người dùng', title: 'Danh sách người dùng', requireRole: ['ROLE_ADMIN'] },
        canActivateChild: [AuthGuard, RoleGuard],
        children: [
          {path: ':id/detail', component: UserDetailComponent, data: {breadcrumb: 'Thông tin cá nhân', title: 'Thông tin người dùng'}},
          {path: ':id/detail', data: {breadcrumb: 'Thông tin cá nhân', title: 'Thông tin người dùng'},
            children: [
              {path: 'edit', component: UserEditProfileComponent, data: {breadcrumb: 'Chỉnh sửa thông tin', title: 'Chỉnh sửa thông tin người dùng'}},
              {path: 'security', component: UserChangePassComponent, data: {breadcrumb: 'Bảo mật tài khoản', title: 'Thay đổi mật khẩu'}}
            ]},
          {path: 'add', component: UserCreateNewComponent, data: {breadcrumb: 'Tạo mới người dùng', title: 'Tạo mới người dùng'}}
        ]
      },

  {path: 'activity', component: ActivityComponent, canActivate: [AuthGuard, RoleGuard], data: {requireRole: ['ROLE_ADMIN'] }},
  {path: 'violate', component: ViolateComponent, canActivate: [AuthGuard, RoleGuard], data: {requireRole: ['ROLE_ADMIN', 'ROLE_MODERATOR'] }},
  
  {path: 'login', component: LoginComponent, data: { layout: LoginLayoutComponent } },
  {path: 'logout', component: LogoutComponent},
  {path: 'access-denied', component: AccessDeniedComponent, data: {layout: LoginLayoutComponent}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
