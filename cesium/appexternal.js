function hslayersNgConfig(ol) {
  return {
    assetsPath: '../node_modules/hslayers-cesium-app/assets/',
    default_layers: [],

    default_view: new ol.View({
      center: ol.proj.transform([17.474129, 52.574], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
      zoom: 4,
      units: 'm',
    }),
  };
}

function hslayersCesiumConfig() {
  return {
    cesiumBase: 'node_modules/hslayers-cesium-app/assets/cesium/',
  };
}
