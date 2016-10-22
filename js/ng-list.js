app.factory('_list', ['$rootScope', '$compile', '$filter', '_log', '_func', function ($rootScope, $compile, $filter, _log, _func) {
    return {

        /** @type {Object} Scope from controller. */
        oScope: null,

        /** @type {string} ElemId of the container. */
        sContainerElemId: '',

        /** @type {Object} Settings for table. */
        oConfig: {},

        /** @type {Object[]} Headers of table. */
        aoHeaders: [],

        /** @type {Object[]} Content of table. */
        aoContent: [],

        /** @type {Object[]} Filtered and sorted content of table. The limit is applied after these. */
        aoSelectedContent: [],

        /** @type {number} Minimum length of search. */
        iMinSearchLength: 2,

        /** @type {number} Delay (in milliseconds) before doing the search.  */
        iSearchDelay: 500,

        /** @type {string} Globally searched string. */
        sGlobalSearch: '',

        /** @type {string} The property of order by. */
        sOrderByProperty: '',

        /** @type {boolean} The direction of order by. */
        sOrderDirectionReversed: false,


        /**************************************************************************************************************************************************************
         *                                                          **         **         **         **         **         **         **         **         **         **
         * Setters                                                    **         **         **         **         **         **         **         **         **         **
         *                                                          **         **         **         **         **         **         **         **         **         **
         *************************************************************************************************************************************************************/

        /**
         * Set scope.
         * @param {Object} oAppScope
         * @return {Object} This.
         */
        setScope: function (oAppScope) {
            _log('List setScope({$scope})');

            this.oScope = oAppScope;

            return this;
        },

        /**
         * Set the elemId of the container.
         * @param {string} sElemId Element id.
         * @return {Object} This.
         */
        setContainerElemId: function (sElemId) {
            _log('List setContainerElemId(' + sElemId + ')');

            this.sContainerElemId = _func.removeElemSelector(sElemId);

            return this;
        },

        /**
         * Set config.
         * @param {Object} oConfig Settings.
         * @return {Object} This.
         */
        setConfig: function (oConfig) {
            _log('List setConfig({Object})', oConfig);

            this.oConfig = oConfig;

            return this;
        }, // todo rewrite properties in the service... (this[prop])? ... or search and replace...

        /**
         * Set headers.
         * @param {Object[]} aoHeaders Column headers.
         * @return {Object} This.
         */
        setHeaders: function (aoHeaders) {
            _log('List setHeaders({Object[]})', aoHeaders);

            this.aoHeaders = aoHeaders;

            return this;
        },

        /**
         * Set content.
         * @param aoContent
         * @return {Object} This.
         */
        setContent: function (aoContent) {
            _log('List setContent({Object})', aoContent);

            this.aoContent = aoContent;

            return this;
        },


        /**************************************************************************************************************************************************************
         *                                                          **         **         **         **         **         **         **         **         **         **
         * Runtime                                                    **         **         **         **         **         **         **         **         **         **
         *                                                          **         **         **         **         **         **         **         **         **         **
         *************************************************************************************************************************************************************/

        /**
         * Generate the environment and the table without content and add it to the container. After that calls LoadTableContent.
         */
        loadTable: function () {
            _log('List LoadTable()');

            var sHtml = this.getTableHeader() + this.getTableBody() + this.getTableFooter();
            var sCompiledHtml = $compile(sHtml)(this.oScope);

            angular.element(_func.elemId(this.sContainerElemId))
                .html('')
                .append(sCompiledHtml);

            this.loadTableContent();
        },

        /**
         * Recalculate the selected content from the global content, then loads the Html code of table content and add it to the table body.
         */
        loadTableContent: function() {
            _log('List LoadTableContent()');

            this.recalculateContent();

            var sHtml = this.getTableContent();
            var sCompiledHtml = $compile(sHtml)(this.oScope);

            angular.element(_func.elemId(this.sContainerElemId + '_table > tbody'))
                .html('')
                .append(sCompiledHtml);
        },

        /**
         * Call a function from the html via controller.
         * Requirements:
         *  - In the view, the controller alias has to be: "ctrl".
         *  - The Controller has to have a function --ctrl.callListFunc(sFunc, xParam) {} -- which calls this one.
         * @param sFunc {string} Function of this service.
         * @param xParam {mixed} Parameter of the function of this.
         * @return {mixed} It can give back anything.
         */
        callFromCtrl: function (sFunc, xParam) {
            _log('List callFromCtrl(' + sFunc + ', {MIXED})');

            if (this.hasOwnProperty(sFunc)) {
                if (typeof this[sFunc] === 'function') {
                    return this[sFunc](xParam);
                } else {
                    _log('error', 'List property ' + sFunc + ' should be function, but it is ' + typeof this[sFunc] + '!');
                }
            } else {
                _log('error', 'List does not have a ' + sFunc + ' function!');
            }
        },

        /**
         * Set order property.
         * @param sOrder {string} Property to order by.
         * @returns {Object} This.
         */
        setOrder: function (sOrder) {
            _log('List setOrder("' + sOrder + '")');

            // If the clicked orderBy property is the current, then reverse the list.
            if (sOrder === this.sOrderByProperty) {
                this.sOrderDirectionReversed = !this.sOrderDirectionReversed;
            }
            // If the clicked orderBy property is not the current, then make it current and set the direction to ASC.
            else {
                this.sOrderByProperty = sOrder;
                this.sOrderDirectionReversed = false;
            }

            this.loadTableContent();

            return this;
        },

        /**
         * Search in the table globally.
         * @param sGlobalSearch {string} Globally searched string.
         * @return {Object} This.
         */
        setGlobalSearch: function (sGlobalSearch) {
            _log('List setGlobalSearch("' + sGlobalSearch + '")');

            this.sGlobalSearch = sGlobalSearch;
            this.loadTableContent();

            return this;
        },


        /**************************************************************************************************************************************************************
         *                                                          **         **         **         **         **         **         **         **         **         **
         * Calculate                                                  **         **         **         **         **         **         **         **         **         **
         *                                                          **         **         **         **         **         **         **         **         **         **
         *************************************************************************************************************************************************************/

        /**
         * From the whole content array, it creates a filtered and sorted array.
         */
        recalculateContent: function () {
            _log('List recalculateContent()');

            this.aoSelectedContent = this.aoContent;

            // todo Filter rows with column based search. (string, number range, date intervale)
            this.recalculateGlobalSearch();
            this.recalculateOrder();
        },

        /**
         * Filter the content by the global search.
         */
        recalculateGlobalSearch: function () {
            var that = this;

            if (typeof that.sGlobalSearch === 'string' && that.sGlobalSearch.length >= that.iMinSearchLength) {
                var aoTempContent = that.aoSelectedContent;
                that.aoSelectedContent = [];

                angular.forEach(aoTempContent, function (oRow) {
                    if (_func.isInObjectTextContent(oRow, ['id', 'label'], that.sGlobalSearch, that.iMinSearchLength, false)) {
                        that.aoSelectedContent.push(oRow);
                    }
                });
            }
        },

        /**
         * Recalculate order.
         */
        recalculateOrder: function () {
            if (typeof this.sOrderByProperty === 'string' && this.sOrderByProperty.length) {
                this.aoSelectedContent = $filter('orderBy')(this.aoSelectedContent, this.sOrderByProperty, this.sOrderDirectionReversed)
            }
        },


        /**************************************************************************************************************************************************************
         *                                                          **         **         **         **         **         **         **         **         **         **
         * Get Html                                                   **         **         **         **         **         **         **         **         **         **
         *                                                          **         **         **         **         **         **         **         **         **         **
         *************************************************************************************************************************************************************/

        /**
         * Get the header of table.
         * @return {string} Html.
         */
        getTableHeader: function () {
            var sHtml = '';

            sHtml += '<input ' +
                'ng-model="' + this.sContainerElemId + '_globalSearchInList" ' +
                'ng-model-options="{ debounce: ' + this.iSearchDelay + ' }" ' +
                'ng-change="ctrl.callListFunc(\'setGlobalSearch\', ' + this.sContainerElemId + '_globalSearchInList);">'; // todo 2nd table? // get ListProp(sGlobalSearch)?

            sHtml += '<table id="' + (this.sContainerElemId + '_table') + '" class="table">';
            sHtml += '<thead>';

            angular.forEach(this.aoHeaders, function (oHead) {
                if (oHead.order) {
                    sHtml += '<th ng-click="ctrl.callListFunc(\'setOrder\', \'' + oHead.prop + '\');">' + oHead.text + '</th>';
                }
                else {
                    sHtml += '<th>' + oHead.text + '</th>';
                }
            });

            sHtml += '</thead>';

            return sHtml;
        },

        /**
         * Get the content of table.
         * @return {string} Html.
         */
        getTableBody: function () {
            var sHtml = '';

            sHtml += '<tbody></tbody>';

            return sHtml;
        },

        /**
         * Get the footer of table.
         * @return {string} Html.
         */
        getTableFooter: function () {
            var sHtml = '';

            sHtml += '</table>';

            return sHtml;
        },

        /**
         * Get the content of the table body.
         * @return {string} Html.
         */
        getTableContent: function () {
            var that = this;
            var sHtml = '';

            angular.forEach(that.aoSelectedContent, function (oRow) {
                sHtml += that.getTableRow(oRow);
            });

            return sHtml;
        },

        /**
         * Get a row of a table.
         * @param oRow {Object} Row from content.
         * @return {string} Html.
         */
        getTableRow: function (oRow) {
            var that = this;
            var sHtml = '';

            sHtml += '<tr>';
            angular.forEach(this.aoHeaders, function (oHead) {
                sHtml += that.getTableCell(oRow, oHead);
            });
            sHtml += '</tr>';

            return sHtml;
        },

        /**
         * Get the content of a cell.
         * @param oRow {Object} Row from content.
         * @param oHead {Object} Column from header.
         * @return {string} Html.
         */
        getTableCell: function (oRow, oHead) {
            var sHtml = '';

            sHtml += '<td>';
            // Show property value.
            if (oHead.hasOwnProperty('prop')) {
                sHtml += oRow[oHead.prop];
            }
            // Do something with the object, by the given function.
            else if (oHead.hasOwnProperty('func')) {
                var fn = oHead['func'];
                if (typeof fn === 'function') {
                    sHtml += fn(oRow);
                } else {
                    _log('error', 'Table content expects function, got ' + (typeof fn) + ' instead!');
                }
            } else {
                _log('error', 'Table header has to have "prop" or "func" to know, what to do with cell content.');
            }
            sHtml += '</td>';

            return sHtml;
        }

    }
}]);
