'use strict';
import $ from 'jquery';
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
import {Tile} from 'ol/layer';
import {OSM} from 'ol/source';
import View from 'ol/View';
import {transform, transformExtent, get as getProj} from 'ol/proj';
import {WKT} from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import {Vector} from 'ol/source';
import Feature from 'ol/Feature';
import Popup from 'ol-popup';
import 'ol-popup/src/ol-popup.css';
import {Style, Icon, Stroke, Fill, Circle} from 'ol/style';

var module = angular.module('hs', [
  'hs.toolbar',
  'hs.layermanager',
  'hs.map',
  'hs.query',
  'hs.search',
  'hs.permalink',
  'hs.measure',
  'hs.geolocation',
  'hs.core',
  'gettext',
  'hs.sidebar',
]);

module
  /*.directive('hs', [
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
  ])*/

  /*.directive('infoDirective', function () {
    return {
      template: require('./info.html'),
      link: function (scope, element, attrs) {},
    };
  })*/

  .directive('description', [
    '$compile',
    'hs.utils.service',
    function ($compile, utils) {
      return {
        templateUrl: './description.html',
        scope: {
          object: '=',
          url: '@',
        },
        link: function (scope, element, attrs) {
          /*scope.describe = function (e, attribute) {
            if (angular.element(e.target).parent().find('table').length > 0) {
              angular.element(e.target).parent().find('table').remove();
            } else {
              var table = angular.element(
                '<table class="table table-striped" description object="attribute' +
                  Math.abs(attribute.value.hashCode()) +
                  '" url="' +
                  attribute.value +
                  '"></table>'
              );
              angular.element(e.target).parent().append(table);
              $compile(table)(scope.$parent);
            }
          };*/
          /*if (
            angular.isUndefined(scope.object) &&
            angular.isDefined(attrs.url) &&
            typeof attrs.url == 'string'
          ) {
            scope.object = {attributes: []};
            var q =
              'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
              encodeURIComponent('describe <' + attrs.url + '>') +
              '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
            $.ajax({
              url: q,
            }).done(function (response) {
              if (angular.isUndefined(response.results)) return;
              for (var i = 0; i < response.results.bindings.length; i++) {
                var b = response.results.bindings[i];
                var short_name = b.p.value;
                if (short_name.indexOf('#') > -1)
                  short_name = short_name.split('#')[1];
                scope.object.attributes.push({
                  short_name: short_name,
                  value: b.o.value,
                });
                if (!scope.$$phase) scope.$apply();
              }
            });
          }*/
        },
      };
    },
  ]);

var style = function (feature, resolution) {
  if (
    typeof feature.get('visible') === 'undefined' ||
    feature.get('visible') == true
  ) {
    var s = feature.get('http://www.sdi4apps.eu/poi/#mainCategory');

    if (typeof s === 'undefined') return;
    s = s.split('#')[1];
    return [
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'hslayers-ng/examples/geosparql/symbolsWaze/' + s + '.png',
          crossOrigin: 'anonymous',
          scale: 0.6,
        }),
      }),
    ];
  } else {
    return [];
  }
};

var styleOSM = function (feature, resolution) {
  if (
    typeof feature.get('visible') === 'undefined' ||
    feature.get('visible') == true
  ) {
    var s = feature.get('http://www.sdi4apps.eu/poi/#mainCategory');
    if (typeof s === 'undefined') return;
    s = s.split('#')[1];
    return [
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'hslayers-ng/examples/geosparql/symbols/' + s + '.png',
          crossOrigin: 'anonymous',
          scale: 0.6,
        }),
      }),
    ];
  } else {
    return [];
  }
};

/*function rainbow(numOfSteps, step, opacity) {
  // based on http://stackoverflow.com/a/7419630
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distiguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  var r, g, b;
  var h = step / (numOfSteps * 1.00000001);
  var i = ~~(h * 4);
  var f = h * 4 - i;
  var q = 1 - f;
  switch (i % 4) {
    case 2:
      (r = f), (g = 1), (b = 0);
      break;
    case 0:
      (r = 0), (g = f), (b = 1);
      break;
    case 3:
      (r = 1), (g = q), (b = 0);
      break;
    case 1:
      (r = 0), (g = 1), (b = q);
      break;
  }
  var c =
    'rgba(' +
    ~~(r * 235) +
    ',' +
    ~~(g * 235) +
    ',' +
    ~~(b * 235) +
    ', ' +
    opacity +
    ')';
  return c;
}*/

/*var stroke = new Stroke({
  color: '#3399CC',
  width: 1.25,
});*/
/*var olu_style = function (feature, resolution) {
  var poi_count = feature.get('poi_count');
  if (poi_count > 30) poi_count = 30;
  var fill = new Fill({
    color: rainbow(30, poi_count, 0.7),
  });
  return [
    new Style({
      image: new Circle({
        fill: fill,
        stroke: stroke,
        radius: 5,
      }),
      fill: fill,
      stroke: stroke,
    }),
  ];
};*/

/*var main_road_olu_style = function (feature, resolution) {
  var use = feature.get('use');
  if (use > 30) use = 30;
  var fill = new Fill({
    color: rainbow(30, use, 0.7),
  });
  return [
    new Style({
      image: new Circle({
        fill: fill,
        stroke: stroke,
        radius: 5,
      }),
      fill: fill,
      stroke: stroke,
    }),
  ];
};*/

var mercatorProjection = getProj('EPSG:900913');

/*module.value('config', {
  default_layers: [
    new Tile({
      source: new OSM({
        wrapX: false,
      }),
      title: 'Base layer',
      base: true,
    }),
  ],
  //project_name: 'hslayers',
  default_view: new View({
    center: transform([14.42191188, 50.07347216], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
    zoom: 16,
    units: 'm',
  }),
});*/

module.controller('Main', [
  '$scope',
  'Core',
  'hs.query.baseService',
  'hs.compositions.service_parser',
  '$timeout',
  'hs.map.service',
  '$http',
  'config',
  '$rootScope',
  'hs.utils.service',
  '$compile',
  'hs.query.baseService',
  '$sce',
  function (
    $scope,
    Core,
    QueryService,
    composition_parser,
    $timeout,
    hsMap,
    $http,
    config,
    $rootScope,
    utils,
    $compile,
    query_service,
    $sce
  ) {
    /*$scope.Core = Core;
    Core.sidebarExpanded = false;
    var map;*/

    /*$rootScope.$on('map.loaded', function () {
      map = hsMap.map;
      map.on('moveend', extentChanged);
      initInfoDirective();
    });*/

    //var spoi_source = new Vector();
    //var highway_spois_source = new Vector();

    /*function createPoiLayers() {
      var new_lyr = new VectorLayer({
        title: 'Land use parcels (color by poi count)',
        source: spoi_source,
        style: olu_style,
        visible: true,
        maxResolution: 2.48657133911758,
      });

      config.default_layers.push(new_lyr);

      var new_lyr2 = new VectorLayer({
        title: 'Parcels with Pois near main roads (color by land use class)',
        source: highway_spois_source,
        style: main_road_olu_style,
        visible: true,
        //maxResolution: 4.48657133911758
      });

      config.default_layers.push(new_lyr2);
    }*/

    //createPoiLayers();

    /*function extentChanged() {
      getOlus();
      getMainRoadPois();
    }*/

    /*function getOlus() {
      if (map.getView().getResolution() > 2.48657133911758) return;
      var format = new WKT();
      var bbox = map.getView().calculateExtent(map.getSize());
      var ext = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
      var extents = ext[0] + ' ' + ext[1] + ', ' + ext[2] + ' ' + ext[3];
      var q =
        'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
        encodeURIComponent(
          'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX virtrdf: <http://www.openlinksw.com/schemas/virtrdf#> PREFIX poi: <http://www.openvoc.eu/poi#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?o ?use ?wkt (COUNT(*) as ?poi_count) FROM <http://www.sdi4apps.eu/poi.rdf> WHERE {?Resource geo:asWKT ?Coordinates . FILTER(bif:st_may_intersect (?Coordinates, ?wkt)). { SELECT ?o ?wkt ?use FROM <http://w3id.org/foodie/olu#> WHERE { ?o geo:hasGeometry ?geometry. ?geometry geo:asWKT ?wkt. FILTER(bif:st_may_intersect(bif:st_geomfromtext("BOX(' +
            extents +
            ')"), ?wkt)). ?o <http://w3id.org/foodie/olu#specificLandUse> ?use. } } }'
        ) +
        '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

      spoi_source.set('loaded', false);
      $.ajax({
        url: q,
      }).done(function (response) {
        if (angular.isUndefined(response.results)) return;
        var features = [];
        for (var i = 0; i < response.results.bindings.length; i++) {
          try {
            var b = response.results.bindings[i];
            if (
              b.wkt.datatype ==
                'http://www.openlinksw.com/schemas/virtrdf#Geometry' &&
              b.wkt.value.indexOf('e+') == -1 &&
              b.wkt.value.indexOf('e-') == -1
            ) {
              var g_feature = format.readFeature(b.wkt.value.toUpperCase());
              var ext = g_feature.getGeometry().getExtent();
              var geom_transformed = g_feature
                .getGeometry()
                .transform('EPSG:4326', hsMap.map.getView().getProjection());
              var feature = new Feature({
                geometry: geom_transformed,
                parcel: b.o.value,
                use: b.use.value,
                poi_count: b.poi_count.value,
              });
              features.push(feature);
            }
          } catch (ex) {
            console.log(ex);
          }
        }
        spoi_source.clear();
        spoi_source.addFeatures(features);
        spoi_source.set('loaded', true);
      });
    }*/

    /*function getMainRoadPois() {
      //if(map.getView().getResolution() > 4.48657133911758) return;
      var format = new WKT();
      var bbox = map.getView().calculateExtent(map.getSize());
      var ext = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
      var extents = ext[0] + ' ' + ext[1] + ', ' + ext[2] + ' ' + ext[3];
      var q =
        'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
        encodeURIComponent(
          'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX virtrdf: <http://www.openlinksw.com/schemas/virtrdf#> PREFIX poi: <http://www.openvoc.eu/poi#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX otm: <http://w3id.org/foodie/otm#> PREFIX olu: <http://w3id.org/foodie/olu#> SELECT DISTINCT ?olu ?hilucs ?source ?municode ?specificLandUse ?coordinatesOLU FROM <http://w3id.org/foodie/olu#> WHERE { ?olu a olu:LandUse . ?olu geo:hasGeometry ?geometry . ?olu olu:hilucsLandUse ?hilucs . ?olu olu:geometrySource ?source . OPTIONAL {?olu olu:municipalCode ?municode} . OPTIONAL {?olu olu:specificLandUse ?specificLandUse} . ?geometry geo:asWKT ?coordinatesOLU . FILTER(bif:st_within(?coordinatesPOIa,?coordinatesOLU)). { SELECT DISTINCT ?Resource, ?Label, ?coordinatesPOIa FROM <http://www.sdi4apps.eu/poi.rdf> WHERE { ?Resource rdfs:label ?Label . ?Resource a <http://gis.zcu.cz/SPOI/Ontology#lodging> . ?Resource geo:asWKT ?coordinatesPOIa . FILTER(bif:st_within(?coordinatesPOIa,?coordinatesOTM,0.00045)) . { SELECT ?coordinatesOTM FROM <http://w3id.org/foodie/otm#> WHERE { ?roadlink a otm:RoadLink . ?roadlink otm:roadName ?name. ?roadlink otm:functionalRoadClass ?class. ?roadlink otm:centerLineGeometry ?geometry . ?geometry geo:asWKT ?coordinatesOTM . FILTER(bif:st_may_intersect (?coordinatesOTM, bif:st_geomFromText("BOX(' +
            extents +
            ')"))) . FILTER(STRSTARTS(STR(?class),"firstClass") ) . } } } } }'
        ) +
        '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

      highway_spois_source.set('loaded', false);
      $.ajax({
        url: q,
      }).done(function (response) {
        if (angular.isUndefined(response.results)) return;
        var features = [];
        for (var i = 0; i < response.results.bindings.length; i++) {
          try {
            var b = response.results.bindings[i];
            if (
              b.coordinatesOLU.datatype ==
                'http://www.openlinksw.com/schemas/virtrdf#Geometry' &&
              b.coordinatesOLU.value.indexOf('e+') == -1 &&
              b.coordinatesOLU.value.indexOf('e-') == -1
            ) {
              var g_feature = format.readFeature(
                b.coordinatesOLU.value.toUpperCase()
              );
              var ext = g_feature.getGeometry().getExtent();
              var geom_transformed = g_feature
                .getGeometry()
                .transform('EPSG:4326', hsMap.map.getView().getProjection());
              var feature = new Feature({
                geometry: geom_transformed,
                parcel: b.olu.value,
                use: b.specificLandUse.value,
                poi_count: 30,
              });
              features.push(feature);
            }
          } catch (ex) {
            console.log(ex);
          }
        }
        highway_spois_source.clear();
        highway_spois_source.addFeatures(features);
        highway_spois_source.set('loaded', true);
      });
    }*/

    /*Popups*/
    /*function initInfoDirective() {
      var el = angular.element('<div info-directive></div>');
      document.getElementById('hs-dialog-area').appendChild(el[0]);
      $compile(el)($scope);
    }*/

    var popup;

    /*function showPopup() {
      if (angular.isUndefined(popup)) createPopup();
      if (!$scope.$$phase) $scope.$apply();
      var html = document.querySelector('#info-offline');
      popup.show(query_service.last_coordinate_clicked, html);
      $rootScope.$broadcast('popupOpened', 'inside');
    }*/

    /*$scope.showParcelInfo = function (parcel) {
      $scope.parcel = {
        id: $sce.trustAsHtml(parcel.get('parcel')),
        attributes: [],
        pois: [],
      };
      describeOlu(parcel.get('parcel'), function () {
        showPopup(parcel);
      });
    };*/

    /*function describeOlu(id, callback) {
      var q =
        'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
        encodeURIComponent('describe <' + id + '>') +
        '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
      $.ajax({
        url: q,
      }).done(function (response) {
        if (angular.isUndefined(response.results)) return;
        for (var i = 0; i < response.results.bindings.length; i++) {
          var b = response.results.bindings[i];
          var short_name = b.p.value;
          if (short_name.indexOf('#') > -1)
            short_name = short_name.split('#')[1];
          $scope.parcel.attributes.push({
            short_name: short_name,
            value: b.o.value,
          });
        }
        getLinksTo(id, callback);
      });
    }*/

    /*function getLinksTo(id, callback) {
      var q =
        'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
        encodeURIComponent(
          'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX virtrdf: <http://www.openlinksw.com/schemas/virtrdf#> PREFIX poi: <http://www.openvoc.eu/poi#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT * FROM <http://www.sdi4apps.eu/poi.rdf> WHERE {?poi geo:asWKT ?Coordinates . FILTER(bif:st_may_intersect (?Coordinates, ?wkt)). { SELECT ?wkt FROM <http://w3id.org/foodie/olu#> WHERE { <' +
            id +
            '> geo:hasGeometry ?geometry. ?geometry geo:asWKT ?wkt.} } }'
        ) +
        '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
      $.ajax({
        url: q,
      }).done(function (response) {
        for (var i = 0; i < response.results.bindings.length; i++) {
          var b = response.results.bindings[i];
          $scope.parcel.pois.push({url: b.poi.value});
        }
        callback();
      });
    }*/

    /*$scope.describePoi = function (poi) {
      if (angular.isUndefined(poi.expanded)) poi.expanded = false;
      poi.expanded = !poi.expanded;
      if (poi.expanded) {
        var q =
          'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
          encodeURIComponent('describe <' + poi.url + '>') +
          '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
        $.ajax({
          url: q,
        }).done(function (response) {
          if (angular.isUndefined(response.results)) return;
          poi.attributes = [];
          for (var i = 0; i < response.results.bindings.length; i++) {
            var b = response.results.bindings[i];
            var short_name = b.p.value;
            if (short_name.indexOf('#') > -1)
              short_name = short_name.split('#')[1];
            poi.attributes.push({short_name: short_name, value: b.o.value});
          }
          if (!$scope.$$phase) $scope.$apply();
        });
      } else {
        if (!$scope.$$phase) $scope.$apply();
      }
      return false;
    };*/

    /*function createPopup() {
      popup = new Popup();
      hsMap.map.addOverlay(popup);
      popup.getElement().className += ' popup-headline';
      popup.getElement().style.width = '600px';
      popup.getElement().style.height = 'auto';
    }*/

    /*$scope.$on('vectorQuery.featureSelected', function (event, feature) {
      $scope.showParcelInfo(feature);
    });*/

    /*$scope.$on('popupOpened', function (e, source) {
      if (
        angular.isDefined(source) &&
        source != 'inside' &&
        angular.isDefined(popup)
      )
        popup.hide();
    });*/

    /*$scope.$on('query.dataUpdated', function (event) {
      if (console)
        console.log(
          'Attributes',
          QueryService.data.attributes,
          'Groups',
          QueryService.data.groups
        );
    });*/

    //Core.setMainPanel('info');
    //Core.panelEnabled('compositions', false);
    Core.panelEnabled('status_creator', false);
  },
]);
