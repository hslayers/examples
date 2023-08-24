/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {Component} from '@angular/core';

import proj4 from 'proj4';
import {Fill, Stroke, Style} from 'ol/style';
import {GeoJSON, MVT, WMTSCapabilities} from 'ol/format';
import {
  Group,
  Tile as TileLayer,
  VectorTile as VectorTileLayer,
} from 'ol/layer';
import {
  OSM,
  TileJSON,
  Tile as TileSource,
  UTFGrid,
  VectorTile as VectorTileSource,
  WMTS,
} from 'ol/source';
import {View} from 'ol';
import {get as getProjection, transform} from 'ol/proj';
import {optionsFromCapabilities} from 'ol/source/WMTS';
import {register} from 'ol/proj/proj4';

import {HsConfig, HsLanguageService} from 'hslayers-ng';

/* Define Czech coordinate system S-JTSK which will be used for the map as the raster tiles are optimized for it */
proj4.defs(
  'EPSG:5514',
  '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs'
);
register(proj4);
const sjtskProjection = getProjection('EPSG:5514');

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private hsConfig: HsConfig,
    private hsLanguageService: HsLanguageService
  ) {
    // Define the tile layers so it can be added to the map, data source will be set after the request for GetCapabilities ends
    const rasterTiles = new TileLayer({
      properties: {
        title: 'Raster Tiles',
      },
      source: new TileSource({}), // just a 'placeholder', will be set after loading WMTS capabilities
    });
    const vectorTiles = new VectorTileLayer({
      properties: {
        title: 'Vector Tiles',
      },
      source: new VectorTileSource({}), // just a 'placeholder', will be set after loading WMTS capabilities
      renderMode: 'hybrid',
      // set symbology for the vector data
      style: new Style({
        stroke: new Stroke({color: 'blue', width: 1}),
        fill: new Fill({color: 'rgba(20,20,200,0.7)'}),
      }),
    });

    // map content and layout definition
    this.hsConfig.update({
      assetsPath: 'assets/hslayers-ng',
      proxyPrefix: window.location.hostname.includes('localhost')
        ? `${window.location.protocol}//${window.location.hostname}:8085/`
        : '/proxy/',
      reverseLayerList: false,
      box_layers: [
        new Group({
          properties: {
            title: 'Basemaps',
          },
          layers: [
            new TileLayer({
              properties: {
                title: 'OpenStreetMap',
                base: true,
                visible: true,
                projection: sjtskProjection,
                thumbnail: 'osm.png',
              },
              source: new OSM(),
            }),
            // add WMTS tiles to the map
            rasterTiles,
            vectorTiles,
          ],
        }),
      ],
      default_view: new View({
        center: [-575426, -1166007], //Coordinates in S-JTSK Krovak EastNorth projection
        zoom: 12,
        projection: sjtskProjection,
      }),
      panelsEnabled: {
        tripPlanner: false,
        info: false,
        draw: false,
        print: false,
        permalink: false,
        saveMap: false,
        legend: false,
        language: true,
        composition_browser: false,
        compositionLoadingProgress: false,
        datasource_selector: false,
        measure: false,
      },
    });
    this.hsLanguageService.setLanguage('cs');
    // Get WMTS Capabilities and create WMTS source base on it
    fetch(
      this.hsConfig.proxyPrefix +
        'https://gis.lesprojekt.cz/geoserver/gwc/service/wmts?REQUEST=getcapabilities'
    )
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        //parse the XML response and create options object...
        const parser = new WMTSCapabilities();
        const result = parser.read(text);
        // ...create WMTS Capabilities based on the parsed options
        const options = optionsFromCapabilities(result, {
          layer: 'S-JTSK:Rostenice_2020',
          matrixSet: 'EPSG:5514_OGC',
          format: 'image/png',
        });

        // WMTS source for raster tiles layer
        const wmtsSource = new WMTS(options);

        // WMTS source for vector tiles layer
        const vtSource = new VectorTileSource({
          // use GeoJSON vector data format (TopoJSON, MVT or UTFGrid formats are also supported)
          format: new GeoJSON({
            dataProjection: sjtskProjection,
            featureProjection: sjtskProjection,
          }),
          //layer: 'S-JTSK:Rostenice_2020',
          //matrixSet: 'EPSG:5514_OGC',
          projection: sjtskProjection,
          tileGrid: wmtsSource.getTileGrid(),
          tileSize: 256,
          tileUrlFunction: this.tileUrlFunction, // overwrites the default url for fetching single vector tile
          zDirection: 0,
          url:
            this.hsConfig.proxyPrefix +
            'http://gis.lesprojekt.cz/geoserver/gwc/service/wmts/rest/S-JTSK:Rostenice_2020/polygon/EPSG:5514_OGC/S-JTSK:{z}/{x}/{y}?format=application/json;type=topojson',
        });

        // set the data source for raster and vector tile layers
        vectorTiles.setSource(vtSource);
        rasterTiles.setSource(wmtsSource);
      });
  }

  /**
   * Builds the URL to fetch single vector tile from the server based on the tile coordinates.
   * @param {any} tileCoord Vector tile coordinates
   * @returns {string} URL
   */
  tileUrlFunction(tileCoord) {
    return (
      this.hsConfig.proxyPrefix +
      'http://gis.lesprojekt.cz/geoserver/gwc/service/wmts/rest/{layer}/polygon/EPSG:5514_OGC/{z}/{x}/{y}?format={format}'
    )
      .replace('{layer}', 'S-JTSK:Rostenice_2020')
      .replace('{format}', 'application/json;type=geojson')
      .replace('{z}', 'S-JTSK:' + String(tileCoord[0]))
      .replace('{y}', String(tileCoord[1]))
      .replace('{x}', String(tileCoord[2]));
  }
}
