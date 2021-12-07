import { NormalResponses } from 'app/layouts/admin-layout/normalresponses';
import { map, catchError } from 'rxjs/operators';
import { ValidationService } from './../validation/validation.service';
import { Directive } from '@angular/core';
import { AsyncValidator, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
export function uniqueUsernameValidator(validationService: ValidationService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

    console.log('Value=' + control.value);

    return validationService.userName(control.value).
      pipe(

        map(

          res => {
            console.log('Response=' + res);

            const normalReposne: NormalResponses = res;
            if (normalReposne.isTrue) {
              return {
                'uniqueUsernameValidator': true
              }
            } else {
              return {
                'uniqueUsernameValidator': false
              }
            }
          }
        ),
        catchError(err => of([]))
      );

  }
}
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[uniqueUsernameValidator]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniqueUsernameValidatorDirective, multi: true }]
})
export class UniqueUsernameValidatorDirective implements AsyncValidator {

  constructor(private validationService: ValidationService) { }
  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.validationService.userName(control.value).
      pipe(
        map(res => {
          const normalReposne: NormalResponses = res;
          if (normalReposne.isTrue) {
            return {
              'uniqueUsernameValidator': true
            }
          } else {
            return {
              'uniqueUsernameValidator': false
            }
          }
        }
        )

      )

  }
  registerOnValidatorChange?(fn: () => void): void {
    // throw new Error("Method not implemented.");
  }

}
