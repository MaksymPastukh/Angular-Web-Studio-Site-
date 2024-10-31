import { HttpErrorResponse } from '@angular/common/http'
import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialogRef } from "@angular/material/dialog"
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subscription } from 'rxjs'
import { DefaultResponseType } from 'src/types/default-response.type'
import { FormTypes } from 'src/types/formTypes.type'
import { MainServicesType } from 'src/types/main-services.type'
import { RequestsType } from 'src/types/requests.type'
import { ServiceTypes } from 'src/types/serviceTypes.type'
import { PopupService } from '../../services/popup.service'

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy {
  public isSuccess: boolean = false
  public isServices: boolean = false
  public isConsultation: boolean = false
  private subscriptionOrder: Subscription | null = null
  private subscriptionConsultation: Subscription | null = null

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


  public serviceForm = this.fb.group({
    service: ['', Validators.required],
    name: ['', [Validators.required]],
    phone: ['', Validators.required],
  })

  public consultationForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  get nameConsultationForm() {
    return this.consultationForm.get('name')
  }

  get phoneConsultationForm() {
    return this.consultationForm.get('phone')
  }

  get nameServiceForm() {
    return this.serviceForm.get('name')
  }

  get phoneServiceForm() {
    return this.serviceForm.get('phone')
  }


  dialogRef: MatDialogRef<any> | null = null

  constructor(private fb: FormBuilder, private popupService: PopupService, private _snackBar: MatSnackBar) {
  }

  @Input('dialogService') dialogService!: MatDialogRef<any> | null

  ngOnInit(): void {
    this.isServices = this.popupService.isServices
    this.isConsultation = this.popupService.isConsultation
    const service = this.popupService.service
    const selected = this.services.find(item => item.service === service)
    if (selected) {
      this.serviceForm.patchValue({ service: selected.service })
    } else {
      this.serviceForm.patchValue({ service: ServiceTypes.advertising })
    }

    this.dialogService?.backdropClick()
    this.popupService.isServices = false
    this.popupService.isConsultation = false
  }

  closePopup(): void {
    this.popupService.isServices = false
    this.popupService.isConsultation = false
    this.dialogService?.close()
  }

  leaveRequest() {
    if (this.serviceForm.valid &&
      this.serviceForm.value.service &&
      this.serviceForm.value.name &&
      this.serviceForm.value.phone) {

      const newParamsObj: RequestsType = {
        name: this.serviceForm.value.name,
        phone: this.serviceForm.value.phone,
        service: this.serviceForm.value.service,
        type: FormTypes.order
      }

      this.subscriptionOrder = this.popupService.requestOrder(newParamsObj)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message)
              throw new Error(data.message)
            }

            this.isServices = false
            this.popupService.isServices = false
            this.isSuccess = true
            console.log(this.isServices)
            this.serviceForm.reset()
            this.dialogRef?.close()
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка заказа услуги')
            }
          }
        })
    }
  }

  consultation(): void {
    if (this.consultationForm.valid &&
      this.consultationForm.value.name &&
      this.consultationForm.value.phone) {

      const newParamsObj: RequestsType = {
        name: this.consultationForm.value.name,
        phone: this.consultationForm.value.name,
        service: 'unknown',
        type: FormTypes.consultation
      }

      this.subscriptionConsultation = this.popupService.requestOrder(newParamsObj)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message)
              throw new Error(data.message)
            }

            this.isConsultation = false
            this.popupService.isConsultation = false
            this.isSuccess = true
            this.consultationForm.reset()
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка заказа консультации')
            }
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.subscriptionOrder?.unsubscribe()
    this.subscriptionConsultation?.unsubscribe()
  }
}
