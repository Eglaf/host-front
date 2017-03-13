(function () {

    'use strict';

    app.controller('PartnerGroupFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', 'oPartnerGroupData',
        function ($scope, $state, $stateParams, _log, _func, oPartnerGroupData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Partner data. */
            ctrl.oPartnerGroup = oPartnerGroupData.data;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Check if the data is already exists in the database.
             */
            ctrl.isUpdate = function () {
                return (ctrl.oPartnerGroup && _func.boolVal(ctrl.oPartnerGroup.id));
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('PartnerFormCtrl submit');

                // save via ajax
                $state.go('partnerGroup-list');
            }

        }]);
})();