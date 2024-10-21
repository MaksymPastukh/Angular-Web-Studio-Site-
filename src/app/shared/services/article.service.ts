import { HttpClient } from "@angular/common/http"
import { Injectable } from '@angular/core'
import { Observable } from "rxjs"
import { ArticleRelate } from 'src/types/article-related.type'
import { environment } from "../../../environments/environment"
import { ActivateParamsType } from "../../../types/activate-params.type"
import { ArticleType } from "../../../types/article.type"
import { ArticlesType } from "../../../types/articles.type"
import { CategoriesType } from "../../../types/categories.type"
import { DefaultResponseType } from "../../../types/default-response.type"
import { PopularArticleType } from "../../../types/popular-article.type"

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  public getArticleTop(): Observable<PopularArticleType | DefaultResponseType> {
    return this.http.get<PopularArticleType | DefaultResponseType>(environment.api + 'articles/top')
  }

  public getArticles(params?: ActivateParamsType): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles', {
      params: params
    })
  }

  public getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url)
  }

  public getArticleRelate(url: string): Observable<ArticleRelate> {
    return this.http.get<ArticleRelate>(environment.api + 'articles/related/' + url)
  }

  public getCategories(): Observable<CategoriesType | DefaultResponseType> {
    return this.http.get<CategoriesType | DefaultResponseType>(environment.api + 'categories')
  }
}

