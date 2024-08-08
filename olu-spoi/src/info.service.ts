import {BehaviorSubject, lastValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

export type PoiAttribute = {
  short_name: string;
  value;
};

export type Poi = {
  url?: string;
  attributes?: PoiAttribute[];
  expanded?: boolean;
};

export type ParcelData = {
  parcel: {
    id?: string;
    attributes?: PoiAttribute[];
    pois?: Poi[];
  };
};

@Injectable({providedIn: 'root'})
export class InfoService {
  parcelDataUpdate$ = new BehaviorSubject<ParcelData>({parcel: {}});

  constructor(private httpClient: HttpClient) {}

  async describePoi(poi: Poi) {
    if (poi.expanded === undefined) {
      poi.expanded = false;
    }
    poi.expanded = !poi.expanded;
    if (poi.expanded) {
      const q =
        'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
        encodeURIComponent('describe <' + poi.url + '>') +
        '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
      const response = await lastValueFrom<any>(this.httpClient.get(q));
      if (response.results === undefined) {
        return;
      }
      poi.attributes = [];
      for (const b of response.results.bindings) {
        let short_name = b.p.value;
        if (short_name.includes('#')) {
          short_name = short_name.split('#')[1];
        }
        poi.attributes.push({short_name: short_name, value: b.o.value});
      }
      //if (!$scope.$$phase) $scope.$apply();
    } /*else {
      if (!$scope.$$phase) $scope.$apply();
    }*/
    return false;
  }
}
