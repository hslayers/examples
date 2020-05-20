'use strict';
import 'hslayers-ng/components/datasource-selector/datasource-selector.module';
import 'hslayers-ng/components/info/info.module';
import 'hslayers-ng/components/permalink/permalink.module';
import 'hslayers-ng/components/print/print.module';
import 'hslayers-ng/components/query/query.module';
import 'hslayers-ng/components/search/search.module';
import 'hslayers-ng/components/sidebar/sidebar.module';
import 'hslayers-ng/components/toolbar/toolbar.module';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
import {Circle, Fill, Stroke, Style} from 'ol/style';
import {OSM} from 'ol/source';
import {Point} from 'ol/geom';
import {Tile} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {transform} from 'ol/proj';

const count = 200;
const features = new Array(count);
const e = 4500000;
for (let i = 0; i < count; ++i) {
  const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
  features[i] = new Feature(new Point(coordinates));
}

angular
  .module('hs', [
    'hs.sidebar',
    'hs.toolbar',
    'hs.layermanager',
    'hs.map',
    'hs.query',
    'hs.search',
    'hs.permalink',
    'hs.legend',
    'hs.core',
    'hs.datasource_selector',
    'hs.save-map',
    'gettext',
    'hs.compositions',
    'hs.info',
  ])
  .directive('hs', [
    'config',
    'Core',
    function (config, Core) {
      return {
        template: Core.hslayersNgTemplate,
        link: function (scope, element) {
          Core.fullScreenMap(element);
        },
      };
    },
  ])
  .value('config', {
    proxyPrefix: '/proxy/',
    default_layers: [
      new Tile({
        source: new OSM(),
        title: 'Base layer',
        base: true,
        removable: false,
      }),
      new VectorLayer({
        title: 'Test',
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
        source: new VectorSource({
          features: features,
        }),
        cluster: true,
        declutter: true,
      }),
    ],
    project_name: 'erra/map',
    default_view: new View({
      center: transform([23.3885193, 56.4769034], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
      zoom: 13,
      units: 'm',
    }),
    advanced_form: true,
    panelWidths: {
      sensors: 600,
    },
    panelsEnabled: {
      language: false,
    },
    'catalogue_url': '/php/metadata/csw',
    status_manager_url: '/wwwlibs/statusmanager2/index.php',
  })
  .controller('MainController', [
    '$scope',
    'Core',
    function ($scope, Core) {
      $scope.Core = Core;
      Core.sidebarRight = false;
      Core.singleDatasources = true;
    },
  ]);
