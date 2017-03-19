(function () {

    'use strict';

    app.controller('UsersListCtrl', [
        '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$filter', '_log', '_func', '_table', 'aoUsersData',
        function ($rootScope, $scope, $state, $stateParams, $timeout, $filter, _log, _func, _table, aoUsersData) {

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

                $rootScope.referrer = 'users';

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
                        func: function (oRow) {
                            var sButtons = '';

                            sButtons += '<a href="#" class="btn btn-' + (oRow.active ? 'success' : 'danger') + ' btn-xs">Activate</a> ';
                            sButtons += '<a ui-sref="users-password-form({userId:' + oRow.id + '})" class="btn btn-default btn-xs">Update password</a> ';
                            sButtons += '<a ui-sref="usersReports-flagForm({userId:' + oRow.id + '})" class="btn btn-default btn-xs">User reports</a> ';

                            return sButtons;
                        }
                    }])
                    .setContent(ctrl.aoUsers)
                    .loadTable();
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