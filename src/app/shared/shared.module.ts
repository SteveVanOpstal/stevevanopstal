import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {LoadImageComponent} from './load-image/load-image.component';
import {PipesModule} from './pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    MatButtonModule,
    MatIconModule,
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
