(function () {

    'use strict';

    /**
     * CustomerContact list controller.
     */
    app.controller('CustomerContactListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$filter', '_log', '_func', '_table', 'aoCustomerContactsData',
        function ($scope, $state, $stateParams, $timeout, $filter, _log, _func, _table, aoCustomerContactsData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Customers. */
            ctrl.aoCustomerContacts = aoCustomerContactsData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {
                _table
                    .setScope($scope)
                    .setContainerElemId('_customer_contacts_table_container')
                    .setConfig({
                        orderByProperty: 'country',
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
                        text: 'Country',
                        prop: 'country',
                        search: 'string',
                        order: true
                    }, {
                        text: 'City',
                        prop: 'city',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Address',
                        prop: 'address',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Phone',
                        prop: 'phone',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (obj) {
                            return '<a ui-sref="customerContact-update({id:' + obj.id + '})" class="btn btn-default btn-xs">Update</a>'
                        },
                        search: 'string'
                    }])
                    .setContent(ctrl.aoCustomerContacts)
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