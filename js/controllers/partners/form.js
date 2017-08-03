(function () {

    'use strict';

    app.controller('PartnersFormCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', '_ajax', '_error',
        function ($scope, $state, $stateParams, _log, _func, _ajax, _error) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service. */
            ctrl.error = _error.reset();

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('PartnerFormCtrl submit');

                    ctrl.error.reset();

                    _ajax.post(sBackendUrl + 'partners/group/', {
                        'partnerName': ctrl.sPartnerName
                    }, function (oResponse) {
                        $state.go('partners-list');
                    }, function (oResponse) {
                        ctrl.error.processResponse(oResponse);
                    });
            };

        }]);
})();