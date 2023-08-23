import View from 'ol/View';
import {Component} from '@angular/core';
import {Group, Tile} from 'ol/layer';
import {HsConfig} from 'hslayers-ng';
import {OSM, XYZ} from 'ol/source';
import {transform} from 'ol/proj';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private HsConfig: HsConfig) {
    this.HsConfig.update({
      assetsPath: 'assets/hslayers-ng',
      proxyPrefix: window.location.hostname.includes('localhost')
        ? `${window.location.protocol}//${window.location.hostname}:8085/`
        : '/proxy/',
      popUpDisplay: 'click',
      box_layers: [
        new Group({
          properties: {
            title: 'Base layer',
          },
          layers: [
            new Tile({
              source: new OSM(),
              properties: {
                title: 'OpenStreetMap',
                base: true,
                removable: false,
              },
              visible: true,
            }),
            new Tile({
              properties: {
                title: 'OpenCycleMap',
                base: true,
              },
              visible: false,
              source: new OSM({
                url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
              }),
            }),
            new Tile({
              properties: {
                title: 'Satellite',
                base: true,
              },
              visible: false,
              source: new XYZ({
                url: 'http://api.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicmFpdGlzYmUiLCJhIjoiY2lrNzRtbGZnMDA2bXZya3Nsb2Z4ZGZ2MiJ9.g1T5zK-bukSbJsOypONL9g',
              }),
            }),
          ],
        }),
      ],
      default_view: new View({
        center: transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 4,
      }),
      panelsEnabled: {
        tripPlanner: true,
      },
    });
  }
}
