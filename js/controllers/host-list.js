(function () {

    'use strict';

    app.controller('HostListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$filter', '_log', '_func', '_table', 'aoHostsData',
        function ($scope, $state, $stateParams, $timeout, $filter, _log, _func, _table, aoHostsData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Hosts. */
            ctrl.aoHosts = aoHostsData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {
                _table
                    .setScope($scope)
                    .setContainerElemId('_hosts_table_container')
                    .setConfig({
                        orderByProperty: 'label',
                        orderDirectionReversed: false,
                        rowsOnPage: 5
                    })
                    .setTranslations({
                        globalSearchPlaceholder: 'Search'
                    })
                    .setColumns([{
                        text: 'ID',
                        prop: 'id',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Customer',
                        prop: 'customer',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Url',
                        prop: 'url',
                        search: 'string', // todo date (from-to), number(ls/eq/gr), enum(from content)
                        order: true
                    }, {
                        text: 'Ip',
                        prop: 'ip',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (obj) {
                            return '<a ui-sref="host-update({id:' + obj.id + '})" class="btn btn-default btn-xs">Update</a>'
                        },
                        search: 'string'
                    }])
                    .setContent(ctrl.aoHosts)
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