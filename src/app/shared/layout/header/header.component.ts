import { AfterViewInit, Component, OnInit } from '@angular/core'
import { MatSnackBar } from "@angular/material/snack-bar"
import { ActivatedRoute, Router } from '@angular/router'
import { UserType } from "../../../../types/auth-types/user.type"
import { DefaultResponseType } from "../../../../types/default-response.type"
import { AuthService } from "../../../core/auth/auth.service"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isLogged: boolean = false
  public userInfo!: UserType

  constructor(private authService: AuthService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged
    })

    this.authService.userInfo$.subscribe((user: UserType) => {
      this.userInfo = user
    })

    if (this.isLogged) {
      this.authService.user()
        .subscribe((data: UserType | DefaultResponseType) => {
          this.userInfo = data as UserType
        })
    }
  }

  logout(): void {
    this.authService.logout()
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
}
