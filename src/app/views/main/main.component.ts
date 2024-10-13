import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {MainSliderType} from "../../../types/main-slider.type";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  //bypassSecurityTrustHtml => Используется для того что бы html тегам можно было навесить стили, без этого метода Angular из-за безопасти очищает все свойства
  public mainSlider: MainSliderType = [
    {
      title: 'Предложение месяца',
      text: this.sanitizer.bypassSecurityTrustHtml(
        'Продвижение в Instagram для вашего бизнеса <span style="color: #709fdc">-15%</span>!'
      ),
      description: '',
      image: 'slide-1.png',
    },
    {
      title: 'Акция',
      text: this.sanitizer.bypassSecurityTrustHtml(
        'Нужен грамотный <span style="color: #709fdc">копирайтер</span>?'
      ),
      description: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: 'slide-2.png',
    },
    {
      title: 'Новость дня',
      text: this.sanitizer.bypassSecurityTrustHtml(
        '<span style="color: #709fdc">6 место</span> в ТОП 10 <br>SMM-агенств Москвы'
      ),
      description: 'Мы благодарим каждого, кто голосовал за нас!',
      image: 'slide-3.png',
    },
  ]


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    margin: 0,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: true
  }

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
  }

}
