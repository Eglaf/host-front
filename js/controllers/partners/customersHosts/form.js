(function () {

    'use strict';

    app.controller('PartnersCustomersHostsFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', '_ajax', '_error',
        function ($scope, $state, $stateParams, _log, _func, _ajax, _error) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service. */
            ctrl.error = _error.reset();

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            ctrl.oForm = {
                'host': '',
                'type': '',
                'description': '',
                'customer': '',
                'status': ''
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('PartnerCustomerHostFormCtrl submit');

                ctrl.error.reset();

                _log("TODO submit");

               /* _ajax.post(sBackendUrl + 'customers/' + $stateParams.customerId + '/contact/', {
                    "username":ctrl.oForm.userName,
                    "password":ctrl.oForm.password,
                    "fullName":ctrl.oForm.fullName,
                    "phoneNumber":ctrl.oForm.phoneNumber,
                    "customerId": $stateParams.customerId,
                    "partnerId": $stateParams.partnerId
                }, function (oResponse) {
                    window.history.back();
                    // $state.go('partnerGroups-list');
                }, function (oResponse) {
                    ctrl.error.processResponse(oResponse);
                });*/
            };

            ctrl.goBack = function () {
                history.back();
            };

        }]);
})();