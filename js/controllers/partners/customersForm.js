(function () {

    'use strict';

    app.controller('PartnersCustomersFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', '_ajax', '_error',
        function ($scope, $state, $stateParams, _log, _func, _ajax, _error) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service. */
            ctrl.error = _error.reset();

            /** @type {object} StateParams. */
            ctrl.params = $stateParams;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /** @type {object} Customer info. */
            ctrl.oCustomer = {
                customerName: '',
                groupId: parseInt($stateParams.partnerId, 10)
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('PartnerContactFormCtrl submit');

                ctrl.error.reset();

                _ajax.post(sBackendUrl + 'customers/', ctrl.oCustomer, function (oResponse) { // todo
                    $state.go('partners-customersList', {partnerId: ctrl.params.partnerId});
                }, function (oResponse) {
                    ctrl.error.processResponse(oResponse);
                });
            };

        }]);
})();