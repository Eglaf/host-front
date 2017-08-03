(function () {

    'use strict';

    app.controller('PartnersCustomersHostsListCtrl', [
        '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$compile', '$filter', '_log', '_func', '_table', '_ajax', 'oSourceData',
        function ($rootScope, $scope, $state, $stateParams, $timeout, $compile, $filter, _log, _func, _table, _ajax, oSourceData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Users. */
            ctrl.aoData = oSourceData.data;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /** @type {number} No comment hack. */
            ctrl.oStateParams = $stateParams;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {

                $rootScope.referrer = 'hosts';

                if (ctrl.aoData) {

                    console.log("\n aoData: \n");
                    console.log(ctrl.aoData);

                    _table
                        .setScope($scope)
                        .setContainerElemId('_host_table_container')
                        .setConfig({
                            orderByProperty:        'host',
                            orderDirectionReversed: false,
                            rowsOnPage:             5
                        })
                        .setTranslations({
                            globalSearchPlaceholder: 'Search'
                        })
                        .setColumns([{
                            text:   'Name',
                            prop:   'host',
                            search: 'string',
                            order:  true
                        }, {
                            text:   'Type',
                            prop:   'type',
                            search: 'string',
                            order:  true
                        }, {
                            text:   'Status',
                            func:   function (oRow) {
                                return '-'
                            },
                            // search: 'string',
                            order:  true
                        }, {
                            text:   'Description',
                            prop:   'description',
                            search: 'string',
                            order:  true
                        }/*, {
                         text: '',
                         func: function (oRow) {
                         var sButtons = '';

                         // sButtons += '<a ui-sref="usersReports-flagForm({userId:' + oRow.id + '})" class="btn btn-default btn-xs">Reports</a> ';

                         return sButtons;
                         }
                         }*/])
                        .setContent(ctrl.aoData.hosts)
                        .loadTable();
                }
                else {
                    console.error("no aoData")
                }
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