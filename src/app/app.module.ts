import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeModule} from './home/home.module';
import {IconService} from './services/icon.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({appId: 'dc'}), BrowserAnimationsModule, HomeModule,
    HttpClientModule, AppRoutingModule
  ],
  providers: [IconService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
