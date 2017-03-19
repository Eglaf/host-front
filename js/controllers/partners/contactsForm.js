(function () {

    'use strict';

    app.controller('PartnerContactFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', '_ajax', '_error',
        function ($scope, $state, $stateParams, _log, _func, _ajax, _error) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service. */
            ctrl.error = _error;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /** @type {object} Contact info. */
            ctrl.oContact = {
                username: '',
                password: '',
                fullName: '',
                phoneNumber: ''
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('PartnerContactFormCtrl submit');

                ctrl.error.reset();

                _ajax.post(sBackendUrl + 'partners/' + $stateParams.id + '/contact/', ctrl.oContact, function (oResponse) {
                    $state.go('partner-contacts', {
                        id: $stateParams.id
                    });
                }, function (oResponse) {
                    ctrl.error.processResponse(oResponse);
                });
            };

        }]);
})();