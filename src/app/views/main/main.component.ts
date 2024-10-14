import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {MainSliderType} from "../../../types/main-slider.type";
import {MainReviewsType} from "../../../types/main-reviews.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

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

  dialogRef: MatDialogRef<any> | null = null
  @ViewChild('popupApplication') popup!: TemplateRef<ElementRef>

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  openPopup() {
    this.dialogRef = this.dialog.open(this.popup)
  }

  closePopup() {
    this.dialogRef?.close()
  }

}
