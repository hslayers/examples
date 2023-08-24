import {Circle, Fill, Stroke, Style} from 'ol/style';
import {Component} from '@angular/core';
import {Feature, View} from 'ol';
import {HsConfig} from 'hslayers-ng';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Point} from 'ol/geom';
import {Tile, Vector as VectorLayer} from 'ol/layer';
import {transform} from 'ol/proj';

const count = 2000;
const features = new Array(count);
const e = 4500000;
for (let i = 0; i < count; ++i) {
  const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
  features[i] = new Feature({geometry: new Point(coordinates), name: 'test'});
}

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private hsConfig: HsConfig) {
    this.hsConfig.update({
      assetsPath: 'assets/hslayers-ng',
      reverseLayerList: false,
      default_layers: [
        new Tile({
          properties: {
            title: 'Base layer',
            base: true,
            removable: false,
          },
          source: new OSM(),
        }),
        new VectorLayer({
          properties: {
            title: 'Test',
            synchronize: false,
            cluster: true,
            declutter: true,
            editor: {
              editable: false,
            },
          },
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 128, 123, 0.2)',
            }),
            stroke: new Stroke({
              color: '#e49905',
              width: 2,
            }),
            image: new Circle({
              radius: 5,
              fill: new Fill({
                color: 'orange',
              }),
              stroke: new Stroke({
                color: 'green',
              }),
            }),
          }),
          source: new VectorSource({features}),
        }),
      ],
      default_view: new View({
        center: transform([6, 20], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 4,
      }),
      panelsEnabled: {
        tripPlanner: false,
        info: false,
        draw: false,
        print: false,
        permalink: false,
        saveMap: false,
        legend: false,
        language: false,
        composition_browser: false,
        compositionLoadingProgress: false,
        addData: false,
        measure: false,
      },
    });
  }
}
