'use strict';
import 'hslayers-ng/components/add-layers/add-layers.module';
import 'hslayers-ng/components/datasource-selector/datasource-selector.module';
import 'hslayers-ng/components/draw/draw.module';
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
import {Circle, Fill, Stroke, Style} from 'ol/style';
import {OSM} from 'ol/source';
import {Tile} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {transform} from 'ol/proj';

const geodata = new VectorSource({
  format: new GeoJSON(),
  url: require('./pasport.geojson'),
});

window.getLRUser = function () {
  return (0);
};

function styleFunction(feature, resolution) {
  //console.log(feature);
  if (feature.get('isFounder') && feature.get('isFounder') === 'yes') {
    // je zakladajici clen
    return new Style({
      image: new Circle({
        fill: new Fill({
          color: 'rgba(128, 255, 128, 0.2)',
        }),
        stroke: new Stroke({
          color: '#77e405',
          width: 4,
        }),
        radius: 6,
      }),
    });
  } else {
    //neni zakladajici clen
    return new Style({
      image: new Circle({
        fill: new Fill({
          color: 'rgba(255, 128, 128, 0.2)',
        }),
        stroke: new Stroke({
          color: '#e49905',
          width: 4,
        }),
        radius: 6,
      }),
    });
  }
}

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
    sizeMode: 'container',
    sidebarClosed: true,
    //useIsolatedBootstrap: true,
    useProxy: true,
    //proxyPrefix: "/proxy/",
    //componentsEnabled: {},
    panelsEnabled: {
      composition_browser: false,
      toolbar: false,
      mobile_settings: true,
      draw: false,
      datasource_selector: false,
      layermanager: true,
      print: true,
      saveMap: false,
      language: false,
      permalink: false,
      feature_crossfilter: false,
      compositionLoadingProgress: false,
    },
    default_layers: [
      new Tile({
        source: new OSM({
          url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
        }),
        title: 'Wikimedia Map',
        base: true,
        visible: true,
        removable: false,
      }),
      new VectorLayer({
        title: 'Partners',
        style: styleFunction,
        hoveredKeys: ['Name', 'description'],
        hoveredKeysTranslations: {'description': 'popisek'},
        popUp: {
          display: 'hover',
          attributes: [
            {
              attribute: 'logo',
              displayFunction: (x) => {
                return (
                  '<img src="https://www.plan4all.eu/wp-content/uploads/' +
                  x +
                  '" width="100rem" >'
                );
              },
            },
            {
              attribute: 'website',
              label: 'web',
              displayFunction: (x) => {
                return '<a href="' + x + '" target="_blank">' + x + '</a>';
              },
            },
          ],
        },
        source: new VectorSource({
          format: new GeoJSON(),
          url: require('./Plan4All_Members.geojson'), //'https://raw.githubusercontent.com/jmacura/testing/master/Plan4All_Members.geojson'
        }),
        //cluster: true
      }),
      new VectorLayer({
        title: 'Street light',
        source: geodata,
      }),
    ],
    default_view: new View({
      center: transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4,
      units: 'm',
    }),
    locationButtonVisible: false,
  })
  .controller('MainController', [
    '$scope',
    'HsCore',
    'HsAddLayersWmsAddLayerService',
    'HsConfig',
    'HsLayoutService',
    function ($scope, Core, layerAdderService, config, layoutService) {
      $scope.Core = Core;
      Core.singleDatasources = true;
      layoutService.sidebarRight = true;
    },
  ]);
