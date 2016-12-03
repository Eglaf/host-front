(function () {

    'use strict';

    app.controller('DashboardCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', 'oResponseData',
        function ($scope, $state, $stateParams, _log, _func, oResponseData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

        }]);
})();