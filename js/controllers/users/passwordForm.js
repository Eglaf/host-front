(function () {

    'use strict';

    /**
     * Customer form controller.
     */
    app.controller('UserPasswordFormCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$sce', '_log', '_func', '_ajax', '_error',
        function ($scope, $state, $stateParams, $timeout, $sce, _log, _func, _ajax, _error) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service. */
            ctrl.error = _error;

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

                    _ajax.post('http://host-back/app_dev.php/users/' + $stateParams.userId + '/password/', {
                        'password': ctrl.sPassword
                    }, function (oResponse) {
                        _log(oResponse);

                        $state.go('users-list');
                    }, function (oResponse) {
                        _log('error', oResponse);

                        ctrl.error.processResponse(oResponse);
                    }, {
                        // todo headers...
                    });
                } else {
                    ctrl.error
                        .reset()
                        .add('Password has to be more than 8 characters long!');
                }
            };

        }]);
})();