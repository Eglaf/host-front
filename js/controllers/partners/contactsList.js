(function () {

    'use strict';

    app.controller('PartnerContactsListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$compile', '$filter', '_log', '_func', '_table', '_ajax', 'aoPartnerContactsData',
        function ($scope, $state, $stateParams, $timeout, $compile, $filter, _log, _func, _table, _ajax, aoPartnerContactsData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Users. */
            ctrl.aoPartnerContactsData = aoPartnerContactsData.data;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /** @type {number} No comment hack. */
            ctrl.iStateParam = $stateParams.id;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {
                _table
                    .setScope($scope)
                    .setContainerElemId('_partnergroup_table_container')
                    .setConfig({
                        orderByProperty: 'contact',
                        orderDirectionReversed: false,
                        rowsOnPage: 5
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text: 'Name',
                        prop: 'contact',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (oRow) {
                            var sButtons = '';

                            sButtons += '<a ui-sref="usersReports-flagForm({userId:' + oRow.id + '})" class="btn btn-default btn-xs">Reports</a> ';

                            return sButtons;
                        }
                    }])
                    .setContent(ctrl.aoPartnerContactsData)
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