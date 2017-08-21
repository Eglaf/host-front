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
                            text:   'Host',
                            prop:   'host',
                            search: 'string',
                            order:  true
                        }, {
                            text:   "Host's type",
                            prop:   'type',
                            search: 'string',
                            order:  true
                        }, {
                            text:   'Description',
                            // prop:   'description',
                            func: function () { return '-' },
                            search: 'string',
                            order:  true
                        }, {
                            text:   'Status1',
                            func:   function (oRow) {
                                return ctrl.getRandomStatus();
                            },
                            // search: 'string',
                            order:  true
                        }, {
                            text:   'Status2',
                            func:   function (oRow) {
                                return ctrl.getRandomStatus();
                            },
                            // search: 'string',
                            order:  true
                        }, {
                            text:   'Status3',
                            func:   function (oRow) {
                                return ctrl.getRandomStatus();
                            },
                            // search: 'string',
                            order:  true
                        }])
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

            ctrl.getRandomStatus = function () {
                var asItems = ['Pending','Failed', 'Responding'];

                return asItems[Math.floor(Math.random()*asItems.length)];
            }

        }]);
})();