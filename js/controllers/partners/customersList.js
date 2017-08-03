(function () {

    'use strict';

    app.controller('PartnersCustomersListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$compile', '$filter', '_log', '_func', '_table', '_ajax', 'oSourceData',
        function ($scope, $state, $stateParams, $timeout, $compile, $filter, _log, _func, _table, _ajax, oSourceData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Users. */
            ctrl.aoData = oSourceData.data;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {
                _table
                    .setScope($scope)
                    .setContainerElemId('_partners_table_container')
                    .setConfig({
                        orderByProperty:        'name',
                        orderDirectionReversed: false,
                        rowsOnPage:             5
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text:   'Name',
                        prop:   'name',
                        search: 'string',
                        order:  true
                    }, {
                        text: '',
                        func: function (oRow) {
                            var sButtons = '';

                            sButtons += '<a ui-sref="partners-customers-hostsList({partnerId:' + $stateParams.partnerId + ', customerId:' + oRow.id + '})" class="btn btn-default btn-xs">Hosts</a> ';
                            sButtons += '<a ui-sref="partners-customers-hostsForm({partnerId:' + $stateParams.partnerId + ', customerId:' + oRow.id + '})" class="btn btn-default btn-xs">Add host</a> ';
                            sButtons += '<a ui-sref="partners-customers-contactsList({partnerId:' + $stateParams.partnerId + ', customerId:' + oRow.id + '})" class="btn btn-default btn-xs">Contacts</a> ';
                            sButtons += '<a ui-sref="partners-customers-contactsForm({partnerId:' + $stateParams.partnerId + ', customerId:' + oRow.id + '})" class="btn btn-default btn-xs">Add contact</a> ';

                            return sButtons;
                        }
                    }])
                    .setContent(ctrl.aoData.customers)
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