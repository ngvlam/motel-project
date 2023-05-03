import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/model/account';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm!: FormGroup;
  errorSignupMess: string = ''

  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,) {
      this.signupForm = fb.group({
        fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required])
      }, { validators: this.matchPasswords('password', 'confirmPassword') } as AbstractControlOptions)
  }

  get fullName(){return this.signupForm.get('fullName')}
  get email(){return this.signupForm.get('email')}
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

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

   // Handle password
   passwordVisible = false;
   confirmPasswordVisible = false;
 
   togglePasswordVisibility() {
     this.passwordVisible = !this.passwordVisible;
   }
 
   toggleConfirmPasswordVisibility() {
     this.confirmPasswordVisible = !this.confirmPasswordVisible;
   }

   disableSubmit = false;

   signup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
    }

    else {
      this.disableSubmit = true
      const account: Account = this.signupForm.value
      this.authService.signup(account).subscribe({
        next: data => {
          this.disableSubmit = false;
          this.authService.login(this.signupForm.value.email, this.signupForm.value.password, false).subscribe({
            next: data => {
              this.router.navigate(['/home'])
                .then(() => {
                  window.location.reload();
                })
            }
          })
        },
        error: error => {
          if(error.status == 409) {
            this.errorSignupMess = 'Email đã tồn tại trong hệ thống'
          }
          this.disableSubmit = false;
        }
      })
    }
   }
}
