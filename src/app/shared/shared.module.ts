import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PopupComponent } from "./components/popup/popup.component"
import { ArticleCardComponent } from "./components/article-card/article-card.component"
import { ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from '@angular/router'
import { PhoneMaskDirective } from './utils/phone-mask.directive'


@NgModule({
  declarations: [
    PopupComponent,
    ArticleCardComponent,
    PhoneMaskDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    PopupComponent,
    ArticleCardComponent,
    PhoneMaskDirective,
  ]
})
export class SharedModule {
}
