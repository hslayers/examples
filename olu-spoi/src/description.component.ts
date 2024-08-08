/* eslint-disable @angular-eslint/component-selector */
import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Component({
  standalone: true,
  selector: 'description',
  templateUrl: 'description.component.html',
})
export class DescriptionComponent implements OnInit {
  @Input() object;
  @Input() url?;
  selectedAttr;

  constructor(private httpClient: HttpClient) {}

  async ngOnInit() {
    if (this.object === undefined && this.url && typeof this.url == 'string') {
      this.object = {attributes: []};
      const q =
        'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
        encodeURIComponent('describe <' + this.url + '>') +
        '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
      let response;
      try {
        response = await lastValueFrom(this.httpClient.get(q));
      } catch (ex) {
        console.log(ex);
      }
      if (response.results === undefined) {
        return;
      }
      for (const b of response.results.bindings) {
        let short_name = b.p.value;
        if (short_name.indexOf('#') > -1) {
          short_name = short_name.split('#')[1];
        }
        this.object.attributes.push({
          short_name: short_name,
          value: b.o.value,
        });
      }
    }
  }

  describe(attribute) {
    this.selectedAttr = attribute;
  }
}
