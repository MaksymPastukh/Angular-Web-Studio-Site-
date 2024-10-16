import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {PopularArticleType} from "../../../types/popular-article.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  public getArticle(): Observable<PopularArticleType | DefaultResponseType> {
    return this.http.get<PopularArticleType | DefaultResponseType>(environment.api + 'articles/top')
  }
}

