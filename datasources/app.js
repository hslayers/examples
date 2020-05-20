'use strict';
import 'hslayers-ng/components/add-layers/add-layers.module';
import 'hslayers-ng/components/datasource-selector/datasource-selector.module';
import 'hslayers-ng/components/info/info.module';
import 'hslayers-ng/components/measure/measure.module';
import 'hslayers-ng/components/permalink/permalink.module';
import 'hslayers-ng/components/print/print.module';
import 'hslayers-ng/components/query/query.module';
import 'hslayers-ng/components/search/search.module';
import 'hslayers-ng/components/sidebar/sidebar.module';
import 'hslayers-ng/components/toolbar/toolbar.module';
import View from 'ol/View';
import {OSM} from 'ol/source';
import {Tile} from 'ol/layer';
import {transform} from 'ol/proj';

function getHostname() {
  const url = window.location.href;
  const urlArr = url.split('/');
  const domain = urlArr[2];
  return urlArr[0] + '//' + domain;
}

angular
  .module('hs', [
    'hs.sidebar',
    'hs.info',
    'hs.toolbar',
    'hs.layermanager',
    'hs.query',
    'hs.search',
    'hs.print',
    'hs.permalink',
    'hs.geolocation',
    'hs.datasource_selector',
    'hs.save-map',
    'hs.measure',
    'hs.addLayers',
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
    default_layers: [
      new Tile({
        source: new OSM(),
        title: 'Base layer',
        base: true,
        removable: false,
      }),
    ],
    project_name: 'erra/map',
    default_view: new View({
      center: transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
      zoom: 4,
      units: 'm',
    }),
    advanced_form: true,
    allowAddExternalDatasets: true,
    datasources: [
      /*{
            title: "Datatank",
            url: "http://ewi.mmlab.be/otn/api/info",
            type: "datatank"
        },
        {
            title: "Datasets",
            url: "http://otn-dev.intrasoft-intl.com/otnServices-1.0/platform/ckanservices/datasets",
            language: 'eng',
            type: "ckan",
            download: true
        }, */ {
        title: 'SuperCAT',
        url: 'http://cat.ccss.cz/csw/',
        language: 'eng',
        type: 'micka',
        code_list_url:
          'http://www.whatstheplan.eu/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D',
      },
      {
        title: 'Layman',
        url: `${window.location.protocol}//${window.location.hostname}/layman`,
        user: 'browser',
        type: 'layman',
      },
      {
        title: 'OTN Hub',
        url: 'http://opentnet.eu/php/metadata/csw/',
        language: 'eng',
        type: 'micka',
        code_list_url:
          'http://opentnet.eu/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D',
      },
    ],
    hostname: {
      'default': {
        'title': 'Default',
        'type': 'default',
        'editable': false,
        'url': getHostname(),
      },
    },
    'catalogue_url': '/php/metadata/csw',
    'compositions_catalogue_url': '/php/metadata/csw',
    status_manager_url: '/wwwlibs/statusmanager2/index.php',
    //,datasource_selector: {allow_add: false}
  })
  .controller('MainController', [
    '$scope',
    'HsCore',
    'HsMapService',
    'HsLayoutService',
    function ($scope, Core, mapService, layoutService) {
      $scope.Core = Core;
      $scope.Core.sidebarRight = false;
      //$scope.Core.sidebarToggleable = false;
      $scope.Core.sidebarButtons = true;
      layoutService.setDefaultPanel('layermanager');
    },
  ]);
