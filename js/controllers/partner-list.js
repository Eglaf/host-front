(function () {

    'use strict';

    app.controller('PartnerListCtrl', [
        '$scope', '$state', '$stateParams', '$timeout', '$filter', '_log', '_func', '_table', 'aoPartnersData',
        function ($scope, $state, $stateParams, $timeout, $filter, _log, _func, _table, aoPartnersData) {

            /** @type {object} This controller. */
            var ctrl = this;

            /** @type {object[]} Partners. */
            ctrl.aoPartners = aoPartnersData;

            /** @type {string} Name of current route state. */
            ctrl.sCurrentRoute = $state.current.name;

            /**
             * Initialize.
             */
            ctrl.initTable = function () {
                _table
                    .setScope($scope)
                    .setContainerElemId('_partners_table_container')
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
                        text: 'Email',
                        prop: 'email',
                        search: 'string',
                        order: true
                    }, {
                        text: 'Group',
                        prop: 'group',
                        search: 'string',
                        order: true
                    }, {
                        text: '',
                        func: function (obj) {
                            var sButtons = '';
                            sButtons += '<a ui-sref="partner-update({id:' + obj.id + '})" class="btn btn-default btn-xs">Update</a> ';
                            sButtons += '<a ui-sref="partnerContact-list({id:' + obj.id + '})" class="btn btn-default btn-xs">Contacts</a> ';

                            return sButtons;
                        },
                        search: 'string'
                    }])
                    .setContent(ctrl.aoPartners)
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