import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {UserType} from "../../../../types/auth-types/user.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isLogged: boolean = false
  public userInfo!: UserType

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLogged: boolean) => {
      console.log(isLogged)
      this.isLogged = isLogged
    })
    this.authService.user()
      .subscribe((data: UserType | DefaultResponseType) => {
        console.log(data)
        this.userInfo = data as UserType
      })
  }

}
