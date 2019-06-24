'use strict';
import toolbar from 'toolbar';
import print from 'print';
import query from 'query';
import search from 'search';
import measure from 'measure';
import permalink from 'permalink';
import info from 'info';
import ds from 'datasource_selector';
import sidebar from 'sidebar';
import ows from 'ows';
import bootstrapBundle from 'bootstrap/dist/js/bootstrap.bundle';
import { ImageWMS, ImageArcGISRest } from 'ol/source';
import View from 'ol/View';
import { transform, transformExtent } from 'ol/proj';
import { Tile, Group, Image as ImageLayer } from 'ol/layer';
import { TileWMS, WMTS, OSM, XYZ } from 'ol/source';
import {Style, Icon, Stroke, Fill, Circle} from 'ol/style';

var module = angular.module('hs', [
    'hs.sidebar',
    'hs.toolbar',
    'hs.layermanager',
    'hs.query',
    'hs.search', 'hs.print', 'hs.permalink',
    'hs.geolocation',
    'hs.datasource_selector',
    'hs.status_creator',
    'hs.measure',
    'hs.api',
    'hs.ows'
]);

module.directive('hs', ['config', 'Core', function (config, Core) {
    return {
        template: Core.hslayersNgTemplate,
        link: function (scope, element) {
            Core.fullScreenMap(element);
        }
    };
}]);

var style = new Style({
    image: new Circle({
        fill: new Fill({
            color: [241, 121, 0, 0.7]
        }),
        stroke: new Stroke({
            color: [0xbb, 0x33, 0x33, 0.7]
        }),
        radius: 5
    }),
    fill: new Fill({
        color: "rgba(139, 189, 214, 0.3)",
    }),
    stroke: new Stroke({
        color: '#112211',
        width: 1
    })
})

function getHostname() {
    var url = window.location.href
    var urlArr = url.split("/");
    var domain = urlArr[2];
    return urlArr[0] + "//" + domain;
};

module.value('config', {
    default_layers: [
        new Tile({
            source: new OSM(),
            title: "Base layer",
            base: true,
            removable: false
        })
    ],
    project_name: 'erra/map',
    default_view: new View({
        center: transform([17.474129, 52.574000], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 4,
        units: "m"
    }),
    datasources: [
        /*{
            title: "Datatank",
            url: "http://ewi.mmlab.be/otn/api/info",
            type: "datatank"
        },*/
        {
            title: "Datasets",
            url: "http://otn-dev.intrasoft-intl.com/otnServices-1.0/platform/ckanservices/datasets",
            language: 'eng',
            type: "ckan",
            download: true
        }, {
            title: "Services",
            url: "http://cat.ccss.cz/csw/",
            language: 'eng',
            type: "micka",
            code_list_url: 'http://www.whatstheplan.eu/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D'
        }, {
            title: "Hub layers",
            url: "http://opentnet.eu/php/metadata/csw/",
            language: 'eng',
            type: "micka",
            code_list_url: 'http://opentnet.eu/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D'
        }
    ],
    hostname: {
        "default": {
            "title": "Default",
            "type": "default",
            "editable": false,
            "url": getHostname()
        }
    },
    'catalogue_url': "/php/metadata/csw",
    'compositions_catalogue_url': "/php/metadata/csw",
    status_manager_url: '/wwwlibs/statusmanager2/index.php'
    //,datasource_selector: {allow_add: false}
});

module.controller('Main', ['$scope', 'Core', 'hs.map.service',
    function ($scope, Core, OlMap) {
        $scope.hsl_path = hsl_path; //Get this from hslayers.js file
        $scope.Core = Core;
        $scope.Core.sidebarRight = false;
        //$scope.Core.sidebarToggleable = false;
        Core.singleDatasources = true;
        $scope.Core.sidebarButtons = true;
        $scope.Core.setDefaultPanel('layermanager');
    }
]);

