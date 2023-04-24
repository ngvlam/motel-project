import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appMaxFileSizeValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxFileSizeValidatorDirective,
      multi: true
    }
  ]
})
export class MaxFileSizeValidatorDirective implements Validator {
  @Input() appMaxFileSizeValidator!: number;

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const files = control.value;
    const invalidFiles = files.filter((file: File) => file.size > this.appMaxFileSizeValidator);

    return invalidFiles.length > 0 ? { appMaxFileSizeValidator: true } : null;
  }
}
