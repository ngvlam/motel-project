import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { defaultAvatar } from 'src/app/config';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { MotelAdminValidators } from 'src/app/validators/custom-validator';

@Component({
  selector: 'app-user-create-new',
  templateUrl: './user-create-new.component.html',
  styleUrls: ['./user-create-new.component.css']
})
export class UserCreateNewComponent {
  avatar: any = defaultAvatar;
  userForm!: FormGroup;
  errorMsg: string = '';

    // Handle password
  passwordVisible = false;
  confirmPasswordVisible = false;

  ROLE_NAME = [
    {id: 'ROLE_USER', name: 'Khách hàng'},
    {id: 'ROLE_MODERATOR', name: 'Kiểm duyệt viên'},
    {id: 'ROLE_ADMIN', name: 'Quản trị viên'},
  ]

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private router: Router) {

                this.userForm = this.formBuilder.group({
                  fullName:  new FormControl('', 
                            [Validators.required, 
                            Validators.minLength(2), 
                            MotelAdminValidators.notOnlyWhiteSpace
                            ]),
                  email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
                  password: new FormControl('', [Validators.required, Validators.minLength(8)]),
                  confirmPassword: new FormControl('', [Validators.required]),
                  role: new FormControl(''),
                  phone: new FormControl('', [Validators.pattern('^[0-9]+$')]),
                  address: new FormControl(''),
                  avatarUrl: new FormControl('')
                }, {
                    validators : this.matchPasswords('password', 'confirmPassword')
                });
              }

  ngOnInit(): void {
    this.avatar = defaultAvatar;
    this.userForm.patchValue({
      avatarUrl: this.avatar,
      role: 'ROLE_USER'    
    });
  }

  removeAvatar() {
    this. userForm.patchValue({ avatarUrl: defaultAvatar })
  }
  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'image/png' || file.type === 'image/jpeg' && file.size < 2000000) {
      const reader = new FileReader();
      reader.onload = e => this.userForm.patchValue({ avatarUrl: reader.result});
      reader.readAsDataURL(file);
    } else {
      this.errorMsg = 'Vui lòng chọn ảnh có định dạng PNG hoặc JPEG nhỏ hơn 2MB.';
      setTimeout(() => this.errorMsg ='', 5000)
      // this.userForm.patchValue({ avatarUrl: this.avatar});
    }
  }

  // get avatarUrl() {
  //   return this.userForm.get('avatarUrl');
  // }

  get email() {
    return this.userForm.get('email');
  }

  get fullName() {
    return this.userForm.get('fullName');
  }

  get phone() {
    return this.userForm.get('phone');
  }

  get password() {
    return this.userForm.get('password')
  }

  get confirmPassword() {
    return this.userForm.get('confirmPassword')
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

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  matchPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mustMatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    };
  }

  // Submit form
  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    }
    else {
      let prepareUser = {
        email : this.userForm.value.email,
        password: this.userForm.value.password,
        phone : this.userForm.value.phone,
        fullName : this.userForm.value.fullName,
        address : this.userForm.value.address,
        roles : [this.userForm.value.role],
        b64: '',
      }
      
      let b64 = this.userForm.value.avatarUrl;
  
      console.log(b64)
      if(b64 == defaultAvatar) {
        prepareUser.b64 = ''
      }
      
      else {
        // prepareUser.b64 = this.minimizeB64(b64).split(',')[1]
        prepareUser.b64 = b64.split(',')[1]
      }
      
      this.userService.registerAccount(prepareUser).subscribe({
        next : res => {
          this.toastr.success(`Tài khoản ${res.email} đã được tạo`, 'Tạo tài khoản');
          this.router.navigate(['users', res.id, 'detail']);
        },
        error: err => {
          alert(err)
        }
      })
    }
  }
}
