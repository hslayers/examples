import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
import {Component, ComponentFactoryResolver} from '@angular/core';
import {Group, Tile} from 'ol/layer';
import {HsConfig, HsLayoutService} from 'hslayers-ng';
import {OSM, TileWMS, XYZ} from 'ol/source';
import {Vector as VectorSource} from 'ol/source';
import {transform} from 'ol/proj';
import {HslayersCesiumComponent} from 'hslayers-cesium';

const count = 200;
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
    private HsConfig: HsConfig,
    private HsLayoutService: HsLayoutService,
    private componentFactoryResolver: ComponentFactoryResolver
    ) {
    this.HsConfig.update({
      cesiumBase: 'assets/cesium/',
      assetsPath: 'assets/hslayers-ng',
      proxyPrefix: window.location.hostname.includes('localhost')
        ? `${window.location.protocol}//${window.location.hostname}:8085/`
        : '/proxy/',
      popUpDisplay: 'click',
      open_lm_after_comp_loaded: true,
      reverseLayerList: false,
      box_layers: [
        new Group({
          title: 'WMS layers',
          layers: [
            new Tile({
              title: 'Swiss',
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
          source: new VectorSource({features}),
        }),
      ],
      default_view: new View({
        center: transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 4
      }),
      allowAddExternalDatasets: true,
      status_manager_url: '/statusmanager/',
      datasources: [
        {
          title: 'SuperCAT',
          url: 'http://cat.ccss.cz/csw/',
          language: 'eng',
          type: 'micka',
          code_list_url:
            '/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D',
        },
      ],
      panelsEnabled: {
        tripPlanner: true
      },
      sidebarPosition: 'right',
    });
  }

  ngOnInit(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      HslayersCesiumComponent
    );
    this.HsLayoutService.mapSpaceRef.subscribe((mapSpace) => {
      if (mapSpace) {
        mapSpace.createComponent(componentFactory);
      }
    });
    
  }
}
