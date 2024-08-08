/* eslint-disable @angular-eslint/component-selector */
import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

import {Circle, Fill, Stroke, Style} from 'ol/style';
import {Feature, Map, View} from 'ol';
import {OSM, Vector} from 'ol/source';
import {Tile, Vector as VectorLayer} from 'ol/layer';
import {WKT} from 'ol/format';
import {transform, transformExtent} from 'ol/proj';

import {
  HsConfig,
  HsEventBusService,
  HsLayoutService,
  HsMapService,
} from 'hslayers-ng';

import {InfoService, ParcelData} from './info.service';
import {InfoWidgetComponent} from './info.component';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
})
export class AppComponent {
  spoi_source = new Vector();
  highway_spois_source = new Vector();
  stroke = new Stroke({
    color: '#3399CC',
    width: 1.25,
  });
  parcel: ParcelData;
  //popup;
  //popupOpen$: Subject<string> = new Subject();

  constructor(
    private hsConfig: HsConfig,
    private hsEventBusService: HsEventBusService,
    private hsLayoutService: HsLayoutService,
    private hsMapService: HsMapService,
    private httpClient: HttpClient,
    private infoService: InfoService
  ) {
    const new_lyr = new VectorLayer({
      properties: {
        title: 'Land use parcels (color by POI count)',
        editable: false,
        editor: {editable: false},
        popUp: true /*{
          attributes: [],
          widgets: ['olu+spoi-info-widget'],
        },*/,
      },
      source: this.spoi_source,
      style: (feature, resolution) => this.oluStyle(feature, resolution),
      visible: true,
      maxResolution: 2.48657133911758,
    });
    const new_lyr2 = new VectorLayer({
      properties: {
        title: 'Parcels with POIs near main roads (color by land use class)',
        editable: false,
        editor: {editable: false},
      },
      source: this.highway_spois_source,
      style: (feature, resolution) =>
        this.mainRoadOluStyle(feature, resolution),
      visible: true,
      //maxResolution: 4.48657133911758
    });
    this.hsConfig.update({
      assetsPath: 'assets/hslayers-ng',
      proxyPrefix: window.location.hostname.includes('localhost')
        ? `${window.location.protocol}//${window.location.hostname}:8085/`
        : '/proxy/',
      popUpDisplay: 'click',
      queryPopupWidgets: [
        'olu+spoi-info-widget',
        //'layer-name',
        //'feature-info',
        //'clear-layer',
      ],
      customQueryPopupWidgets: [
        {name: 'olu+spoi-info-widget', component: InfoWidgetComponent},
      ],
      default_layers: [
        new Tile({
          source: new OSM({wrapX: false}),
          properties: {
            title: 'Base layer (OpenStreetMap)',
            base: true,
            removable: false,
          },
          visible: true,
        }),
        new_lyr,
        new_lyr2,
      ],
      default_view: new View({
        center: transform([14.42191188, 50.07347216], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
        zoom: 16,
      }),
      panelsEnabled: {
        tripPlanner: true,
        info: false,
        draw: false,
        print: false,
        permalink: false,
        saveMap: false,
        legend: false,
        language: false,
        composition_browser: false,
        compositionLoadingProgress: false,
        addData: false,
        measure: false,
      },
      sidebarClosed: true,
    });
    this.hsLayoutService.setMainPanel('info');
    // ** EVENTS **
    this.hsEventBusService.mapExtentChanges.subscribe(({map}) => {
      this.getOlus(map);
      this.getMainRoadPois(map);
    });
    this.hsEventBusService.olMapLoads.subscribe(() => {
      //FIXME: likely not necessary anymore?
    });
    this.hsEventBusService.vectorQueryFeatureSelection.subscribe(
      ({feature}) => {
        this.showParcelInfo(feature);
      }
    );
    /*this.popupOpen$.subscribe((source) => {
      if (source != 'inside' && this.popup) {
        this.popup.hide();
      }
    });*/
  }

  async getOlus(map: Map) {
    if (map.getView().getResolution() > 2.48657133911758) {
      return;
    }
    const format = new WKT();
    const bbox = map.getView().calculateExtent(map.getSize());
    const ext = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
    const extents = ext[0] + ' ' + ext[1] + ', ' + ext[2] + ' ' + ext[3];
    const q =
      'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
      encodeURIComponent(
        'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX virtrdf: <http://www.openlinksw.com/schemas/virtrdf#> PREFIX poi: <http://www.openvoc.eu/poi#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?o ?use ?wkt (COUNT(*) as ?poi_count) FROM <http://www.sdi4apps.eu/poi.rdf> WHERE {?Resource geo:asWKT ?Coordinates . FILTER(bif:st_may_intersect (?Coordinates, ?wkt)). { SELECT ?o ?wkt ?use FROM <http://w3id.org/foodie/olu#> WHERE { ?o geo:hasGeometry ?geometry. ?geometry geo:asWKT ?wkt. FILTER(bif:st_may_intersect(bif:st_geomfromtext("BOX(' +
          extents +
          ')"), ?wkt)). ?o <http://w3id.org/foodie/olu#specificLandUse> ?use. } } }'
      ) +
      '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

    this.spoi_source.set('loaded', false);
    let response;
    try {
      response = await lastValueFrom<any>(this.httpClient.get(q));
    } catch (ex) {
      console.log(ex);
    }
    if (!response.results) {
      return;
    }
    const features = [];
    for (const b of response.results.bindings) {
      try {
        if (
          b.wkt.datatype ==
            'http://www.openlinksw.com/schemas/virtrdf#Geometry' &&
          b.wkt.value.indexOf('e+') == -1 &&
          b.wkt.value.indexOf('e-') == -1
        ) {
          const g_feature = format.readFeature(b.wkt.value.toUpperCase());
          //const ext = g_feature.getGeometry().getExtent();
          const geom_transformed = g_feature
            .getGeometry()
            .transform(
              'EPSG:4326',
              this.hsMapService.map.getView().getProjection()
            );
          const feature = new Feature({
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
    this.spoi_source.clear();
    this.spoi_source.addFeatures(features);
    this.spoi_source.set('loaded', true);
  }

  async getMainRoadPois(map) {
    //if(map.getView().getResolution() > 4.48657133911758) return;
    const format = new WKT();
    const bbox = map.getView().calculateExtent(map.getSize());
    const ext = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
    const extents = ext[0] + ' ' + ext[1] + ', ' + ext[2] + ' ' + ext[3];
    const q =
      'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
      encodeURIComponent(
        'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX virtrdf: <http://www.openlinksw.com/schemas/virtrdf#> PREFIX poi: <http://www.openvoc.eu/poi#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX otm: <http://w3id.org/foodie/otm#> PREFIX olu: <http://w3id.org/foodie/olu#> SELECT DISTINCT ?olu ?hilucs ?source ?municode ?specificLandUse ?coordinatesOLU FROM <http://w3id.org/foodie/olu#> WHERE { ?olu a olu:LandUse . ?olu geo:hasGeometry ?geometry . ?olu olu:hilucsLandUse ?hilucs . ?olu olu:geometrySource ?source . OPTIONAL {?olu olu:municipalCode ?municode} . OPTIONAL {?olu olu:specificLandUse ?specificLandUse} . ?geometry geo:asWKT ?coordinatesOLU . FILTER(bif:st_within(?coordinatesPOIa,?coordinatesOLU)). { SELECT DISTINCT ?Resource, ?Label, ?coordinatesPOIa FROM <http://www.sdi4apps.eu/poi.rdf> WHERE { ?Resource rdfs:label ?Label . ?Resource a <http://gis.zcu.cz/SPOI/Ontology#lodging> . ?Resource geo:asWKT ?coordinatesPOIa . FILTER(bif:st_within(?coordinatesPOIa,?coordinatesOTM,0.00045)) . { SELECT ?coordinatesOTM FROM <http://w3id.org/foodie/otm#> WHERE { ?roadlink a otm:RoadLink . ?roadlink otm:roadName ?name. ?roadlink otm:functionalRoadClass ?class. ?roadlink otm:centerLineGeometry ?geometry . ?geometry geo:asWKT ?coordinatesOTM . FILTER(bif:st_may_intersect (?coordinatesOTM, bif:st_geomFromText("BOX(' +
          extents +
          ')"))) . FILTER(STRSTARTS(STR(?class),"firstClass") ) . } } } } }'
      ) +
      '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

    this.highway_spois_source.set('loaded', false);
    let response;
    try {
      response = await lastValueFrom(this.httpClient.get(q));
    } catch (ex) {
      console.log(ex);
    }
    if (!response.results) {
      return;
    }
    const features = [];
    for (let i = 0; i < response.results.bindings.length; i++) {
      try {
        const b = response.results.bindings[i];
        if (
          b.coordinatesOLU.datatype ==
            'http://www.openlinksw.com/schemas/virtrdf#Geometry' &&
          b.coordinatesOLU.value.indexOf('e+') == -1 &&
          b.coordinatesOLU.value.indexOf('e-') == -1
        ) {
          const g_feature = format.readFeature(
            b.coordinatesOLU.value.toUpperCase()
          );
          //const ext = g_feature.getGeometry().getExtent();
          const geom_transformed = g_feature
            .getGeometry()
            .transform(
              'EPSG:4326',
              this.hsMapService.map.getView().getProjection()
            );
          const feature = new Feature({
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
    this.highway_spois_source.clear();
    this.highway_spois_source.addFeatures(features);
    this.highway_spois_source.set('loaded', true);
  }

  async showParcelInfo(parcel) {
    this.parcel = {
      parcel: {
        id: parcel.get('parcel'), //$sce.trustAsHtml(parcel.get('parcel')),
        attributes: [],
        pois: [],
      },
    };
    await this.describeOlu(parcel.get('parcel'));
    this.infoService.parcelDataUpdate$.next(this.parcel);
    //this.showPopup();
  }

  async describeOlu(id) {
    const q =
      'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
      encodeURIComponent('describe <' + id + '>') +
      '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
    let response;
    try {
      response = await lastValueFrom(this.httpClient.get(q));
    } catch (ex) {
      console.log(ex);
    }
    if (response.results === undefined) {
      return;
    }
    for (const b of response.results.bindings) {
      let short_name = b.p.value;
      if (short_name.indexOf('#') > -1) {
        short_name = short_name.split('#')[1];
      }
      this.parcel.parcel.attributes.push({
        short_name: short_name,
        value: b.o.value,
      });
    }
    await this.getLinksTo(id);
  }

  async getLinksTo(id) {
    const q =
      'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' +
      encodeURIComponent(
        'PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX virtrdf: <http://www.openlinksw.com/schemas/virtrdf#> PREFIX poi: <http://www.openvoc.eu/poi#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT * FROM <http://www.sdi4apps.eu/poi.rdf> WHERE {?poi geo:asWKT ?Coordinates . FILTER(bif:st_may_intersect (?Coordinates, ?wkt)). { SELECT ?wkt FROM <http://w3id.org/foodie/olu#> WHERE { <' +
          id +
          '> geo:hasGeometry ?geometry. ?geometry geo:asWKT ?wkt.} } }'
      ) +
      '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
    let response;
    try {
      response = await lastValueFrom(this.httpClient.get(q));
    } catch (ex) {
      console.log(ex);
    }
    for (const b of response.results.bindings) {
      this.parcel.parcel.pois.push({url: b.poi.value});
    }
  }

  /*showPopup() {
    if (!this.popup) {
      this.createPopup();
    }
    const html = document.querySelector('#info-offline');
    this.popup.show(this.hsQueryService.last_coordinate_clicked, html);
    this.popupOpen$.next('inside');
    //$rootScope.$broadcast('popupOpened', 'inside');
  }*/

  /*createPopup() {
    this.popup = new Popup();
    this.hsMapService.map.addOverlay(this.popup);
    this.popup.getElement().className += ' popup-headline';
    this.popup.getElement().style.width = '600px';
    this.popup.getElement().style.height = 'auto';
  }*/

  mainRoadOluStyle(feature, resolution) {
    let use = feature.get('use');
    if (use > 30) {
      use = 30;
    }
    const fill = new Fill({
      color: this.rainbow(30, use, 0.7),
    });
    return [
      new Style({
        image: new Circle({
          fill: fill,
          stroke: this.stroke,
          radius: 5,
        }),
        fill: fill,
        stroke: this.stroke,
      }),
    ];
  }

  oluStyle(feature, resolution) {
    let poi_count = feature.get('poi_count');
    if (poi_count > 30) {
      poi_count = 30;
    }
    const fill = new Fill({
      color: this.rainbow(30, poi_count, 0.7),
    });
    return [
      new Style({
        image: new Circle({
          fill: fill,
          stroke: this.stroke,
          radius: 5,
        }),
        fill: fill,
        stroke: this.stroke,
      }),
    ];
  }

  private rainbow(numOfSteps, step, opacity) {
    // based on http://stackoverflow.com/a/7419630
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distiguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    const h = step / (numOfSteps * 1.00000001);
    const i = ~~(h * 4);
    const f = h * 4 - i;
    const q = 1 - f;
    // eslint-disable-next-line default-case
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
    const c =
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
  }
}
