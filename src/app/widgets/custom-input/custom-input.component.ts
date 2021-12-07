import { Component, Input, OnInit, Optional, Self } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";

@Component({
  selector: "custom-input",
  templateUrl: "./custom-input.component.html",
  styleUrls: ["./custom-input.component.scss"],
})
export class CustomInputComponent implements OnInit, ControlValueAccessor {
  @Input() field_label: string;
  @Input() disabled: boolean;
  @Input() placeholder: string = "";
  @Input() field_name: string = "";
  @Input() type: "text" | "email" | "password" | "textarea" = "text";
  value: any = "";
  constructor(
    // Retrieve the dependency only from the local injector,
    // not from parent or ancestors.
    @Self() // We want to be able to use the component without a form,
    // so we mark the dependency as optional.
    @Optional()
    private ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: any): void {
    this.value = value;
  }
  /**
   * Update form when DOM element value changes (view => model)
   */
  registerOnChange(fn: any): void {
    // Store the provided function as an internal method.
    this.onChange = fn;
  }
  /**
   * Update form when DOM element is blurred (view => model)
   */
  registerOnTouched(fn: any): void {
    // Store the provided function as an internal method.
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {}
  onChange() {}
  onTouched() {}
}
