(function () {

    'use strict';

    /**
     * Contact list controller... both partner and customer contacts.
     */
    app.controller('ContactListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$filter', '_log', '_func', '_table', 'oData',
        function ($scope, $state, $stateParams, $timeout, $filter, _log, _func, _table, oData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Partners. */
            ctrl.oData = oData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            ctrl.oPartnerTable = null;

            ctrl.oCustomerTable = null;

            /**
             * Initialize partners.
             */
            ctrl.initPartnerTable = function () {
                ctrl.oPartnerTable = _func.clone(_table);

                ctrl.oPartnerTable
                    .setScope($scope)
                    .setContainerElemId('_partner_contacts_table_container')
                    .setConfig({
                        orderByProperty: 'contact',
                        orderDirectionReversed: false,
                        rowsOnPage: 2
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text: 'User ID',
                        prop: 'userId',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Contact',
                        prop: 'contact',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (obj) {
                            return '<a ui-sref="partnerContact-update({id:' + obj.id + '})" class="btn btn-default btn-xs">Update</a>'
                        },
                        search: 'string'
                    }])
                    .setContent(ctrl.oData.partnerContacts)
                    .loadTable();
            };

            /**
             * Initialize customers.
             */
            ctrl.initCustomerTable = function () {
                ctrl.oCustomerTable = _func.clone(_table);

                ctrl.oCustomerTable
                    .setScope($scope)
                    .setContainerElemId('_customer_contacts_table_container')
                    .setConfig({
                        orderByProperty: 'contact',
                        orderDirectionReversed: false,
                        rowsOnPage: 3
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text: 'User ID',
                        prop: 'userId',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Contact',
                        prop: 'contact',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (obj) {
                            return '<a ui-sref="partnerContact-update({id:' + obj.id + '})" class="btn btn-default btn-xs">Update</a>'
                        },
                        search: 'string'
                    }])
                    .setContent(ctrl.oData.customerContacts)
                    .loadTable();
            };

            /**
             * Call a function of the table service. It's required here to call service functions from view.
             * @param sFunc {string} Function of table service.
             * @param xParam {mixed} Parameter of that function.
             * @return {mixed} It can give back anything.
             */
            ctrl.callTableFunc = function (sFunc, xParam, sContainerId) {
                if (sContainerId === '_partner_contacts_table_container') {
                    return ctrl.oPartnerTable.callFromCtrl(sFunc, xParam);
                }
                else if (sContainerId === '_customer_contacts_table_container') {
                    return ctrl.oCustomerTable.callFromCtrl(sFunc, xParam);
                }
                else {
                    console.error('WHAT?');
                }
            };

        }]);
})();