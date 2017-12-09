import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ErrorModalComponent } from "../../components/error-modal/error-modal.component";

@NgModule({
  declarations: [
    ErrorModalComponent
  ],
  imports: [CommonModule],
  providers: [],
  exports: [ErrorModalComponent]
})
export class SharedModule { }
