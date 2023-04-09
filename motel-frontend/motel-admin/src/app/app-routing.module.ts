import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostManagementComponent } from './components/post/post-management/post-management.component';
import { PostDetailComponent } from './components/post/post-detail/post-detail.component';

const routes: Routes = [
  {path: 'posts', component: PostManagementComponent},
  {path: 'posts', data: {breadcrumb: 'Quản lý bài đăng', title: 'Danh sách bài đăng'},
        children: [
          {path: ':id/detail', component: PostDetailComponent, data: {breadcrumb: 'Chi tiết bài đăng', title: 'Chi tiết bài đăng'}}
        ]
  },
  {path: '', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
