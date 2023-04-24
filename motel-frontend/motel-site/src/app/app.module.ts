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
import { HttpClientModule } from '@angular/common/http';
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
    MapsSearchComponent
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
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
