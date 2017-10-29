(function () {

    'use strict';

    app.controller('PartnersCustomersHostsFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', '_ajax', '_error', 'oHostTypes',
        function ($scope, $state, $stateParams, _log, _func, _ajax, _error, oHostTypes) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service. */
            ctrl.error = _error.reset();

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /** @type {object[]} Select options of hostTypes. */
            ctrl.aoHostTypes = oHostTypes.data;

            /** @type {object} Form data. */
            ctrl.oForm = {
                host: '',
                type: '',
                address: '',
                alias: '',
                description: ''
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('PartnerCustomerHostFormCtrl submit');

                ctrl.error.reset();

                console.log(ctrl.oForm);

               _ajax.post(sBackendUrl + 'customers/' + $stateParams.customerId + '/host/', {
                   'host_name': ctrl.oForm.host,
                   'hostTypeId': ctrl.oForm.type,
                   'address': ctrl.oForm.address,
                   'alias': ctrl.oForm.alias,
                   'description': ctrl.oForm.description
                }, function (oResponse) {
                    window.history.back();
                }, function (oResponse) {
                    ctrl.error.processResponse(oResponse);
                });
            };

            /**
             * Go back.
             */
            ctrl.goBack = function () {
                history.back();
            };

        }]);
})();