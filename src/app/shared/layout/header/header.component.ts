import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatSnackBar } from "@angular/material/snack-bar"
import { Subscription } from 'rxjs'
import { UserType } from "../../../../types/auth-types/user.type"
import { DefaultResponseType } from "../../../../types/default-response.type"
import { AuthService } from "../../../core/auth/auth.service"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isLogged: boolean = false
  public userInfo!: UserType
  private subscriptionLogged: Subscription | null = null
  private subscriptionUserInfo: Subscription | null = null
  private subscriptionUser: Subscription | null = null
  private subscriptionLogout: Subscription | null = null

  constructor(private authService: AuthService,
    private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    this.subscriptionLogged = this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged
    })

    this.subscriptionUserInfo = this.authService.userInfo$.subscribe((user: UserType) => {
      this.userInfo = user
    })

    if (this.isLogged) {
      this.subscriptionUser = this.authService.user()
        .subscribe((data: UserType | DefaultResponseType) => {
          this.userInfo = data as UserType
        })
    }
  }

  logout(): void {
    this.subscriptionLogout = this.authService.logout()
      .subscribe({
        next: (): void => {
          this.doLogout()
        },
        error: (): void => {
          this.doLogout()
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens()
    this.authService.userId = null
    this._snackBar.open(`Вы успешно вышли из системы`)
  }

  ngOnDestroy(): void {
    this.subscriptionLogged?.unsubscribe()
    this.subscriptionUserInfo?.unsubscribe()
    this.subscriptionUser?.unsubscribe()
    this.subscriptionLogout?.unsubscribe()
  }
}
