(function () {

    'use strict';

    /**
     * AuthenticateController
     */
    app.controller('AuthenticateCtrl', [
        '$rootScope', '$state', '$stateParams', '_log', '_func', '_ajax', '_error',
        function ($rootScope, $state, $stateParams, _log, _func, _ajax, _error) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object} Error service */
            ctrl.error = _error;

            /** @type {{username: string, password: string}} Form input values. */
            ctrl.oForm = {username: '', password: ''};

            /**
             * Send login data.
             */
            ctrl.submitLogin = function () {
                ctrl.error.reset();

                ctrl.firstCall(ctrl.oForm.username, ctrl.oForm.password);
            };

            /**
             * First step of authentication.
             * @param sUsername {string} Username.
             * @param sPassword {string} Password.
             */
            ctrl.firstCall = function (sUsername, sPassword) {
                _log('Authentication firstCall(' + sUsername + ', ' + sPassword + ')');

                if (sUsername && sPassword) {
                    _ajax.post(sBackendUrl + 'login/', {
                            username: sUsername,
                            password: sPassword
                        },
                        function (oFirstResponse) {
                            ctrl.secondCall(oFirstResponse);
                        },
                        function (oErrorResponse) {
                            ctrl.error.processResponse(oErrorResponse);
                        });
                } else {
                    ctrl.error.add('Empty username or password!');
                }
            };

            /**
             * Second step of authentication.
             * @param  oFirstResponse {object} Response of the first call.
             */
            ctrl.secondCall = function (oFirstResponse) {
                _log('Authentication secondCall({oFirstResponse})', oFirstResponse);

                _ajax.get(sBackendUrl + 'api/oauth2/authorize/', oFirstResponse.data,
                    function (oSecondResponse) {
                        ctrl.thirdCall(oFirstResponse, oSecondResponse);
                    }, function (oErrorResponse) {
                        ctrl.error.processResponse(oErrorResponse);
                    });
            };

            /**
             * Third step of authentication.
             * @param oFirstResponse {object} Response of the first call.
             * @param oSecondResponse {object} Response of the second call.
             */
            ctrl.thirdCall = function (oFirstResponse, oSecondResponse) {
                _log('Authentication thirdCall({oFirstResponse}, {oSecondResponse})', [oFirstResponse, oSecondResponse]);

                _ajax.post(sBackendUrl + oFirstResponse.data.redirect_uri, {
                        "grant_type": "authorization_code",
                        "client_id": oFirstResponse.data.client_id,
                        "client_secret": oFirstResponse.data.client_secret,
                        "redirect_uri": "token",
                        "code": oSecondResponse.data.code
                    },
                    function (oThirdResponse) {
                        $rootScope.sAccessToken = oThirdResponse.data.access_token;
                        $rootScope.sRefreshToken = oThirdResponse.data.refresh_token;

                        _log('third call succeeded... A:' + $rootScope.sAccessToken + ' R:' + $rootScope.sRefreshToken);

                        ctrl.error.reset();
                        if (ctrl.error.authFrom.length) {
                            ctrl.error.goBack();
                        } else {
                            // TODO
                            $state.go('dashboard');
                        }
                    }, function (oErrorResponse) {
                        ctrl.error.processResponse(oErrorResponse);
                    });
            };

        }]);
})();