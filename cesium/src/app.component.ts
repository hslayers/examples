import {Component, OnInit} from '@angular/core';
import {Group, Tile} from 'ol/layer';
import {HsCesiumConfig, HslayersCesiumComponent} from 'hslayers-cesium';
import {HsConfig} from 'hslayers-ng/config'
import {HsLayoutService} from 'hslayers-ng/services/layout';
import {
  HsOverlayConstructorService,
  HsPanelConstructorService,
} from 'hslayers-ng/services/panel-constructor';
import {TileWMS} from 'ol/source';
import {View} from 'ol';
import {transform} from 'ol/proj';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private hsConfig: HsConfig,
    private hsCesiumConfig: HsCesiumConfig,
    private hsLayoutService: HsLayoutService,
    private hsOverlayConstructorService: HsOverlayConstructorService,
    private hsPanelConstructorService: HsPanelConstructorService
  ) {
    this.hsCesiumConfig.update({
      cesiumBase: 'assets/cesium/',
    });
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
      shareServiceUrl: '/statusmanager/',
      datasources: [
        {
          title: 'Hub4Everybody',
          url: 'https://hub4everybody.com/micka/csw/',
          language: 'eng',
          type: 'micka',
        },
      ],
      panelsEnabled: {
        tripPlanner: true,
      },
      sidebarPosition: 'right',
    });
    this.hsPanelConstructorService.createActivePanels();
    this.hsOverlayConstructorService.createGuiOverlay();
  }

  ngOnInit(): void {
    this.hsLayoutService.mapSpaceRef.subscribe((viewContainerRef) => {
      if (viewContainerRef) {
        viewContainerRef.createComponent(HslayersCesiumComponent);
      }
    });
  }
}
