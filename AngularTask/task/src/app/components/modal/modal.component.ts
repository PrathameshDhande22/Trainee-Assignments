import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input()
  title: string = '';

  @Input()
  type: 'Delete' = 'Delete';

  @Input()
  open: boolean = false;

  @Output()
  cancel: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  confirm: EventEmitter<void> = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.closeModal();
  }

  onCancel() {
    this.cancel.emit();
    this.closeModal();
  }

  closeModal() {
    this.open = false;
  }
}
