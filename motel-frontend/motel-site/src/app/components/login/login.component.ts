import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  errorLoginMess: string = ''

  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,) {
      this.loginForm = fb.group({
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        rememberMe: new FormControl('')
      })
  }

  ngOnInit(): void {
    
  }

  login() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.rememberMe).subscribe({
      next: data => {
        this.router.navigate(['/home'])
        .then(() => {
          window.location.reload();
        })
      },
      error: error => {
        let errorMess = error.error.message;
        if (errorMess == 'Bad credentials') {
          this.errorLoginMess = "Email hoặc mật khẩu không đúng"
        }
        if (errorMess == 'User account is locked') {
          this.errorLoginMess = "Tài khoản này đã bị khóa"
        }
      }
    })
  }
}
