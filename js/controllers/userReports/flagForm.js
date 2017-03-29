(function () {

    'use strict';

    /**
     * UserReports FlagForm controller.
     */
    app.controller('UserReportsFlagFormCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '_log', '_func', '_ajax', '_error', 'oUserData',
        function ($scope, $state, $stateParams, $timeout, _log, _func, _ajax, _error, oUserData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service. */
            ctrl.error = _error.reset();

            /** @type {object} */
            ctrl.oUserData = oUserData.data;

            /** @type {boolean} */
            ctrl.bError = false;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('CustomerFormCtrl submit');

                _ajax.post(sBackendUrl + 'users/' + ctrl.oUserData.id + '/settings/', {
                    flagPhone: ctrl.oUserData.flag_phone,
                    flagEmail: ctrl.oUserData.flag_email,
                    flagReport: ctrl.oUserData.flag_report
                }, function (oResponse) {
                    $state.go('users-list');
                }, function (oResponse) {
                    ctrl.error.processResponse(oResponse);
                }, {
                    // todo headers...
                });
            }

        }]);
})();