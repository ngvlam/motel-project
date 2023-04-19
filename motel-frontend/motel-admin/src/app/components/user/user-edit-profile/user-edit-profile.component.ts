import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { defaultAvatar } from 'src/app/config';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { MotelAdminValidators } from 'src/app/validators/custom-validator';


@Component({
  selector: 'app-user-edit-profile',
  templateUrl: './user-edit-profile.component.html',
  styleUrls: ['./user-edit-profile.component.css']
})
export class UserEditProfileComponent implements OnInit{
  user: User = new User();
  avatar: any = defaultAvatar;
  userForm!: FormGroup;
  errorMsg: string = '';

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private _sanitizer: DomSanitizer) {
                this.userForm = this.formBuilder.group({
                  fullName:  new FormControl('', 
                            [Validators.required, 
                            Validators.minLength(2), 
                            MotelAdminValidators.notOnlyWhiteSpace
                            ]),
                  email: new FormControl(''),
                  phone: new FormControl('', [Validators.pattern('^[0-9]+$')]),
                  address: new FormControl(''),
                  avatarUrl: new FormControl('')
                });
              }

  ngOnInit(): void {
    const {id} = this.route.snapshot.params;
    this.userService.getAccountById(id)
      .subscribe({
        next: data => {
          this.user = data;
          // this.userService.getAvatar(this.id)
          //   .subscribe(avatar => {
          //     if (avatar.data != null && avatar.data != '')
          //       this.avatar = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + avatar.data);
          //     else
          //       this.avatar = defaultAvatar;
          //   });
          if (this.user.b64 != null && this.user.b64 != '')
          this.avatar = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + this.user.b64);
            else
          this.avatar = defaultAvatar;

          this.userForm.patchValue({

            fullName: this.user.fullName,
      
            email: this.user.email,
      
            phone: this.user.phone,    
            address: this.user.address,
            avatarUrl: this.avatar      
          });
        }
      });
      
  }

  minimizeB64(b64Data: string) {
    const img = new Image();
    img.src = b64Data;
    // Create a canvas element to draw the image onto
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

  // Draw the image onto the canvas
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);

// Convert the canvas to a new base64-encoded image with reduced quality
    const newB64Data = canvas.toDataURL('image/jpeg', 0.5); // 50% quality
      return newB64Data;
  }

  removeAvatar() {
    this. userForm.patchValue({ avatarUrl: defaultAvatar })
  }
  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'image/png' || file.type === 'image/jpeg' && file.size < 2000000) {
      const reader = new FileReader();
      reader.onload = e => this.userForm.patchValue({ avatarUrl: reader.result});
      this.avatar = reader.result;
      reader.readAsDataURL(file);
    } else {
      this.errorMsg = 'Vui lòng chọn ảnh có định dạng PNG hoặc JPEG nhỏ hơn 2MB.';
      setTimeout(() => this.errorMsg ='', 5000)
      // this.userForm.patchValue({ avatarUrl: this.avatar});
    }
  }

  get avatarUrl() {
    return this.userForm.get('avatarUrl');
  }

  get fullName() {
    return this.userForm.get('fullName');
  }

  get phone() {
    return this.userForm.get('phone');
  }

  // Submit form
  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    }
    else {
      
      let prepareUser = new User();
      prepareUser.phone = this.userForm.value.phone;
      prepareUser.fullName = this.userForm.value.fullName;
      prepareUser.address = this.userForm.value.address;
      let b64 = this.userForm.value.avatarUrl;
      
      if(b64 == defaultAvatar) {
        prepareUser.b64 = ''
      }
      // // if(typeof b64 === 'object') {
      // //   prepareUser.b64 = b64.changingThisBreaksApplicationSecurity.split(',')[1]
      // // }
      // if(b64 === this.avatar) {
      //   prepareUser.b64 = b64.changingThisBreaksApplicationSecurity.split(',')[1]
      // }
      else if(b64 == this.avatar) {
        prepareUser.b64 = this.minimizeB64(b64.changingThisBreaksApplicationSecurity).split(',')[1]
      }
      else  {
        prepareUser.b64 = this.minimizeB64(b64).split(',')[1]
      }
      
      this.userService.updateProfile(this.user.id, prepareUser).subscribe({
        next : res => {
          this.toastr.success(`Tài khoản ${this.user.email} đã chỉnh sửa thành công`, 'Chỉnh sửa tài khoản');
          this.router.navigate(['users', this.user.id, 'detail']);
        },
        error: err => {
          alert(err)
        }
      })
    }
  }
}
