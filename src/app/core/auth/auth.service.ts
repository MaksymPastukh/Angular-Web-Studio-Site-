import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {Observable, Subject, throwError} from "rxjs";
import {GetTokensType} from "../../../types/auth-types/get-tokens.type";
import {LoginResponseType} from "../../../types/auth-types/login-response.type";
import {SignupType} from "../../../types/auth-types/signup.type";
import {UserType} from "../../../types/auth-types/user.type";
import {LoginType} from "../../../types/auth-types/login.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Переменные для ключей
  public accessTokenKey: string = 'accessToken'
  public refreshTokenKey: string = 'refreshToken'
  public userIdKey: string = 'userId'

  // Subject что бы отслеживать актуальное состояние информации
  public userInfo$: Subject<UserType> = new Subject<UserType>()

  // Subject что бы отслеживать актуальное состояние авторизации
  public isLogged$: Subject<boolean> = new Subject<boolean>()
  private isLogged: boolean = false


  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey)
  }

  public getIsLoggedIn(): boolean {
    return this.isLogged
  }

  public getUserInfo(): void {
    this.user()
      .subscribe((data: UserType | DefaultResponseType) => {
        this.userInfo$.next(data as UserType)
      })
  }

  public login(params: LoginType): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'login', params)
  }

  public signup(params: SignupType): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'signup', params)
  }

  public logout(): Observable<DefaultResponseType> {
    const token: GetTokensType = this.getTokens()
    if (token && token.accessToken) {

      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: token.refreshToken
      })
    }

    throw throwError(() => 'Can not find token')
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const token: GetTokensType = this.getTokens()
    if (token && token.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: token.refreshToken
      })
    }
    throw throwError(() => 'Can not use token')
  }

  public user(): Observable<UserType | DefaultResponseType> {
    return this.http.get<UserType | DefaultResponseType>(environment.api + 'users')
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken)
    localStorage.setItem(this.refreshTokenKey, refreshToken)
    this.isLogged = true
    this.isLogged$.next(true)
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    this.isLogged = false
    this.isLogged$.next(false)
  }

  public getTokens(): GetTokensType {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey)
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id)
    } else {
      localStorage.removeItem(this.userIdKey)
    }
  }

}
