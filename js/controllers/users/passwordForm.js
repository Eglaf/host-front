(function () {

    'use strict';

    /**
     * Customer form controller.
     */
    app.controller('UserPasswordFormCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$sce', '_log', '_func', '_ajax', '_error', 'oUserData',
        function ($scope, $state, $stateParams, $timeout, $sce, _log, _func, _ajax, _error, oUserData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service. */
            ctrl.error = _error;

            /** @type {object} */
            ctrl.oUserData = oUserData.data;

            /** @type {string} */
            ctrl.sPassword = '';

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('CustomerFormCtrl submit');

                if (ctrl.sPassword.length > 8) {
                    ctrl.error.reset();

                    _ajax.post(sBackendUrl + 'users/' + ctrl.oUserData.id + '/password/', {
                        'id': ctrl.oUserData.id,
                        'password': ctrl.sPassword
                    }, function (oResponse) {
                        ctrl.error.processResponse(oResponse);

                        $state.go('users-list');
                    }, function (oResponse) {
                        ctrl.error.processResponse(oResponse);
                    });
                } else {
                    ctrl.error
                        .reset()
                        .add('Password has to be more than 8 characters long!');
                }
            };

        }]);
})();