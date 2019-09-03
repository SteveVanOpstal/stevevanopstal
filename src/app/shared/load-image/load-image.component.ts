import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'svo-load-image',
  template: `
    <img [src]="srcThumb" [alt]="alt" class="thumb"/>
    <img [src]="src" [srcset]="srcset" [sizes]="sizes" [alt]="alt" (load)="ready = true"/>`,
  styleUrls: ['load-image.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class LoadImageComponent {
  @Input() src: string;
  @Input() srcset: string;
  @Input() sizes: string;
  @Input() srcThumb: string;
  @Input() alt: string;

  @HostBinding('attr.ready') ready;
}
