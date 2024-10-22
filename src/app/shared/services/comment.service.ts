import { HttpClient } from "@angular/common/http"
import { Injectable } from '@angular/core'
import { Observable } from "rxjs"
import { doComment } from 'src/types/do-comment.type'
import { GetComments } from 'src/types/get-comments.type'
import { GetParamComments } from 'src/types/get-param-comments.type'
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

}

