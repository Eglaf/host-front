(function () {

    'use strict';

    /**
     * HostType list controller.
     */
    app.controller('HostTypeListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$filter', '_log', '_func', '_table', 'aoHostTypesData',
        function ($scope, $state, $stateParams, $timeout, $filter, _log, _func, _table, aoHostTypesData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Host types. */
            ctrl.aoHostTypes = aoHostTypesData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {
                _table
                    .setScope($scope)
                    .setContainerElemId('_host_types_table_container')
                    .setConfig({
                        orderByProperty: 'name',
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
                        func: function (obj) {
                            return '<a ui-sref="hostType-update({id:' + obj.id + '})" class="btn btn-default btn-xs">Update</a>'
                        },
                        search: 'string'
                    }])
                    .setContent(ctrl.aoHostTypes)
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