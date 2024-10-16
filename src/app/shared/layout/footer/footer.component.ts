import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {


  constructor(private dialog: MatDialog, private popupService: PopupService
              ) {
  }

  public dialogService: MatDialogRef<any> | null = null
  @ViewChild('popup') popup!: TemplateRef<ElementRef>

  ngOnInit(): void {
  }

  openPopup(isConsultation: boolean): void {
    this.popupService.consultation(isConsultation)
    this.dialogService = this.dialog.open(this.popup)
  }
}
