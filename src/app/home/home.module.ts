import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {PipesModule} from '../shared/pipes/pipes.module';
import {SharedModule} from '../shared/shared.module';
import {HomeComponent} from './home.component';

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    CommonModule,
  ],
  exports: [
    HomeComponent,
  ],
  declarations: [
    HomeComponent,
  ]
})
export class HomeModule {
}
