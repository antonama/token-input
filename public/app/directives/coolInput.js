define([], function () {
    angular.module("coolInput")
    .directive("coolInput", function ($filter, inputSuggestions) {
        return {
            restrict: "EA",
            templateUrl: "app/tpl/suggestions.html",
            replace: true,
            scope: {
                model: "=",
                limit: "="
            },
            controller: function ($scope, $element) {
                var realInput = $element.find("input");

                this.addPill = function () {
                    var suggestionToAdd = $scope.suggestions[$scope.config.activeIndex];

                    if (!suggestionToAdd && $scope.model && $scope.model.length) {
                        suggestionToAdd = $scope.model;
                    }

                    if (!~$scope.pills.indexOf(suggestionToAdd)) {
                        $scope.pills.push(suggestionToAdd);
                    }
                }

                this.deletePill = function (pill) {
                    $scope.pills = $scope.pills.filter(function (item) {
                        return item !== pill;
                    });
                }

                this.clearText = function () {
                    $scope.model = "";
                }

                this.clearSuggestions = function () {
                    $scope.suggestions = [];
                    $scope.config.activeIndex = -1;
                }

                this.focusInput = function () {
                    realInput.focus();
                }
            },
            link: function (scope, elem, attrs) {
                scope.$watch("model", function (nv, ov) {
                    if (nv && nv.trim().length) {
                        inputSuggestions.get(nv).then(function (suggestions) {
                            scope.suggestions = $filter("removeDupes")(suggestions, scope.pills);
                        });
                    } else {
                        scope.suggestions = [];
                    }
                });
            }
        }
    })
    .directive("realInput", function () {
        return {
            restrict: "A",
            require: ["^coolInput", "ngModel"],
            scope: false,
            link: function (scope, elem, attrs, ctrls) {
                var coolInputCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];

                var _keyCodes = {
                        40: 'down',
                        38: 'up',
                        27: 'escape',
                        13: 'enter'
                    };

                scope.config = {
                    activeIndex: -1
                };
                scope.pills = [];

                elem.on("keydown", function (event) {
                    var key = _keyCodes[event.keyCode];

                    if (key) {
                        event.preventDefault();

                        switch (key) {
                            case 'down':
                                if (scope.suggestions &&
                                    scope.suggestions.slice(0, scope.limit).length > scope.config.activeIndex + 1) {
                                        ++scope.config.activeIndex;
                                    }
                                break;
                            case 'up':
                                if (scope.suggestions &&
                                    scope.config.activeIndex > 0) {
                                        --scope.config.activeIndex;
                                    }
                                break;
                            case 'escape':
                                coolInputCtrl.clearText();
                                coolInputCtrl.clearSuggestions();

                                break;
                            case 'enter':
                                coolInputCtrl.addPill();
                                coolInputCtrl.clearText();
                                coolInputCtrl.clearSuggestions();
                                coolInputCtrl.focusInput();

                                break;
                        }
                    }

                    scope.$apply();
                });
            }
        }
    })
    .directive("pill", function () {
        return {
            restrict: "A",
            require: "^coolInput",
            scope: false,
            link: function (scope, elem, attrs, coolInputCtrl) {
                var pill = scope.$eval(attrs.pill);

                elem.on("click", function () {
                    coolInputCtrl.deletePill(pill);
                    scope.$apply();
                });
            }
        }
    })
    .directive("suggestion", function () {
        return {
            restrict: "A",
            require: "^coolInput",
            scope: false,
            link: function (scope, elem, attrs, coolInputCtrl) {
                var suggestion = scope.$eval(attrs.suggestion);

                elem.on("mouseenter", function () {
                    scope.config.activeIndex = scope.suggestions.indexOf(suggestion);
                    scope.$apply();
                });

                elem.on("click", function () {
                    coolInputCtrl.addPill();
                    coolInputCtrl.clearText();
                    coolInputCtrl.clearSuggestions();
                    coolInputCtrl.focusInput();

                    scope.$apply();
                });
            }
        }
    })
    .filter("removeDupes", function () {
        return function (source, dupes) {
            return source && source.filter(function (item) {
                return !~dupes.indexOf(item);
            });
        }
    })
})
