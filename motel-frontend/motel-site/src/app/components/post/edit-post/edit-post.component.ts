import { DecimalPipe } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapGeocoder } from '@angular/google-maps';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { Post } from 'src/app/model/post';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal.service';
import { GeocodingApiServiceService } from 'src/app/services/geocoding-api-service.service';
import { ImageService } from 'src/app/services/image.service';
import { PostService } from 'src/app/services/post.service';
import { ProvinceService } from 'src/app/services/province.service';
import { MotelValidators } from 'src/app/validators/motel-site-validator';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent {
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
      lat: 21.037376869189334,
      lng: 105.77866948660191
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
    private postService: PostService,
    private imageService: ImageService,
    private geocodingApiService: GeocodingApiServiceService,
    private provinceService: ProvinceService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private geocoder: MapGeocoder,
    private router: Router,
    private el: ElementRef,
    private confirmationModalService: ConfirmationModalService,
    private decimalPipe: DecimalPipe,
    ) {

      this.postFormGroup = this.formBuilder.group({
        address: new FormControl('', [Validators.required, MotelValidators.notOnlyWhiteSpace]),
        title: new FormControl('', [Validators.required,
                                  Validators.minLength(10),
                                  Validators.maxLength(100),
                                  MotelValidators.notOnlyWhiteSpace]),
        content: new FormControl('', [Validators.required,
                                Validators.minLength(10),
                                Validators.maxLength(1000),
                                MotelValidators.notOnlyWhiteSpace]),
        priority: new FormControl(''),

        user: this.formBuilder.group({
          id: new FormControl('1')
        }),

        accommodation: this.formBuilder.group({
          acreage: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
          toilet: new FormControl('', [Validators.required]),
          internet: new FormControl(''),
          parking: new FormControl(''),
          airConditioner: new FormControl(''),
          heater: new FormControl(''),
          tv: new FormControl(''),
          price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
          categoryId: new FormControl('', [Validators.required]),
          xCoordinate: new FormControl(''),
          yCoordinate: new FormControl('')
        }),
        files: new FormControl('')
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

  get title() {
    return this.postFormGroup.get('title')
  }

  get content() {
    return this.postFormGroup.get('content')
  }

  get price() {
    return this.postFormGroup.get('accommodation.price')
  }

  get acreage() {
    return this.postFormGroup.get('accommodation.acreage')
  }

  get categoryId() {
    return this.postFormGroup.get('accommodation.categoryId')
  }


  // HANDLE SELECT FILE

  files: any[] = [];


  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length === 0) {
      return;
    }

    files.map(file => {
      if(file.size <= 4*1024*1024) {
        const reader = new FileReader();
        reader.onload = () => {
          this.files.push({ name: file.name, preview: reader.result as string, file: file });
        };
        reader.readAsDataURL(file);
      }
      else {
        this.toastr.warning('Vui lòng chọn ảnh nhỏ hơn 4MB', 'Cảnh báo', {
          positionClass: 'toast-top-center'
        });
      }
    });

    // if (files.length !== files.length) {
    //   alert('One or more files have a size greater than 4MB.'); // show an error message
    // }

    this.postFormGroup.patchValue({ files: this.files });
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.postFormGroup.patchValue({ files: this.files });
  }

  validateFileExtension(control: any) {
    if (control.value) {
      const file = control.value;
      const fileExtension = file.name?.split('.').pop().toLowerCase();
      const fileSize = file.size / 1024 / 1024; // convert bytes to megabytes
      if (fileSize > 4) {
        return { sizeExceeded: true };
      }
      if (fileExtension !== 'jpg' && fileExtension !== 'png') {
        return { unsupportedFileType: true };
      }
    }
    return null;
  }

  //END HANDLE SELECT FILES

  // HANDLE SUBMIT FORM
  disableSubmit = false;
  showLoadding = false;
  onSubmit() {
    if (this.postFormGroup.invalid) {
      this.postFormGroup.markAllAsTouched();
      const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
      invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center'});
      this.toastr.warning('Vui lòng điền thông tin bắt buộc', 'Cảnh báo', {
        positionClass: 'toast-top-center'
      });
    }
    
    else if(this.postFormGroup.get('files')?.value.length <= 0) {
      this.toastr.warning('Vui lòng chọn ít nhất một ảnh', 'Cảnh báo', {
        positionClass: 'toast-top-center'
      });
    }
    else {
      this.disableSubmit = true;
      this.showLoadding = true;

      const post: Post = {
        title: this.postFormGroup.value.title,
        content: this.postFormGroup.value.content,
        accommodation: this.postFormGroup.controls['accommodation'].value,
        imageStrings: []
      }
      post.accommodation.address = this.postFormGroup.value.address;
      post.accommodation.xcoordinate = this.markerPosition.lat;
      post.accommodation.ycoordinate = this.markerPosition.lng;

      this.postService.createPost(post).subscribe({
        next : data => {
          this.addImageForPost(data.id!);
        },

        error: err => console.log(err)
        }
      );
    }
  }

  addImageForPost(postId: number) {
    if (postId != null) {
      const formData = new FormData();

      for (const image of this.postFormGroup.value.files) {
        formData.append('files', image.file);
      }

      this.imageService.addImages(postId, formData).subscribe({
        next: data => {
          if(data) {
            this.toastr.success('Tin được đăng thành công và chờ kiểm duyệt')
            this.showLoadding = false;
            // this.toastr.info('Tự động chuyển trang sau 5s', '', {
            //   positionClass: 'toast-top-center',
            //   timeOut: 5000
            // })
            // setTimeout(() => {
            //   this.router.navigate(['/home']);
            // }, 5000);
            this.openModalConfirmNavigate()
          }
        },
        error: err => console.log(err)
      })
    }

  }

  countdown = 5;
  openModalConfirmNavigate() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.router.navigate(['/home']);
      }
    }, 1000);
    this.confirmationModalService.openModal('Xác nhận', `Trang sẽ được tự động chuyển sau ${this.countdown}s
    Bạn có muốn tiếp tục đăng tin không?`)
    .subscribe(result => {
      if (!result.confirmed) {
        this.router.navigate(['/home']);
      }
      else {
        clearInterval(interval);
      }
    });
  }
}
