import View from 'ol/View';
import {Component, ComponentFactoryResolver} from '@angular/core';
import {Group, Tile} from 'ol/layer';
import {HsCesiumConfig, HslayersCesiumComponent} from 'hslayers-cesium';
import {HsConfig, HsLayoutService} from 'hslayers-ng';
import {TileWMS} from 'ol/source';
import {transform} from 'ol/proj';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private HsConfig: HsConfig,
    private HsCesiumConfig: HsCesiumConfig,
    private HsLayoutService: HsLayoutService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.HsCesiumConfig.update({
      cesiumBase: 'assets/cesium/',
    });
    this.HsConfig.update({
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
      default_layers: [],
      default_view: new View({
        center: transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 4,
      }),
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
        tripPlanner: true,
      },
      sidebarPosition: 'right',
    });
  }

  ngOnInit(): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        HslayersCesiumComponent
      );
    this.HsLayoutService.mapSpaceRef.subscribe((params) => {
      if (params?.viewContainerRef) {
        params.viewContainerRef.createComponent(componentFactory);
      }
    });
  }
}
