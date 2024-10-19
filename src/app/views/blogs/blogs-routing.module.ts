import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ArticleComponent} from "./article/article.component";
import {ArticlesComponent} from "./articles/articles.component";

const routes: Routes = [
  {path: 'articles', component: ArticlesComponent},
  {path: 'article', component: ArticleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
