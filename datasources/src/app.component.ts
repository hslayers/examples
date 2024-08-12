import {Component} from '@angular/core';
import {Feature, View} from 'ol';
import {HsConfig} from 'hslayers-ng/config';
import {
  HsOverlayConstructorService,
  HsPanelConstructorService,
} from 'hslayers-ng/services/panel-constructor';
import {OSM} from 'ol/source';
import {Point} from 'ol/geom';
import {Tile} from 'ol/layer';
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
    private hsOverlayConstructorService: HsOverlayConstructorService,
    private hsPanelConstructorService: HsPanelConstructorService
  ) {
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
      ],
      default_view: new View({
        center: transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 4,
      }),
      /*
       * You define your datasources in a list here
       * There can be any number of data sources
       * Supported types are Layman and Micka servers
       */
      datasources: [
        {
          title: 'Layman Hub4Everybody',
          url: 'https://hub4everybody.com',
          type: 'layman',
        },
        {
          title: 'Layman Agrihub',
          url: 'https://www.agrihub.cz',
          type: 'layman',
        },
        {
          title: 'Layman SmartAfriHub',
          url: 'https://smartafrihub.com',
          type: 'layman',
        },
        {
          title: 'Layman SmartAfriHub',
          url: 'https://smartafrihub.com',
          type: 'layman',
        },
        {
          title: 'Layman Plan4All Hub',
          url: 'https://hub.plan4all.eu',
          type: 'layman',
        },
        {
          title: 'Layman SIEUSOIL Hub',
          url: 'https://hub.sieusoil.eu',
          type: 'layman',
        },
        {
          title: 'Layman POLIRURAL Hub',
          url: 'https://hub.polirural.eu',
          type: 'layman',
        },
        // Following datasource requires hslayers-server properly configured via .env file and up and running
        /*{
          title: 'Layman via hslayers-server proxy',
          url: 'http://localhost:8087',
          type: 'layman',
        },*/
        {
          title: 'Micka Hub4Everybody',
          url: 'https://hub4everybody.com/micka/csw',
          language: 'eng',
          type: 'micka',
        },
        //FIXME: correct URI
        /*{
          title: 'Micka Národní Geoportál',
          url: 'https://geoportal.gov.cz/php/catalogue/libs/cswclient',
          language: 'eng',
          type: 'micka',
        },*/
        {
          title: 'Micka CENIA',
          url: 'https://micka.cenia.cz/csw',
          language: 'eng',
          type: 'micka',
        },
        {
          title: 'Micka ČGS',
          url: 'http://micka.geology.cz/csw',
          language: 'eng',
          type: 'micka',
        },
        {
          title: 'Micka Liberecký kraj',
          url: 'https://metadata.kraj-lbc.cz/csw',
          language: 'eng',
          type: 'micka',
        },
        {
          title: 'Micka VÚV TGM',
          url: 'https://heis.vuv.cz/xmicka/csw',
          language: 'eng',
          type: 'micka',
        },
        //FIXME: some old version of Micka running there...
        /*{
          title: 'Micka ZČU',
          url: 'https://mapserver.zcu.cz/php/metadata/csw',
          language: 'eng',
          type: 'micka',
        },*/
      ],
      /*proxyPrefix: window.location.hostname.includes('localhost')
        ? `${window.location.protocol}//127.0.0.1:8085/`
        : '/proxy/',*/
      useProxy: false,
      panelsEnabled: {
        tripPlanner: false,
        query: true,
        draw: false,
        print: false,
        share: false,
        saveMap: false,
        legend: true,
        language: false,
        compositions: false,
        addData: true,
        measure: false,
      },
      componentsEnabled: {
        info: false,
      },
    });
    /* Panels in sidebar and other GUI components like toolbar
     * must be initialized programmatically since HSL 14
     */
    this.hsPanelConstructorService.createActivePanels();
    this.hsOverlayConstructorService.createGuiOverlay();
  }
}
