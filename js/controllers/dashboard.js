(function () {

    'use strict';

    app.controller('DashboardCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func',
        function ($scope, $state, $stateParams, _log, _func) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

        }]);
})();