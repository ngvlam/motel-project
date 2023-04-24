import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MapGeocoder } from '@angular/google-maps';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Page } from 'src/app/model/page';
import { SearchForm } from 'src/app/model/searchForm';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-maps-search',
  templateUrl: './maps-search.component.html',
  styleUrls: ['./maps-search.component.css']
})
export class MapsSearchComponent implements OnInit{
  @Input() isActive: boolean = false;
  @Output() closeModalEvent = new EventEmitter();

  searchForm: SearchForm = new SearchForm();

  page: Page<any> = new Page<any>();

  marker = {
    position: {
      lat: 0,
      lng: 0
    },
    options: {
      draggable: true
    } 
  }

  radius = 0;
  addressGroup: FormGroup = new FormGroup( {
    address: new FormControl('')
  })

  toNumber() {
    this.radius = +this.radius
  }

  zoom = 15;
  center = {
      lat: 21.037376869189334,
      lng: 105.77866948660191
  };

  priceRange!: undefined;
  acreageRange!: undefined;


  constructor(private postService: PostService, 
    private router: Router,
    private geocoder: MapGeocoder) {}

  ngOnInit(): void {
    this.marker.position = this.center  
        //Delay cập nhật google từ địa chỉ
    this.addressGroup.controls['address'].valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.updateLatLngFromAddress()
    })
  }

  // Cập nhật google map
  updateLatLngFromAddress() {
    this.geocoder.geocode({ address: this.addressGroup.value.address }).subscribe((results) => {
      // if (results.length > 0) {
      //   this.center = {
      //     lat: results[0].geometry.location.lat(),
      //     lng: results[0].geometry.location.lng()
      //   };
      // }
      if(results.status == 'OK') {
        this.center = {
          lat: results.results[0].geometry.location.lat(),
          lng: results.results[0].geometry.location.lng()
        };
        this.marker.position = this.center
      }
    });
  }
  

  addMarker(event: google.maps.MapMouseEvent) {
    if(event.latLng != null)
      this.marker.position = event.latLng.toJSON();
  }

  optionsMarkerSearch = {
    draggable: false,
    animation: google.maps.Animation.BOUNCE
  } 
  markerSearch: google.maps.LatLngLiteral[] = [];

  generateMarker() {
    this.searchForm.xCoordinate = this.marker.position.lat;
    this.searchForm.yCoordinate = this.marker.position.lng;
    this.searchForm.radius = this.radius
    this.postService.searchPost(this.searchForm, 0, '').subscribe({
      next: data => {
        this.page = data;
        this.page.content.forEach(item => this.markerSearch.push({lat: +item.accommodation.xCoordinate, lng: +item.accommodation.yCoordinate}))
        for(let i = 1; i < this.page.totalPages; i++) {

        }
      },
      error: err => {
        console.log(err);
      }
    })
    
  }

  searchByMaps() {
    this.searchForm.xCoordinate = this.marker.position.lat;
    this.searchForm.yCoordinate = this.marker.position.lng;
    this.searchForm.radius = this.radius;
    this.setValuePrice()
    this.setValueAcreage()
    this.router.navigate(['/filter'], {queryParams: {...this.searchForm, page: 1}, skipLocationChange: false});
    this.closeModal()
  }

  setValuePrice() {
    switch(this.priceRange!) {
      case "1": {
        this.searchForm.maxPrice=1000000;
        break;
      }
      case "2": {
        this.searchForm.minPrice=1000000;
        this.searchForm.maxPrice=3000000;
        break;  
      }
      case "3": {
        this.searchForm.minPrice=3000000;
        this.searchForm.maxPrice=5000000;
        break;
      }
      case "4": {
        this.searchForm.minPrice=5000000;
        this.searchForm.maxPrice=10000000;
        break;
      }
      case "5": {
        this.searchForm.minPrice=10000000;
      }
    }
  }

  setValueAcreage(){
    switch(this.priceRange!) {
      case "1": {
        this.searchForm.maxAcreage=20;
        break;
      }
      case "2": {
        this.searchForm.minAcreage=20;
        this.searchForm.maxAcreage=30;
        break;  
      }
      case "3": {
        this.searchForm.minAcreage=30;
        this.searchForm.maxAcreage=50;
        break;
      }
      case "4": {
        this.searchForm.minAcreage=50;
        this.searchForm.maxAcreage=70;
        break;
      }
      case "5": {
        this.searchForm.minAcreage=70;
      }
    }
  }

  onDragEnd(event: any) {
    if(event.latLng != null)
        this.marker.position = event.latLng.toJSON();
  }


  generateLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.marker.position = this.center
      });
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
