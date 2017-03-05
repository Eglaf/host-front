(function () {

    'use strict';

    /**
     * Customer form controller.
     */
    app.controller('CustomerFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', 'oCustomerData',
        function ($scope, $state, $stateParams, _log, _func, oCustomerData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Customer data. */
            ctrl.oCustomer = oCustomerData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Check if the data is already exists in the database.
             */
            ctrl.isUpdate = function () {
                return (ctrl.oCustomer && _func.boolVal(ctrl.oCustomer.id));
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('CustomerFormCtrl submit');

                // save via ajax
                $state.go('customer-list');
            }

        }]);
})();