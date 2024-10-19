import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {PopularArticleType} from "../../../types/popular-article.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ActivateParamsType} from "../../../types/activate-params.type";
import {ArticlesType} from "../../../types/articles.type";
import {CategoriesType} from "../../../types/categories.type";

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
    } )
  }

  public getCategories(): Observable<CategoriesType | DefaultResponseType> {
    return this.http.get<CategoriesType | DefaultResponseType>(environment.api + 'categories')
  }
}

