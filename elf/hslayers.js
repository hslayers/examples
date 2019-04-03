'use strict';

var hsl_path = '../../hslayers-ng/';
var allowWFS2 = true;
var gitsha;
$.ajax({
    type: "GET",
    url: hsl_path + 'gitsha.js',
    async: false
}).done(function (response) {
    gitsha = response
}).fail(function () {
    gitsha = Math.random();
});

require.config({
    paths: {
        app: 'app',
        core: hsl_path + 'components/core/core',
        ol: hsl_path + 'node_modules/openlayers/dist/ol-debug'
    }
});

window.name = "NG_DEFER_BOOTSTRAP!";

require(['core'], function(app) {
    require(['app'], function(app) {
        var $html = angular.element(document.getElementsByTagName('html')[0]);
        angular.element().ready(function() {
            angular.resumeBootstrap([app['name']]);
        });
    });
});
