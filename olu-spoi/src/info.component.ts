/* eslint-disable @angular-eslint/component-selector */
import {BehaviorSubject} from 'rxjs';
import {Component, ViewRef} from '@angular/core';

import {HsPanelComponent} from 'hslayers-ng'; //'hslayers-ng/common/panels';
import {HsQueryPopupWidgetBaseComponent} from 'hslayers-ng'; //'hslayers-ng/common/query-popup';
import {TranslateCustomPipe} from 'hslayers-ng';

import {DescriptionComponent} from './description.component';
import {InfoService, ParcelData} from './info.service';

@Component({
  standalone: true,
  imports: [TranslateCustomPipe, DescriptionComponent],
  selector: 'info-widget',
  templateUrl: 'info.component.html',
})
export class InfoWidgetComponent
  extends HsQueryPopupWidgetBaseComponent
  implements HsPanelComponent
{
  name = 'olu+spoi-info-widget';
  data: ParcelData = {
    parcel: {},
  };
  viewRef: ViewRef;
  isVisible$ = new BehaviorSubject(false);

  constructor(public infoService: InfoService) {
    super();
    this.infoService.parcelDataUpdate$.subscribe((data) => {
      this.data = data;
    });
  }

  /*handleKeyUp(e: KeyboardEvent) {
    if (e.key == 'Escape') {
      this.close();
    }
  }*/

  isVisible() {
    return true;
  }
}
