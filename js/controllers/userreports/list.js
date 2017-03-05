(function () {

    'use strict';

    app.controller('UserReportsListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$compile', '$filter', '_log', '_func', '_table', '_ajax', 'aoUsersData',
        function ($scope, $state, $stateParams, $timeout, $compile, $filter, _log, _func, _table, _ajax, aoUsersData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Users. */
            ctrl.aoUsers = aoUsersData.data;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {

                _log(ctrl.aoUsers);

                _table
                    .setScope($scope)
                    .setContainerElemId('_users_table_container')
                    .setConfig({
                        orderByProperty: 'fullName',
                        orderDirectionReversed: false,
                        rowsOnPage: 5
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text: 'Full name',
                        prop: 'fullName',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Contact',
                        prop: 'contact',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Role',
                        prop: 'role',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Phone number',
                        prop: 'phoneNumber',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Partner',
                        prop: 'partner',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (oUser) {
                            return '<div id="buttons' + oUser.userId + '">' + ctrl.getUserButtons(oUser) + '</div>';
                        }
                    }])
                    .setContent(ctrl.aoUsers)
                    .loadTable();
            };

            /**
             * Get list buttons.
             * @param oUser {object} User object.
             * @return {string} Html.
             */
            ctrl.getUserButtons = function (oUser) {
                var sResult = '';

                sResult += '<span class="btn ' + (oUser.flagPhone ? 'btn-success' : 'btn-danger') + ' btn-xs" ng-click="ctrl.flagChange(' + oUser.userId + ', \'flagPhone\');">Flag Phone</span> ';
                sResult += '<span class="btn ' + (oUser.flagEmail ? 'btn-success' : 'btn-danger') + ' btn-xs" ng-click="ctrl.flagChange(' + oUser.userId + ', \'flagEmail\');">Flag Email</span> ';
                sResult += '<span class="btn ' + (oUser.flagReport ? 'btn-success' : 'btn-danger') + ' btn-xs" ng-click="ctrl.flagChange(' + oUser.userId + ', \'flagReport\');">Flag Report</span> ';

                return sResult;
            };

            /**
             * Change flags.
             * @param iUserId {integer} User id.
             * @param sThat {string} Property.
             */
            ctrl.flagChange = function (iUserId, sThat) {
                _log('flagChange(' + iUserId + ', ' + sThat + ')');

                var oUser = _func.findInArrayOfObjectsBy(ctrl.aoUsers, 'userId', iUserId);
                oUser[sThat] = !oUser[sThat];
                var oFrackingAutoParseToString = {
                    flagPhone: (oUser.flagPhone ? 1 : 0),
                    flagEmail: (oUser.flagEmail ? 1 : 0),
                    flagReport: (oUser.flagReport ? 1 : 0)
                };

                _log('debug', 'Sent data', oFrackingAutoParseToString);

                _ajax.post(sBackendUrl + 'users/' + iUserId + '/settings/', oFrackingAutoParseToString, function (oSomeStringSheet) {

                    _log('debug', 'Received data', oSomeStringSheet.data);

                    oUser.flagPhone = (oSomeStringSheet.data.flagPhone == "1" ? 1 : 0);
                    oUser.flagEmail = (oSomeStringSheet.data.flagEmail == "1" ? 1 : 0);
                    oUser.flagReport = (oSomeStringSheet.data.flagReport == "1" ? 1 : 0);

                    var sButtons = ctrl.getUserButtons(oUser);
                    var sCompiledButtons = $compile(sButtons)($scope);

                    angular.element(_func.elemId('buttons' + oUser.userId))
                        .html(sCompiledButtons);
                }, function (data) {
                    _log('error', data);
                }, {
                    // todo headers...
                });
            };

            /**
             * Call a function of the table service. It's required here to call service functions from view.
             * @param sFunc {string} Function of table service.
             * @param xParam {mixed} Parameter of that function.
             * @return {mixed} It can give back anything.
             */
            ctrl.callTableFunc = function (sFunc, xParam) {
                return _table.callFromCtrl(sFunc, xParam);
            };

        }]);
})();