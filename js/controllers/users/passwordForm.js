(function () {

    'use strict';

    /**
     * Customer form controller.
     */
    app.controller('UserPasswordFormCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '_log', '_func', '_ajax',
        function ($scope, $state, $stateParams, $timeout, _log, _func, _ajax) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {string} */
            ctrl.sPassword = '';

            /** @type {boolean} */
            ctrl.bError = false;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Submit form.
             */
            ctrl.submit = function () {
                _log('CustomerFormCtrl submit');

                if (ctrl.sPassword) {
                    ctrl.bError = false;

                    _ajax.post('http://host-back/app_dev.php/users/' + $stateParams.userId + '/password/', {
                        'password': ctrl.sPassword
                    }, function (data) {
                        _log(data);

                        $state.go('users-list');
                    }, function (data) {
                        _log('error', data);

                        ctrl.bError = true;
                    }, {
                        // todo headers...
                    });
                } else {
                    ctrl.bError = true;
                }
            }

        }]);
})();