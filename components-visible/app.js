function hslayersNgConfig(ol) {
  return {
    useProxy: false,
    assetsPath: '../node_modules/hslayers-ng-app/assets/',
    open_lm_after_comp_loaded: true,
    default_layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        properties: {
          title: 'OpenStreetMap',
          base: true,
          removable: false,
          thumbnail: 'osm.png',
        },
        visible: true,
      }),
    ],
    default_view: new ol.View({
      center: ol.proj.transform([17.474129, 52.574000], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude    to Spherical Mercator
      zoom: 4,
      units: 'm',
    }),
    // sidebarPosition: 'invisible', /* uncomment to hide sidebar */
    componentsEnabled: {
      guiOverlay: true, //all GUI components at once
      info: true, //composition loading info
      toolbar: true, //all toolbars at once: draw, search and measure
      drawToolbar: true, //toolbar to draw/edit features
      searchToolbar: false, //toolbar with search field
      measureToolbar: true, //toolbar to measure distances/areas
      geolocationButton: false, //button which allows to geolocate the user and optionally follow his/her position
      defaultViewButton: true, //button to zoom and pan to an initial extent
      mapControls: false, //buttons to zoom in/out and the scale
      basemapGallery: true, //Move basemaps list into separate GUI component located in the map
      mapSwipe: false, //Enables map-swipe right after app starts
      queryPopup: true, //Enables queryPopup functionality
    },
    panelsEnabled: {
      compositions: false,
      query: true,
      draw: false,
      addData: false,
      layerManager: true,
      legend: true,
      print: true,
      saveMap: true,
      language: true,
      share: false,
      featureTable: true,
      tracking: false,
      tripPlanner: true,
      mapSwipe: false, //A component for splitting a map into two parts with a slider, allowing the user to display the contents of different layers in 
      //parallel on top of each other.
      sensors: false,
    },
  };
}
