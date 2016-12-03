(function () {

    'use strict';

    app.controller('HostFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', 'oHostData',
        function ($scope, $state, $stateParams, _log, _func, oHostData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Host data. */
            ctrl.oHost = oHostData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Check if the data is already exists in the database.
             */
            ctrl.isUpdate = function () {
                return (ctrl.oHost && _func.boolVal(ctrl.oHost.id));
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('HostFormCtrl submit');

                // save via ajax
                $state.go('host-list');
            }

        }]);
})();