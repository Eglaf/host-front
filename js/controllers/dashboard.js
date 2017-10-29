(function () {

    'use strict';

    app.controller('DashboardCtrl', [
        '$scope', '$state', '$stateParams', '_log', '_func', '_table',
        function ($scope, $state, $stateParams, _log, _func, _table) {

            /** @type {object} This controller. */
            var ctrl = this;

            this.oHostStatusSummary = {
                up: 666,
                down: 13,
                unreachable: 1,
                pending: 2,
                unhandled: 3,
                problems: 4,
                all: 679
            };

            this.oServiceStatusSummary = {
                ok: 777,
                warning: 33,
                unknown: 42,
                critical: 69,
                pending: 20,
                unhandled: 11,
                problems: 99,
                all: 842
            };

            this.aoHostServiceDetails = [{
                host: 'this is host',
                service: 'serviced',
                role: 'playing',
                status: 'OK',
                duration: '123d 12h 34m 56s',
                attempt: '1/10',
                last_check: '2012-12-12 12:12:12',
                status_info: "OK - Everything is fine."
            }, {
                host: 'this is host',
                service: 'serviced',
                role: 'being',
                status: 'WTF',
                duration: '256d 23h 45m 67s',
                attempt: '1/10',
                last_check: '1970-01-01 01:01:01',
                status_info: 'WTF - Something is bad... very-very bad...'
            }, {
                host: 'another host',
                service: 'serviced',
                role: 'roll',
                status: 'OK',
                duration: '1d 1h 1m 1s',
                attempt: '2/10',
                last_check: '1999-11-22 12:12:12',
                status_info: "OK - It's okay... ish..."
            }];

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Load the big table.
             */
            ctrl.initTable = function() {
                _table
                    .setScope($scope)
                    .setContainerElemId('_table_host_service_container')
                    .setConfig({
                        orderByProperty: 'host',
                        orderDirectionReversed: false,
                        rowsOnPage: 5
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text: 'Host',
                        prop: 'host',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Service',
                        prop: 'service',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Role',
                        prop: 'role',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Status',
                        prop: 'status',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Duration',
                        prop: 'duration',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Attempt',
                        prop: 'attempt',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Last check',
                        prop: 'last_check',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Status info',
                        prop: 'status_info',
                        search: 'string',
                        order: true
                    }])
                    .setContent(ctrl.aoHostServiceDetails)
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