import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {SignupType} from "../../../../types/auth-types/signup.type";
import {LoginResponseType} from "../../../../types/auth-types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^[А-Я][а-я]+s*$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$')]],
    agree: [false, Validators.requiredTrue],
  })

  get name() {
    return this.signupForm.get('name')
  }

  get email() {
    return this.signupForm.get('email')
  }

  get password() {
    return this.signupForm.get('password')
  }

  get agree() {
    return this.signupForm.get('agree')
  }

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  signup(): void {
    if (this.signupForm.valid &&
      this.signupForm.value.name &&
      this.signupForm.value.email &&
      this.signupForm.value.password &&
      this.signupForm.value.agree) {

      const newObj: SignupType = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      }

      this.authService.signup(newObj)
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
            this._snackBar.open(`Вы успешно зарегистрировались`)
            this.router.navigate(['/'])
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open(`Ошибка регистрации`)
            }
          }
        })
    }
  }

}
