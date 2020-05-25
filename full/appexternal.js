function hslayersNgConfig(ol) {
  return {
    default_layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        title: 'OpenStreetMap',
        base: true,
        visible: true,
        removable: false,
      }),
    ],

    default_view: new ol.View({
      center: ol.proj.transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
      zoom: 4,
      units: 'm',
    }),
  };
}
window.HSL_PATH = '../node_modules/hslayers-ng/dist/';
