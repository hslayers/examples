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
import {fromLonLat} from 'ol/proj';

const geodata = new VectorSource({
  format: new GeoJSON(),
  url: require('./pasport.geojson'),
});

function styleFunction(feature, resolution) {
  if (
    feature &&
    feature.get('isFounder') &&
    feature.get('isFounder') === 'yes'
  ) {
    // Green circle for founding members
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
    // Orange circle for regular members
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
    useIsolatedBootstrap: true,
    useProxy: true,
    //proxyPrefix: "/proxy/",
    popUpDisplay: 'click', // Other options are 'hover' and 'none'
    componentsEnabled: {
      sidebar: false,
      toolbar: false,
      geolocationButton: false,
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
        // Layer with pop-ups
        title: 'Partners',
        style: styleFunction,
        popUp: {
          // Here you define the settings of pop-up windows
          attributes: [
            // Array of attributes to show in the pop-up
            'name', // Simplest option: only provide the name of the attribute
            {
              // Advanced option: provide attribute definition as an object
              attribute: 'logo', // Attribute name
              displayFunction: (x) => {
                // A function which modifies the appearance of this attribute in the pop-up
                return (
                  '<img src="https://www.plan4all.eu/wp-content/uploads/' +
                  x +
                  '" width="100rem" >'
                );
              },
            },
            {
              attribute: 'website', // Attribute name
              label: 'web', // Label which will be displayed in the pop-up instead of its name
              displayFunction: (x) => {
                // A function which modifies the appearance of this attribute in the pop-up
                return '<a href="' + x + '" target="_blank">' + x + '</a>';
              },
            },
          ],
        },
        source: new VectorSource({
          format: new GeoJSON(),
          url: require('./Plan4All_Members.geojson'),
        }),
        cluster: true,
      }),
      new VectorLayer({
        // Layer without pop-ups
        title: 'Street lights',
        source: geodata,
      }),
    ],
    default_view: new View({
      center: fromLonLat([17.474129, 52.574]),
      zoom: 4,
      units: 'm',
    }),
    queryPoint: 'hidden',
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
