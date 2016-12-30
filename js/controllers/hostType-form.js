(function () {

    'use strict';

    /**
     * HostType form controller.
     */
    app.controller('HostTypeFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', 'oHostTypeData',
        function ($scope, $state, $stateParams, _log, _func, oHostTypeData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Host data. */
            ctrl.oHostType = oHostTypeData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Check if the data is already exists in the database.
             */
            ctrl.isUpdate = function () {
                return (ctrl.oHostType && _func.boolVal(ctrl.oHostType.id));
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('HostFormCtrl submit');

                // save via ajax
                $state.go('hostType-list');
            }

        }]);
})();