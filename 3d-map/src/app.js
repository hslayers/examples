'use strict';
//import 'cesium/Build/CesiumUnminified/Cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import 'hslayers-ng/components/add-layers/add-layers.module';
import 'hslayers-ng/components/datasource-selector/datasource-selector.module';
import 'hslayers-ng/components/draw/draw.module';
import 'hslayers-ng/components/hscesium/hscesium.module';
import 'hslayers-ng/components/info/info.module';
import 'hslayers-ng/components/measure/measure.module';
import 'hslayers-ng/components/permalink/permalink.module';
import 'hslayers-ng/components/print/print.module';
import 'hslayers-ng/components/query/query.module';
import 'hslayers-ng/components/search/search.module';
import 'hslayers-ng/components/sidebar/sidebar.module';
import 'hslayers-ng/components/toolbar/toolbar.module';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
//import {Circle, Fill, Stroke, Style} from 'ol/style';
import {OSM} from 'ol/source';
import {Tile} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {fromLonLat} from 'ol/proj';

const geodata = new VectorSource({
  format: new GeoJSON(),
  url: require('./pasport.geojson'),
});

angular
  .module('hs', [
    'hs.sidebar',
    'hs.toolbar',
    'hs.draw',
    'hs.layermanager',
    'hs.map',
    'hs.query',
    'hs.search',
    'hs.print',
    'hs.permalink',
    'hs.measure',
    'hs.legend',
    'hs.cesium',
    'hs.core',
    'hs.datasource_selector',
    'hs.save-map',
    'hs.addLayers',
    'gettext',
    'hs.compositions',
    'hs.info',
  ])
  .directive('hs', [
    'HsConfig',
    'HsCore',
    function (config, Core) {
      return {
        template: Core.hslayersNgTemplate,
        link: function (scope, element) {
          Core.fullScreenMap(element);
        },
      };
    },
  ])
  .value('HsConfig', {
    cesiumBase: '../node_modules/cesium/Build/Cesium/',
    //cesiumAccessToken:
    //  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDk3ZmM0Mi01ZGFjLTRmYjQtYmFkNC02NTUwOTFhZjNlZjMiLCJpZCI6MTE2MSwiaWF0IjoxNTI3MTYxOTc5fQ.tOVBzBJjR3mwO3osvDVB_RwxyLX7W-emymTOkfz6yGA',
    terrain_providers: [
      {
        title: 'Local terrain',
        url: 'http://gis.lesprojekt.cz/cts/tilesets/rostenice_dmp1g/',
        active: false,
      },
      {
        title: 'EU-DEM',
        url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
        active: true,
      },
    ],
    sizeMode: 'container',
    sidebarClosed: true,
    useIsolatedBootstrap: true,
    useProxy: false,
    //proxyPrefix: "/proxy/",
    panelsEnabled: {
      composition_browser: false,
      saveMap: false,
      language: false,
    },
    default_layers: [
      new Tile({
        source: new OSM({
          url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
          attributions: [
            '<a href="https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use" target="_blank">Wikimedia Maps</a>',
            '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          ],
        }),
        title: 'Wikimedia Map',
        base: true,
        visible: true,
        removable: false,
      }),
      new VectorLayer({
        // Layer without pop-ups
        title: 'Street lights',
        source: geodata,
      }),
    ],
    default_view: new View({
      center: fromLonLat([13.405, 49.741]),
      zoom: 15,
      units: 'm',
    }),
  })
  .controller('MainController', [
    '$scope',
    'HsCore',
    'HsAddLayersWmsAddLayerService',
    'HsConfig',
    'HsLayoutService',
    function ($scope, Core, layerAdderService, config, layoutService) {
      $scope.Core = Core;
      layoutService.sidebarRight = true;
    },
  ]);
