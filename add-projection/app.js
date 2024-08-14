const caturl = '/php/metadata/csw/index.php';
proj4.defs(
  'EPSG:5514',
  '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs'
);
function hslayersNgConfig(ol) {
  ol.projRegister(proj4);
  const sjtskProjection = ol.proj.get('EPSG:5514');
  return {
    assetsPath: '../node_modules/hslayers-ng-app/assets/',
    default_layers: [
      new ol.layer.Image({
        properties: {
          base: true,
          title: 'Old military map of Czechia',
          BoundingBox: [
            {crs: 'EPSG:5514', extent: [-905000, -1230000, -400000, -900000]},
          ],
        },
        source: new ol.source.ImageWMS({
          url: 'https://mapserver.zcu.cz/cgi-bin/mapserv?map=/data/mapserver.zcu.cz/mapserver/maps/vojmapWMS.map',
          params: {
            LAYERS: 'vojmap',
            INFO_FORMAT: undefined,
            FORMAT: 'image/png',
            ABSTRACT: 'Basemap VOJMAP',
          },
          crossOrigin: null,
        }),
      }),
      new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: 'https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/service.svc/get',
          params: {
            LAYERS: 'GR_ORTFOTORGB',
          },
        }),
        properties: {
          title: 'Ortofoto ČÚZK',
          base: true,
          removable: false,
          thumbnail: 'https://www.agrihub.cz/hsl-ng/img/orto.jpg',
        },
        visible: true,
      }),
    ],
    default_view: new ol.View({
      //center: [1661357, 6572308], //Latitude longitude    to Spherical Mercator
      center: [-805000, -1030000],
      projection: sjtskProjection,
      zoom: 7,
      units: 'm',
    }),
    datasources: [
      {
        title: 'Catalogue',
        url: '/php/metadata/csw/',
        language: 'eng',
        type: 'micka',
        code_list_url:
          '/php/metadata/util/codelists.php?_dc=1440156028103&language=cze&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D',
      },
    ],
    hostname: {
      'default': {
        'title': 'Default',
        'type': 'default',
        'editable': false,
        'url': 'https://mapserver.zcu.cz',
      },
    },
    'catalogue_url': caturl || '/php/metadata/csw/',
    'compositions_catalogue_url': caturl || '/php/metadata/csw/',
    status_manager_url: '/wwwlibs/statusmanager/index.php',
  };
}
