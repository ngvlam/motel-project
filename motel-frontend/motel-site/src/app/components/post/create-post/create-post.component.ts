import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { GeocodingApiServiceService } from 'src/app/services/geocoding-api-service.service';
import { MapGeocoder } from '@angular/google-maps';

import { ProvinceService } from 'src/app/services/province.service';
import { MotelValidators } from 'src/app/validators/motel-site-validator';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  providers: [DecimalPipe]
})
export class CreatePostComponent implements OnInit{
  postFormGroup!: FormGroup
  
  province: {value: string, label: string}[] = []
  district: {value: string, label: string}[] = []
  ward: {value: string, label: string}[] = []

/// CONFIG GOOGLE MAP

  marker = {
    position: {

    },
    options: {
      draggable: true
    } 
  }


  display: any;
  center = {
      lat: 20.9854595,
      lng: 106.0463746
  };

  markerPosition = {
    lat: 0,
    lng: 0
  }

  zoom = 15;

  //Event
  addMarker(event: google.maps.MapMouseEvent) {
      // if (!this.isMarkerDisplayed) {
      // if(event.latLng != null)
      //   this.markerPosition = event.latLng.toJSON();
      //   this.isMarkerDisplayed = true;
      // }
      if(event.latLng != null)
        this.markerPosition = event.latLng.toJSON();
  }

  onDragEnd(event: any) {
    if(event.latLng != null)
        this.markerPosition = event.latLng.toJSON();
  }

  // onMarkerPositionChanged(event: any) {
  //   if(event.latLng != null)
  //   this.markerPosition = event.latLng.toJSON();
  // }

  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

// END CONFIG GOOGLE MAP
  streetInput = new FormControl('');

  constructor(
    private geocodingApiService: GeocodingApiServiceService,
    private provinceService: ProvinceService,
    private formBuilder: FormBuilder,
    private geocoder: MapGeocoder,
    private decimalPipe: DecimalPipe,
    ) {
      this.postFormGroup = this.formBuilder.group({
        address: new FormControl('', [Validators.required, MotelValidators.notOnlyWhiteSpace]),
        title: new FormControl('', [Validators.required,
                                  Validators.minLength(10),
                                  Validators.maxLength(100),
                                  MotelValidators.notOnlyWhiteSpace]),
        content: new FormControl(''),
        priority: new FormControl(''),

        user: this.formBuilder.group({
          id: new FormControl('1')
        }),

        accommodation: this.formBuilder.group({
          acreage: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
          toilet: new FormControl(''),
          internet: new FormControl(''),
          parking: new FormControl(''),
          airConditioner: new FormControl(''),
          heater: new FormControl(''),
          tv: new FormControl(''),
          price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
          categoryId: new FormControl('', [Validators.required]),
          xCoordinate: new FormControl(''),
          yCoordinate: new FormControl('')
        })
      })
    }

  ngOnInit(): void {

    // // Chia hàng nghìn giá
    // this.postFormGroup.get('accommodation.price')?.valueChanges.subscribe(value => {
    //   if (value) {
    //     console.log(value)
    //     value = Number(value.toString().replace(/,/g, ''));
    //     value = this.decimalPipe.transform(value, '1.0-3')
    //     this.postFormGroup.get('accommodation.price')?.setValue(value, { emitEvent: false });
    //   }
    // });

    this.markerPosition = this.center;
    // Khởi tạo lấy tất cả các tỉnh
    this.provinceService.getAllProvinces().subscribe(
      data => 
        this.province = data.map(item => ({value: item.code, label: item.name}))
    )

    //Delay cập nhật google từ địa chỉ
    this.postFormGroup.controls['address'].valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.updateLatLngFromAddress()
    })

    //Delay cập nhật địa chỉ khi nhập số nhà, đường
    this.streetInput.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.addressSelected.street = value as string
      this.commitAddress()
    }) 

    // Lấy vị trí hiện tại
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.markerPosition = this.center
      });
    }
  }

  
  addressSelected = {
    street: '',
    ward: '',
    district: '',
    province: '',
  }

  // Lấy quận huyện khi chọn tỉnh
  getDistrict(event: any) {
    this.provinceService.getDistrictsByProvince(event.value).subscribe(
      data => {
          this.district = data.map(item => ({value: item.code, label: item.name}))
      }
    )

    const selectedOption = this.province.find((option) => option.value === event.value);
    if (selectedOption) {
      this.addressSelected.province = selectedOption.label;
    } 

  }

  // Lấy phường, xã khi chọn huyện
  getWard(event: any) {
    this.provinceService.getWardsByProvince(event.value).subscribe(
      data => {
        this.ward = []
        this.ward = data.map(item => ({value: item.code, label: item.name}))
      }
        
    )

    const selectedOption = this.district.find((option) => option.value === event.value);
    if (selectedOption) {
      this.addressSelected.district = selectedOption.label;
    } 
    this.commitAddress()
  }

  // cập nhật ô địa chỉ
  commitAddress() {
    this.postFormGroup.patchValue({
      address: Object.entries(this.addressSelected)
      .filter(([key, value]) => value !== null && value !== '')
      .map(([key, value]) => value)
      .join(', ')
    });
  }

  // private commitAddress(selectedOption: { value: string; label: string; } | undefined) {
  //   if (selectedOption) {
  //     this.addressSelected = selectedOption.label + ", " + this.addressSelected;
  //   }

  //   this.postFormGroup.patchValue({
  //     address: this.addressSelected
  //   });
  // }

  // Đưa lựa chọn phường, xã tới ô địa chỉ
  updateWardToAddress(event: any) {
    const selectedOption = this.ward.find((option) => option.value === event.value);
    if (selectedOption) {
      this.addressSelected.ward = selectedOption.label;
    } 
    this.commitAddress()
  }

  // Cập nhật google map
  updateLatLngFromAddress() {
    this.geocoder.geocode({ address: this.postFormGroup.value.address }).subscribe((results) => {
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
        this.markerPosition = this.center
      }
    });

    // this.geocodingApiService
    //   .findFromAddress(this.postFormGroup.value.address).subscribe(response => {
    //   if (response.status === 'OK') {
    //     // this.center.lat = response.results[0].geometry.location.lat;
    //     // this.center.lng = response.results[0].geometry.location.lng;
    //     this.center = response.results[0].geometry.location
    //   } else if (response.status === 'ZERO_RESULTS') {
    //     console.log('geocodingAPIService', 'ZERO_RESULTS', response.status);
    //   } else {
    //     console.log('geocodingAPIService', 'Other error', response.status);
    //   }
    // });
  }


  get xCoordinate() {
    return this.postFormGroup.get('accommodation.xCoordinate')
  }

  get yCoordinate() {
    return this.postFormGroup.get('accommodation.yCoordinate')
  }

  get address() {
    return this.postFormGroup.get('address')
  }
}
