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
import { Tile, Group } from 'ol/layer';
import { OSM } from 'ol/source';
import View from 'ol/View';
import {transform} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON';

const geodata = new VectorSource({
  format: new GeoJSON(),
  url: require('./pasport.geojson')
});

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
]).directive('hs', ['config', 'Core', function (config, Core) {
  return {
    template: Core.hslayersNgTemplate,
    link: function (scope, element) {
      Core.fullScreenMap(element);
    }
  };
}]).value('config', {
  panelsEnabled: {
    composition_browser: false,
    toolbar: false,
    mobile_settings: false,
    draw: false,
    datasource_selector: true,
    layermanager: true,
    print: true,
    saveMap: false,
    language: true,
    permalink: true,
    feature_crossfilter: false,
    compositionLoadingProgress: false
  },
  proxyPrefix: '/proxy/',
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
    new VectorLayer({
      title: 'Street light',
      source: geodata
    })
  ],
  default_view: new View({
    center: transform([13.40, 49.74], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
    zoom: 15,
    units: 'm'
  })
}).controller('MainController', ['$scope', 'Core', 'hs.addLayersWms.addLayerService', 'hs.compositions.service_parser', 'config', 'hs.layout.service',
  function ($scope, Core, layerAdderService, composition_parser, config, layoutService) {
    $scope.Core = Core;
    Core.singleDatasources = true;
    layoutService.sidebarRight = true;
    //layerAdderService.addService('http://erra.ccss.cz/geoserver/ows', config.box_layers[1]);
  }
]);

