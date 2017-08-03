(function () {

    'use strict';

    app.controller('PartnersCustomersContactsListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$compile', '$filter', '_log', '_func', '_table', '_ajax', 'oSourceData',
        function ($scope, $state, $stateParams, $timeout, $compile, $filter, _log, _func, _table, _ajax, oSourceData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Users. */
            ctrl.aoData = oSourceData.data;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            ctrl.oStateParams = $stateParams;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {
                var aoData = ctrl.aoData.customers.concat(ctrl.aoData.customers);

                _table
                    .setScope($scope)
                    .setContainerElemId('partners_customers_contacts_table_container')
                    .setConfig({
                        orderByProperty: 'partnerName',
                        orderDirectionReversed: false,
                        rowsOnPage: 5
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text: 'Contact',
                        prop: 'contact',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (oRow) {
                            var sButtons = '';

                           /* sButtons += '<a ui-sref="partners-customers-contactsList({id:' + oRow.id + '})" class="btn btn-default btn-xs">Contacts</a> ';
                            sButtons += '<a ui-sref="partners-customers-contactsForm({id:' + oRow.id + '})" class="btn btn-default btn-xs">Add contact</a> ';
                            sButtons += '<a ui-sref="partners-customersList({partnerId:' + oRow.id + '})" class="btn btn-default btn-xs">Customers</a> ';
                            sButtons += '<a ui-sref="partners-customersForm({partnerId:' + oRow.id + '})" class="btn btn-default btn-xs">Add customer</a>';*/

                            return sButtons;
                        }
                    }])
                    .setContent(aoData)
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

            ctrl.goBack = function () {
                history.back();
            };

        }]);
})();