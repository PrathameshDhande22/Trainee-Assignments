import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent {
  @Input()
  control: AbstractControl | null = null;

  @Input()
  errorMessages: { [key: string]: string } = {};

  // Get the keys of errors present on the control
  get errorKeys(): string[] {
    return this.control ? Object.keys(this.control.errors || {}) : [];
  }

  // Get error message for a specific error key
  getErrorMessage(errorKey: string): string {
    return this.errorMessages[errorKey] || 'Invalid field';
  }
}
