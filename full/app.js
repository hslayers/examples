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
import { Tile, Group } from 'ol/layer';
import { TileWMS, WMTS, OSM, XYZ } from 'ol/source';
import {ImageWMS, ImageArcGISRest} from 'ol/source';
import View from 'ol/View';
import {transform, transformExtent} from 'ol/proj';

var module = angular.module('hs', [
    'hs.sidebar',
    'hs.toolbar',
    'hs.layermanager',
    'hs.map',
    'hs.query',
    'hs.search', 'hs.print', 'hs.permalink', 'hs.measure',
    'hs.legend', 'hs.geolocation', 'hs.core',
    'hs.datasource_selector',
    'hs.save-map',
    'hs.addLayers',
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

module.value('config', {
    importCss: true,
    open_lm_after_comp_loaded: true,
    layer_order: '-position',
    box_layers: [
        new Group({
            title: 'Base layer',
            layers: [
                new Tile({
                    source: new OSM(),
                    title: "OpenStreetMap",
                    base: true,
                    visible: true,
                    removable: false
                }),
                new Tile({
                    title: "OpenCycleMap",
                    visible: false,
                    base: true,
                    source: new OSM({
                        url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
                    })
                }),
                new Tile({
                    title: "Satellite",
                    visible: false,
                    base: true,
                    source: new XYZ({
                        url: 'http://api.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicmFpdGlzYmUiLCJhIjoiY2lrNzRtbGZnMDA2bXZya3Nsb2Z4ZGZ2MiJ9.g1T5zK-bukSbJsOypONL9g'
                    })
                })
            ],
        }), new Group({
            title: 'WMS layers',
            layers: [
                new Tile({
                    title: "Swiss",
                    source: new TileWMS({
                        url: 'http://wms.geo.admin.ch/',
                        params: {
                            LAYERS: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
                            INFO_FORMAT: undefined,
                            FORMAT: "image/png; mode=8bit"
                        },
                        crossOrigin: "anonymous"
                    }),
                }),
                new Tile({
                    title: "Ilida plastics kg/ha per year",
                    source: new TileWMS({
                        url: 'http://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/ilida/ilida.map',
                        params: {
                            LAYERS: 'ilida_cultivation_plastics',
                            INFO_FORMAT: undefined,
                            FORMAT: "image/png",
                            ABSTRACT: "Plastic waste in Ilida municipality"
                        },
                        crossOrigin: "anonymous"
                    }),
                    path: 'Ilida Thematic Data',
                    visible: true,
                    opacity: 0.8
                }),
                new Tile({
                    title: "Výnosový potenciál",
                    source: new TileWMS({
                        url: 'http://foodie-data.wirelessinfo.cz/geoserver-hsl/kojcice/wms?',
                        params: {
                            LAYERS: 'kojcice_vynospot_5m_poly',
                            //INFO_FORMAT: undefined,
                            INFO_FORMAT: 'text/html',
                            FORMAT: "image/png"
                        },
                        crossOrigin: "anonymous"
                    }),
                    path: 'Kojčice',
                    visible: true,
                    opacity: 0.5
                }),
                new Tile({
                    title: "Aplikační pásma dle výnosového potenciálu",
                    source: new TileWMS({
                        url: 'http://foodie-data.wirelessinfo.cz/geoserver-hsl/kojcice/wms?',
                        params: {
                            LAYERS: 'kojcice_vra_n1_pole_viper',
                            //INFO_FORMAT: undefined,
                            INFO_FORMAT: 'text/html',
                            FORMAT: "image/png"
                        },
                        crossOrigin: "anonymous"
                    }),
                    path: 'Kojčice',
                    visible: true,
                    opacity: 0.5
                }),
                new Tile({
                    title: "Půdní typ",
                    source: new TileWMS({
                        url: 'http://foodie-data.wirelessinfo.cz/geoserver-hsl/kojcice/wms?',
                        params: {
                            LAYERS: 'pudni_typy_verze3',
                            //INFO_FORMAT: undefined,
                            INFO_FORMAT: 'text/html',
                            FORMAT: "image/png"
                        },
                        crossOrigin: "anonymous"
                    }),
                    path: 'Kojčice',
                    visible: true,
                    opacity: 0.5
                }),
                new Tile({
                    title: "LPIS",
                    source: new TileWMS({
                        url: 'http://foodie-data.wirelessinfo.cz/geoserver-hsl/kojcice/wms?',
                        params: {
                            LAYERS: 'lpis_zdkojcice',
                            //INFO_FORMAT: undefined,
                            INFO_FORMAT: 'text/html',
                            FORMAT: "image/png"
                        },
                        crossOrigin: "anonymous"
                    }),
                    path: 'Kojčice',
                    visible: true,
                    opacity: 0.5
                })
            ]
        })
    ],
    default_view: new View({
        center: transform([17.474129, 52.574000], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 4,
        units: "m"
    }),
    compositions_catalogue_url: '/php/catalogue/libs/cswclient/cswClientRun.php',
    status_manager_url: '/wwwlibs/statusmanager2/index.php',
    datasources: [{
        title: "SuperCAT",
        url: "http://cat.ccss.cz/csw/",
        language: 'eng',
        type: "micka",
        code_list_url: '/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D'
    }]
});

module.controller('Main', ['$scope', 'Core', 'hs.addLayersWms.addLayerService', 'hs.compositions.service_parser', 'config',
    function ($scope, Core, layerAdderService, composition_parser, config) {
        $scope.Core = Core;
        Core.sidebarRight = false;
        Core.singleDatasources = true;
        layerAdderService.addService('http://erra.ccss.cz/geoserver/ows', config.box_layers[1]);
    }
]);

