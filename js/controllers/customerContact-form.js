(function () {

    'use strict';

    /**
     * CustomerContact form controller.
     */
    app.controller('CustomerContactFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', 'oCustomerContactData',
        function ($scope, $state, $stateParams, _log, _func, oCustomerContactData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Customer data. */
            ctrl.oCustomerContact = oCustomerContactData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Check if the data is already exists in the database.
             */
            ctrl.isUpdate = function () {
                return (ctrl.oCustomerContact && _func.boolVal(ctrl.oCustomerContact.id));
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('CustomerContactFormCtrl submit');

                // save via ajax
                $state.go('customerContact-list', {id: 1});
            }

        }]);
})();