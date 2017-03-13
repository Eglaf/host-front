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
                        prop: 'partnerName',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (oPartnerGroup) {
                            return '';
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