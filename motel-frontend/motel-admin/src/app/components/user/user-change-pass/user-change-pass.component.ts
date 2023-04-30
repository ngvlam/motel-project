import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import {Location} from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-change-pass',
  templateUrl: './user-change-pass.component.html',
  styleUrls: ['./user-change-pass.component.css']
})
export class UserChangePassComponent implements OnInit{

  user: User = new User()
  roleForm!: FormGroup;
  passwordForm!: FormGroup;

    //ROLE VAR
    role = 'ROLE_USER';

    preRole = 'ROLE_USER';

    ROLE_NAME = [
      {id: 'ROLE_USER', name: 'Khách hàng'},
      {id: 'ROLE_MODERATOR', name: 'Kiểm duyệt viên'},
      {id: 'ROLE_ADMIN', name: 'Quản trị viên'},
    ]
  
    canChangeRole = false;

  constructor(private userService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location) {

      this.passwordForm = this.formBuilder.group({
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required])
      }, {
        validators : this.matchPasswords('password', 'confirmPassword')
      } as AbstractControlOptions);
    }

  ngOnInit(): void {
    
    const {id} = this.route.snapshot.params;
    this.userService.getAccountById(id)
      .subscribe({
        next: data => {
          this.user = data;
          this.role = (this.user.roles.length <= 0) ? 'ROLE_USER' : this.user.roles[0];
          this.preRole = this.role;
          this.canChangeRole = this.preRole != 'ROLE_ADMIN';

          this.roleForm = this.formBuilder.group({
            role: this.role
          });

          this.roleForm.get('role')?.valueChanges.subscribe(value => {
            this.role = value;
          })
          
        },

        error: err => {

        }
      });
  }

  saveRole() {
    this.userService.updateRole(this.user.id, this.role)
      .subscribe({
        next : res => {
          this.location.back();
          this.toastr.success(`Thay đổi loại tài khoản cho ${this.user.email} thành công`)
        },
        error : err => {
          this.role == this.preRole;
        }
      });
  }

  // Handle password
  passwordVisible = false;
  confirmPasswordVisible = false;

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

  changePass() {
    this.userService.changePassword(this.user.id, this.passwordForm.value.password)
      .subscribe({
        next : res => {
          this.location.back();
          this.toastr.success(`Thay đổi mật khẩu cho tài khoản ${this.user.email} thành công`)
        },
        error : err => {
          console.log(err)
        }
      });
  }

  get password() {
    return this.passwordForm.get('password')
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword')
  }
}
