/* eslint-disable @angular-eslint/component-selector */
import {AsyncPipe} from '@angular/common';
import {Component} from '@angular/core';

import {HsQueryPopupWidgetBaseComponent} from 'hslayers-ng'; //'hslayers-ng/common/query-popup';
import {TranslateCustomPipe} from 'hslayers-ng';

import {DescriptionComponent} from './description.component';
import {InfoService} from './info.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, TranslateCustomPipe, DescriptionComponent],
  selector: 'info-widget',
  templateUrl: 'info.component.html',
})
export class InfoWidgetComponent extends HsQueryPopupWidgetBaseComponent {
  name = 'olu+spoi-info-widget';
  /*data: ParcelData = {
    parcel: {},
  };*/

  constructor(public infoService: InfoService) {
    super();
    /*this.infoService.parcelDataUpdate$.subscribe((data) => {
      this.data = new Observable(()data);
    });*/
  }

  /*handleKeyUp(e: KeyboardEvent) {
    if (e.key == 'Escape') {
      this.close();
    }
  }*/
}
