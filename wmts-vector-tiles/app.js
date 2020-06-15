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
import { Tile, Group, Image as ImageLayer } from 'ol/layer';
import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import View from 'ol/View';
import { get as getProjection } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import GeoJSON from 'ol/format/GeoJSON';
import MVT from 'ol/format/MVT';
import TileJSON from 'ol/source/TileJSON';
import UTFGrid from 'ol/source/UTFGrid';
import { Fill, Stroke, Style } from 'ol/style';

var module = angular.module('hs', [
    'hs.sidebar',
    'hs.toolbar',
    'hs.layermanager',
    'hs.map',
    'hs.query',
    'hs.draw',
    'hs.search', 'hs.print', 'hs.permalink', 'hs.measure',
    'hs.legend', 'hs.core',
    'hs.datasource_selector',
    'hs.save-map',
    'hs.addLayers',
    'gettext',
    'hs.info'
]);

/* Define Czech coordinate system S-JTSK which will be used for the map as the raster tiles are optimized for it */
proj4.defs('EPSG:5514', '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs');
register(proj4);
const sjtskProjection = getProjection('EPSG:5514');

var proxyPrefix = window.location.hostname.indexOf('ng.hslayers') == -1
    ? `${window.location.protocol}//${window.location.hostname}:8085/`
    : '/proxy/';

module.directive('hs', function (HsCore, HsLayoutService) {
    'ngInject';
    return {
      template: HsCore.hslayersNgTemplate,
      link: function (scope, element) {
        HsLayoutService.fullScreenMap(element, HsCore);
      }
    };
  });

// Define the tile layers so it can be added to the map, data source will be set after the request for GetCapabilities ends
let rasterTiles = new TileLayer({
    title: 'Raster Tiles'
});
let vectorTiles = new VectorTileLayer({
    title: 'Vector Tiles',
    renderMode: 'image',
    // set symbology for the vector data
    style: new Style({
        stroke: new Stroke({ color: 'blue', width: 1 }),
        fill: new Fill({ color: 'rgba(20,20,200,0.7)' })
    })
});

/**
 * Builds the URL to fetch single vector tile from the server based on the tile coordinates.
 * @param {any} tileCoord Vector tile coordinates
 */
function tileUrlFunction(tileCoord) {
    return (proxyPrefix + 'http://gis.lesprojekt.cz/geoserver/gwc/service/wmts/rest/{layer}/polygon/EPSG:5514_OGC/{z}/{x}/{y}?format={format}')
        .replace('{layer}', 'S-JTSK:Rostenice_2020')
        .replace('{format}', 'application/json;type=geojson')
        .replace('{z}', 'S-JTSK:' + String(tileCoord[0]))
        .replace('{y}', String(tileCoord[1]))
        .replace('{x}', String(tileCoord[2]));
}

// Get WMTS Capabilities and create WMTS source base on it
fetch(proxyPrefix + 'https://gis.lesprojekt.cz/geoserver/gwc/service/wmts?REQUEST=getcapabilities').then(function (response) {
    return response.text();
}).then(function (text) {
    //parse the XML response and create options object...
    var parser = new WMTSCapabilities();
    var result = parser.read(text);
    // ...create WMTS Capabilities based on the parsed options
    var options = optionsFromCapabilities(result, {
        layer: 'S-JTSK:Rostenice_2020',
        matrixSet: 'EPSG:5514_OGC',
        format: 'image/png'
    });

    // WMTS source for raster tiles layer
    let wmtsSource = new WMTS(options);

    // WMTS source for vector tiles layer
    let vtSource = new VectorTileSource({
        // use GeoJSON vector data format (TopoJSON, MVT or UTFGrid formats are also supported)
        format: new GeoJSON({ dataProjection: sjtskProjection, featureProjection: sjtskProjection }),
        layer: 'S-JTSK:Rostenice_2020',
        matrixSet: 'EPSG:5514_OGC',
        projection: sjtskProjection,
        tileGrid: wmtsSource.getTileGrid(),
        tileSize: 256,
        tileUrlFunction: tileUrlFunction, // overwrites the default url for featching single vector tile
        zDirection: 0,
        url: proxyPrefix + 'http://gis.lesprojekt.cz/geoserver/gwc/service/wmts/rest/S-JTSK:Rostenice_2020/polygon/EPSG:5514_OGC/S-JTSK:{z}/{x}/{y}?format=application/json;type=topojson'
    });

    // set the data source for raster and vector tile layers
    vectorTiles.setSource(vtSource);
    rasterTiles.setSource(wmtsSource);
});

// map content and layout definition
module.value('HsConfig', {
    proxyPrefix: proxyPrefix,
    box_layers: [
        new Group({
            title: 'Basemaps',
            layers: [
                new Tile({
                    source: new OSM({ projection: sjtskProjection }),
                    title: "OpenStreetMap",
                    base: true,
                    visible: true,
                    projection: sjtskProjection,
                    thumbnail: 'osm.png',

                }),

                // add WMTS tiles to the map
                rasterTiles,
                vectorTiles,
            ]
        }),
    ],
    panelsEnabled: {
        measure: true,
        saveMap: false,
        language: false
    },
    componentsEnabled: {
        sidebar: true,
        toolbar: true,
        guiOverlay: true,
        searchToolbar: true,
        measureToolbar: false,
        golocationButton: false,
        mapControls: true
    },
    mapInteractionsEnabled: true,

    default_view: new View({
        center: [-575426, -1166007],
        projection: sjtskProjection,
        zoom: 12,
        units: "m"
    }),
    theme: {
        sidebar: {
            background: 'rgb(40, 74, 109)',
            itemColor: 'white',
            activeItemColor: 'red'
        }
    }
});

module.controller('Main', 
    function (HsCore, HsLayoutService, HsSearchService, HsLanguageService, HsQueryWmsService) {
        'ngInject';
        HsCore.singleDatasources = true;
        HsLayoutService.panel_statuses['gallery'] = true;
        HsSearchService.geonamesUser = 'raitis';
        HsLanguageService.setLanguage('cs_CZ');
    }
);

