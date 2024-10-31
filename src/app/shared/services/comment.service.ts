import { HttpClient } from "@angular/common/http"
import { Injectable } from '@angular/core'
import { map, Observable } from "rxjs"
import { ArticleCommentActions } from 'src/types/article-comment-actions.type'
import { doComment } from 'src/types/do-comment.type'
import { GetComments } from 'src/types/get-comments.type'
import { GetParamComments } from 'src/types/get-param-comments.type'
import { likeAndDislike } from 'src/types/likeAndDislike.type'
import { environment } from "../../../environments/environment"
import { DefaultResponseType } from "../../../types/default-response.type"

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  public getComment(params: GetParamComments): Observable<GetComments | DefaultResponseType> {
    return this.http.get<GetComments | DefaultResponseType>(environment.api + 'comments', {
      params: params
    })
  }

  public doComment(params: doComment): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', params)
  }

  public likeAndDislike(action: likeAndDislike, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + articleId + '/apply-action', action)
  }

  public getActionsComment(articleId: string): Observable<ArticleCommentActions[] | DefaultResponseType> {
    return this.http.get<ArticleCommentActions[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions?articleId=' + articleId)
  }

  public getActionCommentator(commentId: string): Observable<ArticleCommentActions[] | DefaultResponseType> {
    return this.http.get<ArticleCommentActions[] | DefaultResponseType>(environment.api + 'comments/' + commentId + '/actions')
  }

}

