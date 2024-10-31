import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isShowLoader$ = new Subject<boolean>()

  constructor() { }

  show(): void {
    this.isShowLoader$.next(true)
  }

  hide(): void {
    this.isShowLoader$.next(false)
  }

}
