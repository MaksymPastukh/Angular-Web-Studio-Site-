import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupComponent} from "./components/popup/popup.component";
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    PopupComponent,
    ArticleCardComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    PopupComponent,
    ArticleCardComponent
  ]
})
export class SharedModule {
}
