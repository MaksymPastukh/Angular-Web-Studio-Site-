import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { BlogsRoutingModule } from './blogs-routing.module'
import { ArticleComponent } from "./article/article.component"
import { ArticlesComponent } from "./articles/articles.component"
import { SharedModule } from "../../shared/shared.module"
import { ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    ArticleComponent,
    ArticlesComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BlogsRoutingModule,
    SharedModule
  ]
})
export class BlogsModule { }
