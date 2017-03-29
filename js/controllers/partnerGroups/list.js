(function () {

    'use strict';

    app.controller('PartnerGroupsListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$compile', '$filter', '_log', '_func', '_table', '_ajax', 'aoPartnerGroupsData',
        function ($scope, $state, $stateParams, $timeout, $compile, $filter, _log, _func, _table, _ajax, aoPartnerGroupsData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Users. */
            ctrl.aoPartnerGroupsData = aoPartnerGroupsData.data;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {

                _log(ctrl.aoPartnerGroupsData);

                _table
                    .setScope($scope)
                    .setContainerElemId('_partnergroup_table_container')
                    .setConfig({
                        orderByProperty: 'partnerName',
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

                            sButtons += '<a ui-sref="partner-contacts({id:' + oRow.id + '})" class="btn btn-default btn-xs">Contacts</a> ';
                            sButtons += '<a ui-sref="partnerGroups-customersList({partnerId:' + oRow.id + '})" class="btn btn-default btn-xs">Customers</a> ';
                            sButtons += '<a ui-sref="partnerGroups-customersForm({partnerId:' + oRow.id + '})" class="btn btn-default btn-xs">Add customer</a>';

                            return sButtons;
                        }
                    }])
                    .setContent(ctrl.aoPartnerGroupsData)
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