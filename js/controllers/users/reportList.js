(function () {

    'use strict';

    app.controller('UsersReportListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$filter', '_log', '_func', '_table', 'aoUsersData',
        function ($scope, $state, $stateParams, $timeout, $filter, _log, _func, _table, aoUsersData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Users. */
            ctrl.aoUsers = aoUsersData;

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
                        func: function (obj) {
                            var sButtons = '';
                            // sButtons += '<a ui-sref="customer-list({partnerId:' + obj.id + '})" class="btn btn-default btn-xs">Customers</a> ';
                            sButtons += '<a href="" class="btn btn-default btn-xs">Flag Phone</a> ';
                            sButtons += '<a href="" class="btn btn-default btn-xs">Flag Email</a> ';
                            sButtons += '<a href="" class="btn btn-default btn-xs">Flag report</a> ';

                            return sButtons;
                        }
                    }])
                    .setContent(ctrl.aoUsers.data)
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