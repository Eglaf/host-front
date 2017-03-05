(function () {

    'use strict';

    app.controller('PartnerFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', 'oPartnerData',
        function ($scope, $state, $stateParams, _log, _func, oPartnerData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Partner data. */
            ctrl.oPartner = oPartnerData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Check if the data is already exists in the database.
             */
            ctrl.isUpdate = function () {
                return (ctrl.oPartner && _func.boolVal(ctrl.oPartner.id));
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('PartnerFormCtrl submit');

                // save via ajax
                $state.go('partner-list');
            }

        }]);
})();