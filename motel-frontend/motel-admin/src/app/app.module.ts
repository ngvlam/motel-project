import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/fragments/sidebar/sidebar.component';
import { HeaderComponent } from './components/fragments/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostManagementComponent } from './components/post/post-management/post-management.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostListComponent } from './components/post/post-list/post-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { PostDetailComponent } from './components/post/post-detail/post-detail.component';
import { FilterPostComponent } from './components/post/filter-post/filter-post.component';
import { ToastrModule } from 'ngx-toastr';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { UserEditProfileComponent } from './components/user/user-edit-profile/user-edit-profile.component';
import { UserCreateNewComponent } from './components/user/user-create-new/user-create-new.component';
import { UserChangePassComponent } from './components/user/user-change-pass/user-change-pass.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortDirective } from './directive/sort.directive';
import { NgxFileDropModule } from 'ngx-file-drop';
import { LoginComponent } from './components/fragments/login/login.component';
import { LogoutComponent } from './components/fragments/logout/logout.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ViolateComponent } from './components/violate/violate.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { CookieService } from 'ngx-cookie-service';
import { AccessDeniedComponent } from './components/error/access-denied/access-denied.component';
import { AuthInterceptor } from './auth/intercept/AuthInterceptor';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { LoginLayoutComponent } from './components/login-layout/login-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
    PostManagementComponent,
    PostListComponent,
    ConfirmationModalComponent,
    PostDetailComponent,
    FilterPostComponent,
    UserListComponent,
    UserDetailComponent,
    UserEditProfileComponent,
    UserCreateNewComponent,
    SortDirective,
    UserChangePassComponent,
    LoginComponent,
    LogoutComponent,
    ActivityComponent,
    ViolateComponent,
    AccessDeniedComponent,
    MainLayoutComponent,
    LoginLayoutComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    GoogleMapsModule,
    NgxFileDropModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
