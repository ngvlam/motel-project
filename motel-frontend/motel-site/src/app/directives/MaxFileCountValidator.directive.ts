import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appMaxFileCountValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxFileCountValidatorDirective,
      multi: true
    }
  ]
})
export class MaxFileCountValidatorDirective implements Validator {
  @Input() appMaxFileCountValidator!: number;

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const files = control.value;
    return files.length > this.appMaxFileCountValidator ? { appMaxFileCountValidator: true } : null;
  }
}
