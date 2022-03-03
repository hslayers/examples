function hslayersNgConfig(ol, appId) {
  return {
    assetsPath: '../node_modules/hslayers-ng-app/assets/',
    proxyPrefix: window.location.hostname.includes('localhost')
      ? `${window.location.protocol}//${window.location.hostname}:8085/`
      : '/proxy/',
    default_layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        title: 'OpenStreetMap',
        base: true,
        visible: true,
        removable: false,
      }),
      appId == 'app-2'
        ? new ol.layer.Tile({
            properties: {
              title: 'Latvian municipalities (parent layer)',
            },
            source: new ol.source.TileWMS({
              url: 'https://lvmgeoserver.lvm.lv/geoserver/ows',
              params: {
                LAYERS: 'publicwfs:LV_admin_vienibas',
                INFO_FORMAT: undefined,
                FORMAT: 'image/png; mode=8bit',
              },
              crossOrigin: 'anonymous',
            }),
          })
        : undefined,
    ],

    default_view: new ol.View({
      center: ol.proj.transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
      zoom: 4,
      units: 'm',
    }),
  };
}
window.HSL_PATH = '../node_modules/hslayers-ng-app/';
