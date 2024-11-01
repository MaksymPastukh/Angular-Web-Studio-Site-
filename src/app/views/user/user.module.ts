import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {SignupComponent} from "./signup/signup.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "./login/login.component";
import { UserAgreementComponent } from './user-agreement/user-agreement.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    UserAgreementComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
