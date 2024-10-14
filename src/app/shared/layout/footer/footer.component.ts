import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private dialog: MatDialog,) { }

  dialogRef: MatDialogRef<any> | null = null
  @ViewChild('popupConsultation') popup!: TemplateRef<ElementRef>

  ngOnInit(): void {
  }

  openPopup() {
    this.dialogRef = this.dialog.open(this.popup)
  }

  closePopup() {
    this.dialogRef?.close()
  }


}
