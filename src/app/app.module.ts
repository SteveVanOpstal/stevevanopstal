import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeModule} from './home/home.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'svo'}),
    HomeModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {
}
