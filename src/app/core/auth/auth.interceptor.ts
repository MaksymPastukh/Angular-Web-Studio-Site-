import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {GetTokensType} from "../../../types/auth-types/get-tokens.type";
import {LoginResponseType} from "../../../types/auth-types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: GetTokensType = this.authService.getTokens()
    if (token && token.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', token.accessToken)
      })


      return next.handle(authReq)
        .pipe(
          catchError((error) => {
            if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
              console.log(error)
              return this.handle401Error(authReq, next)
            }

            return throwError(() => error)
          })
        )
    }
    return next.handle(req)
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refresh()
      .pipe(
        switchMap((result: LoginResponseType | DefaultResponseType) => {
          let error: string = ''
          if ((result as DefaultResponseType).message !== undefined) {
            error = (result as DefaultResponseType).message
          }

          const refreshResult: LoginResponseType = result as LoginResponseType
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = 'Ошибка авторизации'
          }

          if (error) {
            return throwError(() => new Error(error))
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken)

          const authReq = req.clone(
            {
              headers: req.headers.set('x-auth', refreshResult.accessToken)
            }
          )
          return next.handle(authReq)

        }),
        catchError(error => {
          this.authService.removeTokens()
          this.router.navigate(['/'])
          return throwError(() => error)

        })
      )
  }
}
