import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FourOhFourComponent } from './four-oh-four.component';
import { FourOhFourRouting } from './four-oh-four-routing';

@NgModule({
  imports: [
    CommonModule,
    FourOhFourRouting
  ],
  declarations: [FourOhFourComponent]
})
export class FourOhFourLazyModule { }