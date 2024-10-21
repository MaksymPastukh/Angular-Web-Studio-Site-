import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PopupComponent } from "./components/popup/popup.component"
import { ArticleCardComponent } from "./components/article-card/article-card.component"
import { ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from '@angular/router'


@NgModule({
  declarations: [
    PopupComponent,
    ArticleCardComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    PopupComponent,
    ArticleCardComponent
  ]
})
export class SharedModule {
}
