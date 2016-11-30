(function () {

    'use strict';

    /**
     * AuthenticateController
     */
    app.controller('AuthenticateCtrl', [
        '$rootScope', '_log', '_func', '_ajax',
        function ($rootScope, _log, _func, _ajax) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {{username: string, password: string}} Form input values. */
            ctrl.oForm = {username: '', password: ''};

            /** @type {string} Error message. */
            ctrl.sErrorMessage = '';

            /**
             * Send login data.
             */
            ctrl.submitLogin = function () {
                ctrl.sErrorMessage = '';

                ctrl.firstCall(ctrl.oForm.username, ctrl.oForm.password);
            };

            /**
             * First step of authentication.
             * @param sUsername {string} Username.
             * @param sPassword {string} Password.
             */
            ctrl.firstCall = function (sUsername, sPassword) {
                _log('Authentication firstCall()');

                _ajax.post('/login', {
                        username: sUsername,
                        password: sPassword
                    },
                    function (oFirstResponse) {
                        ctrl.secondCall(oFirstResponse);
                    },
                    function (oErrorResponse) {
                        ctrl.errorResponse(oErrorResponse);
                    });
            };

            /**
             * Second step of authentication.
             * @param  oFirstResponse {object} Response of the first call.
             */
            ctrl.secondCall = function (oFirstResponse) {
                _log('Authentication secondCall({oFirstResponse})', oFirstResponse);

                _ajax.get('/api/oauth2/authorize', oFirstResponse,
                    function (oSecondResponse) {
                        ctrl.thirdCall(oFirstResponse, oSecondResponse);
                    }, function (oErrorResponse) {
                        ctrl.errorResponse(oErrorResponse);
                    });
            };

            /**
             * Third step of authentication.
             * @param oFirstResponse {object} Response of the first call.
             * @param oSecondResponse {object} Response of the second call.
             */
            ctrl.thirdCall = function (oFirstResponse, oSecondResponse) {
                _log('Authentication thirdCall({oFirstResponse}, {oSecondResponse})', [oFirstResponse, oSecondResponse]);

                _ajax.post(oFirstResponse.redirect_uri, {
                    "grant_type": "authorization_code",
                    "client_id": oFirstResponse.client_id,
                    "client_secret": oFirstResponse.client_secret,
                    "redirect_uri": "token",
                    "code": oSecondResponse.code
                },
                 function (oThirdResponse) {
                    var sAccessToken = oThirdResponse.accessToken;
                    var sRefreshToken = oThirdResponse.refreshToken;
                    _log('third call succeeded... be happy and do something about it... A:' + sAccessToken + ' R:' + sRefreshToken);
                }, function (oErrorResponse) {
                    ctrl.errorResponse(oErrorResponse);
                });
            };

            /**
             * Show error.
             * @param {object} oErrorResponse
             */
            ctrl.errorResponse = function (oErrorResponse) {
                _log('Authentication errorResponse({oErrorResponse})', oErrorResponse);
                _log('error', 'ErrorCode: ' + oErrorResponse.code + ' \n Invalid: ' + oErrorResponse.invalid + ' \n Message: ' + oErrorResponse.message);

                ctrl.sErrorMessage = oErrorResponse.message;
            };

            /**
             * Decide if there is an error or not.
             * @return {Number}
             */
            ctrl.isError = function () {
                return ctrl.sErrorMessage.length;
            }

        }]);
})();