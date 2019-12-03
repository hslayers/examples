'use strict';
import 'toolbar.module';
import 'print.module';
import 'query.module';
import 'search.module';
import 'permalink.module';
import 'info.module';
import 'datasource-selector.module';
import 'sidebar.module';
import { Tile } from 'ol/layer';
import View from 'ol/View';
import { transform } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import { Style, Stroke, Fill, Circle } from 'ol/style';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { OSM } from 'ol/source';
var module = angular.module('hs', [
    'hs.sidebar',
    'hs.toolbar',
    'hs.layermanager',
    'hs.map',
    'hs.query',
    'hs.search','hs.permalink',
    'hs.legend', 'hs.core',
    'hs.datasource_selector',
    'hs.save-map',
    'gettext',
    'hs.compositions',
    'hs.info'
]);

module.directive('hs', ['config', 'Core', function (config, Core) {
    return {
        template: Core.hslayersNgTemplate,
        link: function (scope, element) {
            Core.fullScreenMap(element);
        }
    };
}]);

var count = 200;
var features = new Array(count);
var e = 4500000;
for (var i = 0; i < count; ++i) {
    var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
    features[i] = new Feature(new Point(coordinates));
}
module.value('config', {
    proxyPrefix: "/proxy/",
    default_layers: [
        new Tile({
            source: new OSM(),
            title: "Base layer",
            base: true,
            removable: false
        }),
        new VectorLayer({
            title: 'Test',
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 128, 123, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#e49905',
                    width: 2
                }),
                image: new Circle({
                    radius: 5,
                    fill: new Fill({
                        color: 'orange'
                    }),
                    stroke: new Stroke({
                        color: 'green'
                    })
                })
            }),
            source: new VectorSource({
                features: features
            }),
            cluster: true,
            declutter: true
        })
    ],
    project_name: 'erra/map',
    default_view: new View({
        center: transform([23.3885193, 56.4769034], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 13,
        units: "m"
    }),
    advanced_form: true,
    panelWidths: {
        sensors: 600
    },
    panelsEnabled: {
        language: false
    },
    'catalogue_url': "/php/metadata/csw",
    status_manager_url: '/wwwlibs/statusmanager2/index.php',

});
module.controller('Main', ['$scope', 'Core',
    function ($scope, Core) {
        $scope.Core = Core;
        Core.sidebarRight = false;
        Core.singleDatasources = true;
    }
]);

