(function () {

    'use strict';

    app.controller('PartnerGroupCustomersListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$compile', '$filter', '_log', '_func', '_table', '_ajax', 'aoPartnerGroupCustomersData',
        function ($scope, $state, $stateParams, $timeout, $compile, $filter, _log, _func, _table, _ajax, aoPartnerGroupCustomersData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Users. */
            ctrl.aoPartnerGroupCustomersData = aoPartnerGroupCustomersData.data;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {
                _table
                    .setScope($scope)
                    .setContainerElemId('_partnergroup_table_container')
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
                        text: '',
                        func: function (oRow) {
                            var sButtons = '';

                            sButtons += '<a href="#" class="btn btn-danger btn-xs">Hosts</a> ';

                            return sButtons;
                        }
                    }])
                    .setContent(ctrl.aoPartnerGroupCustomersData.customers)
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