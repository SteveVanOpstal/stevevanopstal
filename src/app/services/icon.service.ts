import {isPlatformServer} from '@angular/common';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class IconService {
  constructor(
      private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer,
      @Inject(PLATFORM_ID) private platformId: string) {
    this.register('call', 'assets/icons/call.svg');
    this.register('open_in_new', 'assets/icons/open_in_new.svg');
  }

  private register(name: string, url: string) {
    this.iconRegistry.addSvgIcon(
        name,
        this.sanitizer.bypassSecurityTrustResourceUrl(
            (isPlatformServer(this.platformId) ? environment.base_url : '') + '/' + url));
  }
}
