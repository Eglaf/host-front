(function () {

    'use strict';

    /**
     * Customer list controller.
     */
    app.controller('CustomerListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$filter', '_log', '_func', '_table', 'aoCustomersData',
        function ($scope, $state, $stateParams, $timeout, $filter, _log, _func, _table, aoCustomersData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Customers. */
            ctrl.aoCustomers = aoCustomersData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {
                _table
                    .setScope($scope)
                    .setContainerElemId('_customers_table_container')
                    .setConfig({
                        orderByProperty: 'label',
                        orderDirectionReversed: false,
                        rowsOnPage: 5
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text: 'ID',
                        prop: 'id',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Email',
                        prop: 'email',
                        search: 'string', // todo date (from-to), number(ls/eq/gr), enum(from content)
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
                            sButtons += '<a ui-sref="host-list({customerId:' + obj.id + '})" class="btn btn-default btn-xs">Hosts</a> ';
                            sButtons += '<a ui-sref="contact-list({id:' + obj.id + '})" class="btn btn-default btn-xs">Contacts</a> ';
                            sButtons += '<a ui-sref="customer-update({id:' + obj.id + '})" class="btn btn-default btn-xs">Update</a> ';

                            return sButtons;
                        }
                    }])
                    .setContent(ctrl.aoCustomers)
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