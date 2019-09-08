import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {LoadImageComponent} from './load-image/load-image.component';
import {PipesModule} from './pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
  ],
  exports: [
    LoadImageComponent,
  ],
  declarations: [
    LoadImageComponent,
  ]
})
export class SharedModule {
}
