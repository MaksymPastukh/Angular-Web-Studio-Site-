import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { OwlOptions } from "ngx-owl-carousel-o"
import { MainSliderType } from "../../../types/main-slider.type"
import { MainReviewsType } from "../../../types/main-reviews.type"
import { MatDialog, MatDialogRef } from "@angular/material/dialog"
import { ArticleService } from "../../shared/services/article.service"
import { PopularArticleType } from "../../../types/popular-article.type"
import { DefaultResponseType } from "../../../types/default-response.type"
import { MainServicesType } from "../../../types/main-services.type"
import { PopupService } from "../../shared/services/popup.service"
import { FormBuilder } from "@angular/forms"
import { ServiceTypes } from "../../../types/serviceTypes.type"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public mainSlider: MainSliderType = [
    {
      title: 'Предложение месяца',
      text: 'Продвижение в Instagram для вашего бизнеса <span>-15%</span>!',
      description: '',
      image: 'slide-1.png',
    },
    {
      title: 'Акция',
      text: 'Нужен грамотный <span>копирайтер</span>?',
      description: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: 'slide-2.png',
    },
    {
      title: 'Новость дня',
      text: '<span>6 место</span> в ТОП 10 <br>SMM-агенств Москвы',
      description: 'Мы благодарим каждого, кто голосовал за нас!',
      image: 'slide-3.png',
    },
  ]
  public reviews: MainReviewsType = [
    {
      name: 'Станислав',
      image: 'person1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    }, {
      name: 'Алёна',
      image: 'person2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    }, {
      name: 'Мария',
      image: 'person3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },]
  public services: MainServicesType = [
    {
      image: 'services1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽',
      service: ServiceTypes.development,
    }, {
      image: 'services2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽',
      service: ServiceTypes.advancement,
    }, {
      image: 'services3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽',
      service: ServiceTypes.advertising,
    }, {
      image: 'services4.png',
      title: 'Копирайтинг',
      text: ' Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽',
      service: ServiceTypes.copyrighting,
    },]
  public popularArticles: PopularArticleType | null = null


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
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 26,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false
  }

  public dialogService: MatDialogRef<any> | null = null
  @ViewChild('popup') popup!: TemplateRef<ElementRef>


  constructor(
    private dialog: MatDialog,
    private articleService: ArticleService,
    private popupService: PopupService,
  ) {
  }

  ngOnInit(): void {
    this.articleService.getArticle()
      .subscribe((data: PopularArticleType | DefaultResponseType) => {
        if ((data as DefaultResponseType).message !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }

        this.popularArticles = data as PopularArticleType
      })
  }

  openPopup(service: string, isService: boolean) {
    this.popupService.services(service, isService)
    this.dialogService = this.dialog.open(this.popup)
  }

}
