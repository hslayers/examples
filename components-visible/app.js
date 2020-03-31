'use strict';
import 'toolbar.module';
import 'print.module';
import 'query.module';
import 'search.module';
import 'measure.module';
import 'permalink.module';
import 'info.module';
import 'datasource-selector.module';
import 'sidebar.module';
import 'add-layers.module';
import 'draw.module';
import {Tile, Group} from 'ol/layer';
import {OSM} from 'ol/source';
import View from 'ol/View';
import {transform} from 'ol/proj';

angular.module('hs', [
  'hs.sidebar',
  'hs.toolbar',
  'hs.draw',
  'hs.layermanager',
  'hs.map',
  'hs.query',
  'hs.search', 'hs.print', 'hs.permalink', 'hs.measure',
  'hs.legend', 'hs.core',
  'hs.datasource_selector',
  'hs.save-map',
  'hs.addLayers',
  'gettext',
  'hs.compositions',
  'hs.info'
])

  .directive('hs', ['config', 'Core', function (config, Core) {
    return {
      template: Core.hslayersNgTemplate,
      link: function (scope, element) {
        Core.fullScreenMap(element);
      }
    };
  }])

  .value('config', {
    importCss: true,
    proxyPrefix: '/proxy/',
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
            removable: false
          })
        ]
      })
    ],
    default_layers: [
    ],
    componentsEnabled: {
      sidebar: true,
      toolbar: true,
      guiOverlay: true,
      drawToolbar: true,
      searchToolbar: true,
      measureToolbar: true,
      golocationButton: false,
      mapControls: false
    },
    mapInteractionsEnabled: true,
    default_view: new View({
      center: transform([17.474129, 52.574000], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
      zoom: 4,
      units: 'm'
    }),
    allowAddExternalDatasets: true,
    compositions_catalogue_url: '/php/catalogue/libs/cswclient/cswClientRun.php',
    status_manager_url: '/wwwlibs/statusmanager2/index.php',
    datasources: []
  })

  .controller('MainController', [
    function () {
    }
  ]);

