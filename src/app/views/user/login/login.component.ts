import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {LoginType} from "../../../../types/auth-types/login.type";
import {LoginResponseType} from "../../../../types/auth-types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  })

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')
  }

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.valid &&
      this.loginForm.value.email &&
      this.loginForm.value.password
    ) {

      const newObj: LoginType = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberMe: !!this.loginForm.value.rememberMe,
      }

      this.authService.login(newObj)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null

            if ((data as DefaultResponseType).message !== undefined) {
              error = (data as DefaultResponseType).message
            }

            const loginResponse: LoginResponseType = data as LoginResponseType
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = `Ошибка при авторизации`
            }

            if (error) {
              this._snackBar.open(error)
              throw new Error(error)
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken)
            this.authService.userId = loginResponse.userId
            this._snackBar.open(`Вы успешно авторизовались`)
            this.router.navigate(['/'])
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open(`Ошибка при авторизации`)
            }
          }
        })
    }
  }
}
