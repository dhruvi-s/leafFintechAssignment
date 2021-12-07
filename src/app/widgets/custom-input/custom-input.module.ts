import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomInputComponent } from "./custom-input.component";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  declarations: [CustomInputModule.rootComponent],
  imports: [CommonModule, MatInputModule],
  exports: [CustomInputModule.rootComponent],
  entryComponents: [CustomInputModule.rootComponent],
})
export class CustomInputModule {
  static rootComponent = CustomInputComponent;
}
