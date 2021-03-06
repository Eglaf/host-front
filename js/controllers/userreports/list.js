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
                        orderByProperty: 'name',
                        orderDirectionReversed: false,
                        rowsOnPage: 5
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text: 'Name',
                        prop: 'name',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Email',
                        prop: 'contact',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Role',
                        prop: 'role',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Mobile number',
                        prop: 'phone',
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
                            return '<div id="buttons' + oUser.id + '">' + ctrl.getUserButtons(oUser) + '</div>';
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

                sResult += '<span class="btn ' + (oUser.flag_phone ? 'btn-success' : 'btn-danger') + ' btn-xs" ng-click="ctrl.flagChange(' + oUser.id + ', \'flag_phone\');">Phone</span> ';
                sResult += '<span class="btn ' + (oUser.flag_email ? 'btn-success' : 'btn-danger') + ' btn-xs" ng-click="ctrl.flagChange(' + oUser.id + ', \'flag_email\');">Email</span> ';
                sResult += '<span class="btn ' + (oUser.flag_report ? 'btn-success' : 'btn-danger') + ' btn-xs" ng-click="ctrl.flagChange(' + oUser.id + ', \'flag_report\');">Report</span> ';

                return sResult;
            };

            /**
             * Change flags.
             * @param iUserId {number} User id.
             * @param sThat {string} Property.
             */
            ctrl.flagChange = function (iUserId, sThat) {
                _log('flagChange(' + iUserId + ', ' + sThat + ')');

                var oUser = _func.findInArrayOfObjectsBy(ctrl.aoUsers, 'id', iUserId);
                oUser[sThat] = !oUser[sThat];
                var oParseToString = {
                    flagPhone: _func.boolVal(oUser.flag_phone),
                    flagEmail: _func.boolVal(oUser.flag_email),
                    flagReport: _func.boolVal(oUser.flag_report)
                };

                _ajax.post(sBackendUrl + 'users/' + iUserId + '/settings/', oParseToString, function (oSomeStringSheet) {

                    oUser.flag_phone = (oSomeStringSheet.data.flag_phone == "1" ? 1 : 0);
                    oUser.flag_email = (oSomeStringSheet.data.flag_email == "1" ? 1 : 0);
                    oUser.flag_report = (oSomeStringSheet.data.flag_report == "1" ? 1 : 0);

                    var sButtons = ctrl.getUserButtons(oUser);
                    var sCompiledButtons = $compile(sButtons)($scope);

                    angular.element(_func.elemId('buttons' + oUser.id))
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