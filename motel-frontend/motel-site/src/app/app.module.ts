import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PostDetailComponent } from './components/post/post-detail/post-detail.component';
import { FilterComponent } from './components/filter/filter.component';
import { FilterPageComponent } from './components/filter-page/filter-page.component';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreatePostComponent } from './components/post/create-post/create-post.component';
import { ReportModalComponent } from './components/report-modal/report-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FooterComponent } from './components/layout/footer/footer.component';
import { Select2Module } from 'ng-select2-component';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './directives/onlynumber.directive';
import { ToastrModule } from 'ngx-toastr';
import { MapsSearchComponent } from './components/maps-search/maps-search.component';
import { MyPostListComponent } from './components/profile/my-post-list/my-post-list.component';
import { AccountManagementComponent } from './components/profile/account-management/account-management.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { SidebarComponent } from './components/profile/sidebar/sidebar.component';
import { ConfirmationModalComponent } from './components/confirmation-modal-common/modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './auth/intercept/AuthInterceptor';
import { CookieService } from 'ngx-cookie-service';
import { LogoutComponent } from './components/logout/logout.component';
import { PhoneHidePipe } from './pipe/phone-hide.pipe'; // import the pipe here
import { PostItemComponent } from './components/post/post-item/post-item.component';
import { FavoritePostComponent } from './components/post/favorite-post/favorite-post.component';
import { SideBarFilterComponent } from './components/layout/side-bar-filter/side-bar-filter.component';
import { SignupComponent } from './components/signup/signup.component';
import { PaymentComponent } from './components/payment/payment.component';
import { TestNotComponent } from './components/test-not/test-not.component';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { NotificationManagementComponent } from './components/profile/notification-management/notification-management.component';
import { EditPostComponent } from './components/post/edit-post/edit-post.component';
import { ChatComponent } from './components/chat/chat.component';
import { DepositComponent } from './components/profile/deposit/deposit.component';
import { PaymentResultComponent } from './components/profile/payment-result/payment-result.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { ThousandsSeparatorPipe } from './pipe/thousands-separator.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostDetailComponent,
    FilterComponent,
    FilterPageComponent,
    HomeComponent,
    CreatePostComponent,
    ReportModalComponent,
    FooterComponent,
    NumbersOnlyDirective,
    MapsSearchComponent,
    MyPostListComponent,
    AccountManagementComponent,
    ProfileComponent,
    SidebarComponent,
    ConfirmationModalComponent,
    LoginComponent,
    LogoutComponent,
    PostItemComponent,
    FavoritePostComponent,
    SideBarFilterComponent,
    SignupComponent,
    PaymentComponent,
    PhoneHidePipe,
    TimeAgoPipe,
    ThousandsSeparatorPipe,
    TestNotComponent,
    NotificationManagementComponent,
    EditPostComponent,
    ChatComponent,
    DepositComponent,
    PaymentResultComponent,
    PaymentHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Select2Module,
    CommonModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    GoogleMapsModule,
    TooltipModule.forRoot(),
    ToastrModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    BsModalRef,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
