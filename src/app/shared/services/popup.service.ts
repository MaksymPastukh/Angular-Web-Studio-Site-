import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {RequestsType} from "../../../types/requests.type";

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  public isServices: boolean = false
  public isConsultation: boolean = false
  public service: string | undefined = ''

  constructor(private http: HttpClient) {
  }

  public requestOrder(params: RequestsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', params)
  }

  public services(str: string, isService: boolean): void {
    this.isServices = isService
    this.service = str
  }

  public consultation(isService: boolean): void {
    this.isConsultation = isService
  }
}

