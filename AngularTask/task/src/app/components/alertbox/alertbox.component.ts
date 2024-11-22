import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type AlertType = 'Danger' | 'Success' | 'Warning' | 'Info';

@Component({
  selector: 'app-alertbox',
  templateUrl: './alertbox.component.html',
})
export class AlertboxComponent {
  @Input()
  type: AlertType = 'Danger';

  public _isVisible: boolean = false;

  @Input()
  set Open(value: boolean) {
    this._isVisible = value;
    if (value) {
      this.showAlert();
    }
  }

  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  // the alert box will be automatially removed from the dom after 5 seconds.
  showAlert() {
    setTimeout(() => {
      this._isVisible = false;
      this.close.emit();
    }, 4000);
  }

  // when clicked on cross button these function will be called.
  onClose() {
    this.close.emit();
    this._isVisible = false;
  }
}
