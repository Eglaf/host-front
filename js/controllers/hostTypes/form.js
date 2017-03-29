(function () {

    'use strict';

    app.controller('HostTypeFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', '_ajax', '_error',
        function ($scope, $state, $stateParams, _log, _func, _ajax, _error) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service. */
            ctrl.error = _error;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /** @type {object} Contact info. */
            ctrl.oHostType = {
                name: '',
                description: ''
            };

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('PartnerContactFormCtrl submit');

                ctrl.error.reset();

                _ajax.post(sBackendUrl + 'hosttypes/', ctrl.oContact, function (oResponse) {
                    $state.go('hostTypes-list');
                }, function (oResponse) {
                    ctrl.error.processResponse(oResponse);
                });
            };

        }]);
})();