import { Component, OnDestroy, OnInit } from '@angular/core'
import { LoaderService } from '../../services/loader.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  public isShowed: boolean = false;
  private subscription: Subscription | null = null

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.subscription = this.loaderService.isShowLoader$.subscribe((isShowed: boolean) => {
      this.isShowed = isShowed
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

}
