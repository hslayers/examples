import {Component} from '@angular/core';
import {Feature, View} from 'ol';
import {Group, Tile, Vector as VectorLayer} from 'ol/layer';
import {HsConfig, HsToastService} from 'hslayers-ng';
import {OSM, TileWMS, Vector as VectorSource, XYZ} from 'ol/source';
import {Point} from 'ol/geom';
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
  constructor(
    private hsConfig: HsConfig,
    private hsToastService: HsToastService
  ) {
    this.hsConfig.update({
      assetsPath: 'assets/hslayers-ng',
      proxyPrefix: window.location.hostname.includes('localhost')
        ? `${window.location.protocol}//${window.location.hostname}:8085/`
        : '/proxy/',
      popUpDisplay: 'click',
      open_lm_after_comp_loaded: true,
      reverseLayerList: false,
      box_layers: [
        new Group({
          properties: {
            title: 'Base layer',
          },
          layers: [
            new Tile({
              properties: {
                title: 'OpenStreetMap',
                base: true,
                removable: false,
              },
              visible: true,
              source: new OSM(),
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
        new Group({
          properties: {
            title: 'WMS layers',
          },
          layers: [
            new Tile({
              properties: {
                title: 'Swiss',
              },
              source: new TileWMS({
                url: 'http://wms.geo.admin.ch/',
                params: {
                  LAYERS: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
                  INFO_FORMAT: undefined,
                  FORMAT: 'image/png; mode=8bit',
                },
                crossOrigin: 'anonymous',
              }),
            }),
          ],
        }),
      ],
      default_layers: [
        new VectorLayer({
          properties: {
            title: 'Bookmarks',
            synchronize: false,
            cluster: true,
            inlineLegend: true,
            popUp: {
              attributes: ['name'],
            },
            editor: {
              editable: true,
              defaultAttributes: {
                name: 'New bookmark',
                description: 'none',
              },
            },
            path: 'User generated',
          },
          source: new VectorSource({features}),
        }),
      ],
      default_view: new View({
        center: transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 4,
      }),
      datasources: [
        {
          title: 'Micka',
          url: 'https://watlas.lesprojekt.cz/micka/csw/',
          language: 'eng',
          type: 'micka',
        },
      ],
      panelsEnabled: {
        tripPlanner: true,
      },
      sidebarPosition: 'right',
    });
    this.hsToastService.createToastPopupMessage('Hello', 'Your map is ready!', {
      toastStyleClasses: 'bg-info text-white',
    });
  }
}
