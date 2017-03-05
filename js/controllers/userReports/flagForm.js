(function () {

    'use strict';

    /**
     * UserReports FlagForm controller.
     */
    app.controller('UserReportsFlagFormCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '_log', '_func', '_ajax', 'oUserData',
        function ($scope, $state, $stateParams, $timeout, _log, _func, _ajax, oUserData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {string} */
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

                _ajax.post(sBackendUrl + 'users/' + $stateParams.userId + '/settings/', {
                    flagPhone: ctrl.oUserData.flagPhone,
                    flagEmail: ctrl.oUserData.flagEmail,
                    flagReport: ctrl.oUserData.flagReport
                }, function (data) {
                    _log(data);

                    $state.go('users-list');
                }, function (data) {
                    _log('error', data);
                }, {
                    // todo headers...
                });
            }

        }]);
})();