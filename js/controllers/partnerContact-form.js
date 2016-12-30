(function () {

    'use strict';

    /**
     * PartnerContact form controller.
     */
    app.controller('PartnerContactFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', 'oPartnerContactData',
        function ($scope, $state, $stateParams, _log, _func, oPartnerContactData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Partner data. */
            ctrl.oPartnerContact = oPartnerContactData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Check if the data is already exists in the database.
             */
            ctrl.isUpdate = function () {
                return (ctrl.oPartnerContact && _func.boolVal(ctrl.oPartnerContact.id));
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('PartnerContactFormCtrl submit');

                // save via ajax
                $state.go('partnerContact-list', {id: 1});
            }

        }]);
})();