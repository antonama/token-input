define([], function () {
    angular.module("coolInput")
        .service("inputSuggestions", function ($http) {
            this.get = function (prefix) {
                return $http.get("/suggestions/get/" + prefix).then(function (res) {
                    return res.data;
                });
            }

            return this;
        })
})
