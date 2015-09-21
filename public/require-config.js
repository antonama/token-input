requirejs.config({
    baseUrl: "app",
    paths: {
        jquery: "../lib/jquery",
        angular: "../lib/angular",
        app: 'app',
        bootstrap: 'bootstrap'
    },
    priority: ["jquery", "angular"],
    shim: {
        angular: {
            exports: "angular"
        }
    }
});

require([
    'jquery',
	'angular',
    'app'
], function(jquery, angular) {
    angular.bootstrap(document, ["coolInput"]);
});
