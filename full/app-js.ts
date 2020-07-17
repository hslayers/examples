'use strict';
import 'hslayers-ng/components/add-layers/add-layers.module';
import 'hslayers-ng/components/datasource-selector/datasource-selector.module';
import 'hslayers-ng/components/draw/draw.module';
import 'hslayers-ng/components/info/info.module';
import 'hslayers-ng/components/permalink/permalink.module';
import 'hslayers-ng/components/query/query.module';
import 'hslayers-ng/components/search/search.module';
import 'hslayers-ng/components/sidebar/sidebar.module';
import 'hslayers-ng/components/toolbar/toolbar.module';
import * as angular from 'angular';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
import {Group, Tile} from 'ol/layer';
import {OSM, TileWMS, XYZ} from 'ol/source';
import {Vector as VectorSource} from 'ol/source';
import {transform} from 'ol/proj';

const count = 20000;
const features = new Array(count);
const e = 4500000;
for (let i = 0; i < count; ++i) {
  const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
  features[i] = new Feature({geometry: new Point(coordinates), name: 'test'});
}

export default angular
  .module('hs', [
    'hs.sidebar',
    'hs.toolbar',
    'hs.draw',
    'hs.layermanager',
    'hs.map',
    'hs.query',
    'hs.search',
    'hs.permalink',
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
    importCss: true,
    proxyPrefix:
      window.location.hostname.indexOf('ng.hslayers') == -1
        ? `${window.location.protocol}//${window.location.hostname}:8085/`
        : '/proxy/',
    open_lm_after_comp_loaded: true,
    layer_order: '-position',
    box_layers: [
      new Group({
        title: 'Base layer',
        layers: [
          new Tile({
            source: new OSM(),
            title: 'OpenStreetMap',
            base: true,
            visible: true,
            removable: false,
          }),
          new Tile({
            title: 'OpenCycleMap',
            visible: false,
            base: true,
            source: new OSM({
              url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
            }),
          }),
          new Tile({
            title: 'Satellite',
            visible: false,
            base: true,
            source: new XYZ({
              url:
                'http://api.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicmFpdGlzYmUiLCJhIjoiY2lrNzRtbGZnMDA2bXZya3Nsb2Z4ZGZ2MiJ9.g1T5zK-bukSbJsOypONL9g',
            }),
          }),
        ],
      }),
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
      zoom: 4,
      units: 'm',
    }),
    allowAddExternalDatasets: true,
    compositions_catalogue_url:
      '/php/catalogue/libs/cswclient/cswClientRun.php',
    status_manager_url: '/wwwlibs/statusmanager2/index.php',
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
    inlineLegend: true,
  })

  .controller('MainController', [
    '$scope',
    'HsCore',
    'HsAddLayersWmsAddLayerService',
    'HsCompositionsParserService',
    'HsConfig',
    'HsLayoutService',
    function (
      $scope,
      Core,
      layerAdderService,
      composition_parser,
      config,
      layoutService
    ) {
      layoutService.sidebarRight = true;
      //layerAdderService.addService('http://erra.ccss.cz/geoserver/ows', config.box_layers[1]);
    },
  ]);
