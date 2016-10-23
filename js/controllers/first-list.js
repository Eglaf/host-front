(function () {

    'use strict';

    app.controller('FirstListCtrl', ['$scope', '$stateParams', '$timeout', '$filter', '_log', '_func', '_list', 'aoTableContent', function ($scope, $stateParams, $timeout, $filter, _log, _func, _list, aoTableContent) {

        /** @type {object} This controller. */
        var ctrl = this;

        /**
         * Initialize.
         */
        ctrl.initTable = function () {
            ctrl.useTempData(); // todo test only

            _list
                .setScope($scope)
                .setContainerElemId('_first_list_container')
                .setConfig({
                    defaultOrderByProperty: 'label',
                    defaultOrderDirectionReversed: false,
                    rowsOnPage: 5 // todo
                })
                .setHeaders([{
                    text: 'ID',
                    prop: 'id',
                    search: 'string',
                    order: true
                }, {
                    text: 'Label',
                    prop: 'label',
                    search: 'string', // todo date (from-to), number(ls/eq/gr), enum(from content)
                    order: true
                }, {
                    text: 'Extended',
                    func: function (obj) {
                        return obj.label + ' extended' + obj.d;
                    },
                    search: 'string'
                }])
                .setContent(aoTableContent)
                .loadTable();
        };

        /**
         * Call a function of the list service. It's required here to call service functions from view.
         * @param sFunc {string} Function of list service.
         * @param xParam {mixed} Parameter of that function.
         * @return {mixed} It can give back anything.
         */
        ctrl.callListFunc = function (sFunc, xParam) {
            return _list.callFromCtrl(sFunc, xParam);
        };


        /**
         * Temp bullshit...
         */
        ctrl.useTempData = function () {
            console.warn('Temp content is used!');

            aoTableContent = [{
                id: 10,
                label: 'qwer',
                d: 0
            }, {
                id: 11,
                label: 'asdf',
                d: 0
            }, {
                id: 12,
                label: 'zxcv',
                d: 0
            }, {
                id: 13,
                label: 'qwertyui',
                d: 1
            }, {
                id: 14,
                label: 'dfghjkl',
                d: 1
            }, {
                id: 15,
                label: 'qwerasdfzxcv',
                d: 1
            }];
        };

    }]);
})();