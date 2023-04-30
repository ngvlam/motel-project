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
  skipRouterOutlet = true;
  formLogin!: FormGroup
  errorLoginMess = ''

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router) {
    this.formLogin = formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      rememberMe: new FormControl('')
    })
  }
  
  ngOnInit(): void {
    
  }

  login() {
    this.authService.login(this.formLogin.value.email, this.formLogin.value.password, this.formLogin.value.rememberMe).subscribe({
      next: data => {
        this.router.navigate(['/'])
        // .then(() => {
        //   window.location.reload();
        // })
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

  get email() {
    return this.formLogin.get('email');
  }

  get password() {
    return this.formLogin.get('password');
  }
}
