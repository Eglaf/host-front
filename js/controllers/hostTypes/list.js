(function () {

    'use strict';

    app.controller('HostTypeListCtrl', [
        '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$compile', '$filter', '_log', '_func', '_table', '_ajax', 'aoHostTypesData',
        function ($rootScope, $scope, $state, $stateParams, $timeout, $compile, $filter, _log, _func, _table, _ajax, aoHostTypesData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Users. */
            ctrl.aoHostTypesData = aoHostTypesData.data;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /** @type {number} No comment hack. */
            ctrl.iStateParam = $stateParams.id;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {

                $rootScope.referrer = 'hostTypes';

                _table
                    .setScope($scope)
                    .setContainerElemId('_hosttype_table_container')
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
                        text: 'Description',
                        prop: 'description',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (oRow) {
                            var sButtons = '';

                            // sButtons += '<a ui-sref="usersReports-flagForm({userId:' + oRow.id + '})" class="btn btn-default btn-xs">Reports</a> ';

                            return sButtons;
                        }
                    }])
                    .setContent(ctrl.aoHostTypesData)
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