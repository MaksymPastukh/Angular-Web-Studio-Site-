import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PopupComponent } from "./components/popup/popup.component"
import { ArticleCardComponent } from "./components/article-card/article-card.component"
import { ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from '@angular/router'
import { PhoneMaskDirective } from './utils/phone-mask.directive'
import { LoaderComponent } from './components/loader/loader.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
  declarations: [
    PopupComponent,
    ArticleCardComponent,
    PhoneMaskDirective,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  exports: [
    PopupComponent,
    ArticleCardComponent,
    PhoneMaskDirective,
    LoaderComponent
  ]
})
export class SharedModule {
}
