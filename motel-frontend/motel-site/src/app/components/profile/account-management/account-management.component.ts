import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { MotelValidators } from 'src/app/validators/motel-site-validator';
import { defaultAvatar } from 'src/config';


@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit{

  isHadPhone = true;
  accFormGroup!: FormGroup;
  passwordFormGroup!: FormGroup;

  user: User = new User;
  avatar: any = defaultAvatar;

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.openTab()
    this.getInforOfUser()
    this.accFormGroup = this.formBuilder.group({
      fullName: new FormControl('', [Validators.required, Validators.minLength(2), MotelValidators.notOnlyWhiteSpace]),
      email: new FormControl({ value: '', disabled: true },),
      phone: new FormControl({value: '', disabled: this.isHadPhone}, [Validators.required]),
      address: new FormControl(''),
      avatarUrl: new FormControl('')
    })  
    this.passwordFormGroup = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords('newPassword', 'confirmPassword') } as AbstractControlOptions);
  }

  get currentPassword() { return this.passwordFormGroup.get('currentPassword'); }
  get newPassword() { return this.passwordFormGroup.get('newPassword'); }
  get confirmPassword() { return this.passwordFormGroup.get('confirmPassword'); }

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


  getInforOfUser() {
    this.authService.getCurrentUser().subscribe({
      next: data => {
        this.user = data;

        if(this.user.phone == null || this.user.phone == '') {
          this.isHadPhone = false
        }


        if (this.user.b64 != null && this.user.b64 != '')
          this.avatar = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + this.user.b64);
        else
          this.avatar = defaultAvatar;

        this.setInitFormValue()
      },
      
      error: error => {
        console.log(error)
      }
    })

  }

  setInitFormValue() {
    this.accFormGroup.patchValue({
      fullName: this.user.fullName,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address,
      avatarUrl: this.avatar
    })
  }

  removeAvatar() {
    this.accFormGroup.patchValue({ avatarUrl: defaultAvatar })
  }

  get avatarUrl() {
    return this.accFormGroup.get('avatarUrl');
  }

  get fullName() {
    return this.accFormGroup.get('fullName');
  }

  get phone() {
    return this.accFormGroup.get('phone');
  }

  

  openTab() {
    const tabs = document.querySelectorAll(".tab-item")
    const panes = document.querySelectorAll(".tab-pane")
    const tabActive = document.querySelector(".tab-item.active") as HTMLElement
    const line = document.querySelector(".tabs .line") as HTMLElement

    line.style.left = tabActive.offsetLeft + "px";
    line.style.width = tabActive.offsetWidth + "px";

    tabs.forEach((tab, index) => {
      const pane = panes[index];
    
      if( tab instanceof HTMLElement) {
        tab.onclick = function () {
          document.querySelector(".tab-item.active")?.classList.remove("active");
          document.querySelector(".tab-pane.active")?.classList.remove("active");
      
          line.style.left = tab.offsetLeft + "px";
          line.style.width = tab.offsetWidth + "px";
      
          tab.classList.add("active");
          pane.classList.add("active");
        };
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'image/png' || file.type === 'image/jpeg' && file.size < 2000000) {
      const reader = new FileReader();
      reader.onload = e => this.accFormGroup.patchValue({ avatarUrl: reader.result});
      this.avatar = reader.result;
      reader.readAsDataURL(file);
    } else {
      // this.errorMsg = 'Vui lòng chọn ảnh có định dạng PNG hoặc JPEG nhỏ hơn 2MB.';
      // setTimeout(() => this.errorMsg ='', 5000)
      // this.userForm.patchValue({ avatarUrl: this.avatar});
    }
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

  updateProfile() {
    if (this.accFormGroup.invalid) {
      this.accFormGroup.markAllAsTouched();
    }
    else {
      
      let prepareUser = new User();
      prepareUser.fullName = this.accFormGroup.value.fullName;
      prepareUser.phone = this.accFormGroup.value.phone;
      prepareUser.address = this.accFormGroup.value.address;
      let b64 = this.accFormGroup.value.avatarUrl;
      
      if(b64 == defaultAvatar) {
        prepareUser.b64 = ''
      }

      else if(b64 == this.avatar) {
        prepareUser.b64 = this.minimizeB64(b64.changingThisBreaksApplicationSecurity).split(',')[1]
      }
      else  {
        prepareUser.b64 = this.minimizeB64(b64).split(',')[1]
      }
      
      this.accountService.updateProfile(2, prepareUser).subscribe({
        next : res => {
          this.toastr.success(`Thông tin cá nhân của bạn đã được cập nhật thành công`, 'Cập nhật tài khoản');
        },
        error: error => {
          alert(error)
        }
      })
    }
  }

  changePass() {

  }
  
  // Handle password
  currentPasswordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;

  togglePasswordVisibility() {
    this.currentPasswordVisible = !this.currentPasswordVisible;
  }

  toggleNewPasswordVisibility() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
