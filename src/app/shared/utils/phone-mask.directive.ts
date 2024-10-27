import { Directive, ElementRef, HostListener } from '@angular/core'
import { NgControl } from '@angular/forms'

@Directive({
  selector: '[phoneMask]'
})
export class PhoneMaskDirective {
  private phone: string = '+7 (___) ___-__-__'

  constructor(private element: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event'])
  OnInit(event: Event): void {
    const input = this.element.nativeElement as HTMLInputElement
    let cleaned = input.value.replace(/\D/g, '') // Запрещаем вводить нечисловые значения
    if (cleaned.startsWith('7')) cleaned = cleaned.slice(1) // Если ввели первую цифру 7 то очищаем её
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10) // Ограничиваем длину до 10

    let formatted = '+7 ('
    formatted += cleaned.substring(0, 3) // Код региона
    if (cleaned.length >= 3) formatted += ') '
    formatted += cleaned.substring(3, 6) // Первые три цифры номера
    if (cleaned.length >= 6) formatted += '-'
    formatted += cleaned.substring(6, 8) // Средняя часть номера
    if (cleaned.length >= 8) formatted += '-'
    formatted += cleaned.substring(8, 10) // Последние две цифры номера

    input.value = formatted

  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.element.nativeElement as HTMLInputElement
    if (input.value.length < this.phone.length) {
      this.control.control?.setValue('')
    }

  }

}
