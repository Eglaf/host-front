/**
 * Table service.
 *
 * @todo Filter rows with column based search. (string, number range, date interval)
 */
app.factory('_table', ['$rootScope', '$compile', '$filter', '_log', '_func', function ($rootScope, $compile, $filter, _log, _func) {
    return {

        /** @type {Object} Scope from controller. */
        oScope: null,

        /** @type {string} ElemId of the container. */
        sContainerElemId: '',

        /** @type {Object[]} Headers of table. */
        aoColumns: [],

        /** @type {Object[]} Content of table. It contains everything. */
        aoContent: [],

        /** @type {Object[]} All of the filtered and sorted content of table. Limit comes later. */
        aoSelectedContent: [],

        /** @type {Object[]} Limited content of table. It'will be rendered into table body. */
        aoLimitedContent: [],

        /** @type {string} Globally searched string. */
        sGlobalSearch: '',

        /** @type {number} Currently visited page. */
        iCurrentPage: 0,

        /** @type {Object} Config of table. */
        oConfig: {
            /** @var {number} Minimum length of search. */
            searchMinLength: 2,
            /** @type {number} Delay (in milliseconds) before doing the search.  */
            delaySearch: 500,
            /** @type {string} The property of order by. */
            orderByProperty: '',
            /** @type {boolean} The direction of order by. */
            orderDirectionReversed: false,
            /** @type {number} Number of visible rows. */
            rowsOnPage: 5,
            /** @type {number} Number of visible pagination pages near to the current one. */
            visibleNeighbourPages: 3
        },

        /** @type {Object} Translations. */
        oTrans: {
            contentInfo: 'Showing %from% to %to% of %all% rows.',
            contentInfoFiltered: 'Showing %from% to %to% of %all% rows. Filtered from %total% rows.',
            globalSearchPlaceholder: 'Global search'
        },

        /**************************************************************************************************************************************************************
         *                                                          **         **         **         **         **         **         **         **         **         **
         * Setters/Init                                               **         **         **         **         **         **         **         **         **         **
         *                                                          **         **         **         **         **         **         **         **         **         **
         *************************************************************************************************************************************************************/

        /**
         * Set scope.
         * @param {Object} oAppScope
         * @return {Object} This.
         */
        setScope: function (oAppScope) {
            _log('Table setScope({$scope})');

            this.oScope = oAppScope;

            return this;
        },

        /**
         * Set the elemId of the container.
         * @param {string} sElemId Element id.
         * @return {Object} This.
         */
        setContainerElemId: function (sElemId) {
            _log('Table setContainerElemId(' + sElemId + ')');

            this.sContainerElemId = _func.removeElemSelector(sElemId);

            return this;
        },

        /**
         * Set config.
         * @param {Object} oConfig Settings.
         * @return {Object} This.
         */
        setConfig: function (oConfig) {
            _log('Table setConfig({Object})', oConfig);

            angular.merge(this.oConfig, oConfig);

            return this;
        },

        /**
         * Set translations.
         * @param oTrans {Object}
         * @return This.
         */
        setTranslations: function (oTrans) {
            _log('Table setConfig({Object})', oTrans);

            angular.merge(this.oTrans, oTrans);

            return this;
        },

        /**
         * Set columns.
         * @param {Object[]} aoColumns Columns.
         * @return {Object} This.
         */
        setColumns: function (aoColumns) {
            _log('Table setColumns({Object[]})', aoColumns);

            this.aoColumns = aoColumns;

            return this;
        },

        /**
         * Set content.
         * @param aoContent
         * @return {Object} This.
         */
        setContent: function (aoContent) {
            _log('Table setContent({Object})', aoContent);

            this.aoContent = aoContent;

            return this;
        },

        /**
         * Generate the environment and the table without content and add it to the container. After that calls LoadTableContent.
         */
        loadTable: function () {
            _log('Table LoadTable()');

            var sHtml = this.getTableHeader() + this.getTableBody() + this.getTableFooter();
            var sCompiledHtml = $compile(sHtml)(this.oScope);

            angular.element(_func.elemId(this.sContainerElemId))
                .html('')
                .append(sCompiledHtml);

            this.recalculateContent();
            this.recalculateLimit();
            this.loadTableContent();
        },


        /**************************************************************************************************************************************************************
         *                                                          **         **         **         **         **         **         **         **         **         **
         * Calculate content                                          **         **         **         **         **         **         **         **         **         **
         *                                                          **         **         **         **         **         **         **         **         **         **
         *************************************************************************************************************************************************************/

        /**
         * Loads the Html code of table content and adds it to the table body.
         */
        loadTableContent: function () {
            _log('Table LoadTableContent()');

            var sHtml = this.getTableContent();
            var sCompiledHtml = $compile(sHtml)(this.oScope);

            angular.element(_func.elemId(this.sContainerElemId + '_table > tbody'))
                .html('')
                .append(sCompiledHtml);
        },

        /**
         * From the whole content array, it creates a filtered and sorted array.
         */
        recalculateContent: function () {
            _log('Table recalculateContent()');

            this.aoSelectedContent = this.aoContent;
            this.iCurrentPage = 0;

            this.recalculateGlobalSearch();
            this.recalculateOrder();

            this.reloadTableContentInfo();
            this.reloadPagination();
        },

        /**
         * Filter the content by the global search.
         */
        recalculateGlobalSearch: function () {
            var that = this;

            if (typeof that.sGlobalSearch === 'string' && that.sGlobalSearch.length >= that.oConfig.searchMinLength) {
                var aSearchFragments = that.sGlobalSearch.split(' ');

                var aoTempContent = that.aoSelectedContent;
                that.aoSelectedContent = [];

                var aSearchProps = [];
                angular.forEach(that.aoColumns, function (oColumn) {
                    if (typeof oColumn.search !== 'undefined') {
                        if (typeof oColumn.prop !== 'undefined') {
                            aSearchProps.push(oColumn.prop);
                        } else if (typeof oColumn.func === 'function') {
                            aSearchProps.push(oColumn.func);
                        }
                    }
                });

                angular.forEach(aoTempContent, function (oRow) {
                    if (_func.isInObjectTextContent(oRow, aSearchProps, aSearchFragments, that.oConfig.searchMinLength, false)) {
                        that.aoSelectedContent.push(oRow);
                    }
                });
            }
        },

        /**
         * Recalculate order.
         */
        recalculateOrder: function () {
            if (typeof this.oConfig.orderByProperty === 'string' && this.oConfig.orderByProperty.length) {
                this.aoSelectedContent = $filter('orderBy')(this.aoSelectedContent, this.oConfig.orderByProperty, this.oConfig.orderDirectionReversed)
            }
        },

        /**
         * Apply limit on the selected content.
         */
        recalculateLimit: function () {
            _log('Table recalculateLimit()');

            var that = this;
            this.aoLimitedContent = [];

            var i = 0;
            angular.forEach(this.aoSelectedContent, function (oRow) {
                if (i >= (that.iCurrentPage * that.oConfig.rowsOnPage) && i < ((that.iCurrentPage * that.oConfig.rowsOnPage) + that.oConfig.rowsOnPage)) {
                    that.aoLimitedContent.push(oRow);
                }
                i++;
            });

            this.reloadTableContentInfo();
            this.reloadPagination();
        },

        /**
         * Reload the content info below table.
         */
        reloadTableContentInfo: function () {
            angular.element(_func.elemId(this.sContainerElemId + ' .table-info'))
                .html('')
                .append(this.getTableContentInfo());
        },


        /**************************************************************************************************************************************************************
         *                                                          **         **         **         **         **         **         **         **         **         **
         * Events                                                     **         **         **         **         **         **         **         **         **         **
         *                                                          **         **         **         **         **         **         **         **         **         **
         *************************************************************************************************************************************************************/

        /**
         * Call a function from the html via controller.
         * Requirements:
         *  - In the view, the controller alias has to be: "ctrl".
         *  - The Controller has to have a function --ctrl.callTableFunc(sFunc, xParam) {} -- which calls this one.
         * @param sFunc {string} Function of this service.
         * @param xParam {mixed} Parameter of the function of this.
         * @return {mixed} It can give back anything.
         */
        callFromCtrl: function (sFunc, xParam) {
            _log('Table callFromCtrl(' + sFunc + ', {MIXED})');

            if (this.hasOwnProperty(sFunc)) {
                if (typeof this[sFunc] === 'function') {
                    return this[sFunc](xParam);
                } else {
                    _log('error', 'Table property ' + sFunc + ' should be function, but it is ' + typeof this[sFunc] + '!');
                }
            } else {
                _log('error', 'Table does not have a ' + sFunc + ' function!');
            }
        },

        /**
         * Set order property.
         * @param sOrder {string} Property to order by.
         * @returns {Object} This.
         */
        setOrder: function (sOrder) {
            _log('Table setOrder("' + sOrder + '")');

            // If the clicked orderBy property is the current, then reverse the table.
            if (sOrder === this.oConfig.orderByProperty) {
                this.oConfig.orderDirectionReversed = !this.oConfig.orderDirectionReversed;
            }
            // If the clicked orderBy property is not the current, then make it current and set the direction to ASC.
            else {
                this.oConfig.orderByProperty = sOrder;
                this.oConfig.orderDirectionReversed = false;
            }

            this.recalculateContent();
            this.recalculateLimit();
            this.loadTableContent();

            return this;
        },

        /**
         * Search in the table globally.
         * @param sGlobalSearch {string} Globally searched string.
         * @return {Object} This.
         */
        setGlobalSearch: function (sGlobalSearch) {
            _log('Table setGlobalSearch("' + sGlobalSearch + '")');

            this.sGlobalSearch = sGlobalSearch;

            this.recalculateContent();
            this.recalculateLimit();
            this.loadTableContent();

            return this;
        },

        /**
         * Go to the selected page.
         * @param iPage {number}
         */
        goToPage: function (iPage) {
            _log('Table goToPage(' + iPage + ')');

            this.iCurrentPage = iPage;

            this.recalculateLimit();
            this.loadTableContent();
        },

        /**
         * Go to the first page.
         */
        goToFirstPage: function () {
            this.goToPage(0);
        },

        /**
         * Go to the last page.
         */
        goToLastPage: function () {
            this.goToPage(this.getMaxPage());
        },


        /**************************************************************************************************************************************************************
         *                                                          **         **         **         **         **         **         **         **         **         **
         * Private methods                                            **         **         **         **         **         **         **         **         **         **
         *                                                          **         **         **         **         **         **         **         **         **         **
         *************************************************************************************************************************************************************/

        /**
         * It gives back the maximum number of pages.
         * @return {number}
         */
        getMaxPage: function () {
            return Math.ceil(this.aoSelectedContent.length / this.oConfig.rowsOnPage) - 1;
        },

        /**
         * Refresh the pagination below the table.
         */
        reloadPagination: function () {
            _log('Table reloadPagination()');

            var ePagination = angular.element(_func.elemId(this.sContainerElemId + ' .pagination'));
            ePagination.html('');

            if (this.getMaxPage() >= 1) {
                var sCompiledHtml = $compile(this.getPagination())(this.oScope);

                ePagination.append(sCompiledHtml);
            }
        },

        /**
         * Text of content info.
         * @return {string}
         */
        getTableContentInfo: function () {
            var iTo = (this.oConfig.rowsOnPage * (this.iCurrentPage+1));
            iTo = (iTo > this.aoSelectedContent.length ? this.aoSelectedContent.length : iTo);

            // Only searched visible.
            if (this.aoContent.length !== this.aoSelectedContent.length) {
                return _func.replacePlaceholders(this.oTrans.contentInfoFiltered, {
                    from: (this.oConfig.rowsOnPage * this.iCurrentPage) + 1,
                    to: iTo,
                    all: this.aoSelectedContent.length,
                    total: this.aoContent.length
                });
            }
            // All visible.
            else {
                return _func.replacePlaceholders(this.oTrans.contentInfo, {
                    from: (this.oConfig.rowsOnPage * this.iCurrentPage) + 1,
                    to: iTo,
                    all: this.aoSelectedContent.length
                });
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

            sHtml += '<input class="form-control pull-right" style="width:300px;" placeholder="' + this.oTrans.globalSearchPlaceholder + '"' +
                'ng-model="' + this.sContainerElemId + '_globalSearchInTable" ' +
                'ng-model-options="{ debounce: ' + this.oConfig.delaySearch + ' }" ' +
                'ng-change="ctrl.callTableFunc(\'setGlobalSearch\', ' + this.sContainerElemId + '_globalSearchInTable);">'; // todo 2nd table? // get TableProp(sGlobalSearch)?

            sHtml += '<table id="' + (this.sContainerElemId + '_table') + '" class="table">';
            sHtml += '<thead>';

            angular.forEach(this.aoColumns, function (oColumn) {
                if (oColumn.order) {
                    sHtml += '<th ng-click="ctrl.callTableFunc(\'setOrder\', \'' + oColumn.prop + '\');">' + oColumn.text + '</th>';
                }
                else {
                    sHtml += '<th>' + oColumn.text + '</th>';
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
            sHtml += '<span class="table-info"></span>';
            sHtml += '<ul class="pagination pull-right"></ul>';

            return sHtml;
        },

        /**
         * Get the content of the table body.
         * @return {string} Html.
         */
        getTableContent: function () {
            var that = this;
            var sHtml = '';

            angular.forEach(that.aoLimitedContent, function (oRow) {
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
            angular.forEach(this.aoColumns, function (oColumn) {
                sHtml += that.getTableCell(oRow, oColumn);
            });
            sHtml += '</tr>';

            return sHtml;
        },

        /**
         * Get the content of a cell.
         * @param oRow {Object} Row from content.
         * @param oColumn {Object} Column.
         * @return {string} Html.
         */
        getTableCell: function (oRow, oColumn) {
            var sHtml = '';

            sHtml += '<td>';
            // Show property value.
            if (oColumn.hasOwnProperty('prop')) {
                sHtml += oRow[oColumn.prop];
            }
            // Do something with the object, by the given function.
            else if (oColumn.hasOwnProperty('func')) {
                if (typeof oColumn['func'] === 'function') {
                    sHtml += oColumn['func'](oRow);
                } else {
                    _log('error', 'Table content expects function, got ' + (typeof fn) + ' instead!');
                }
            } else {
                _log('error', 'Table header has to have "prop" or "func" to know what to do with cell content.');
            }
            sHtml += '</td>';

            return sHtml;
        },

        /**
         * Get the pagination html.
         * @return {string}
         */
        getPagination: function () {
            var sHtml = '';

            // First.
            if (this.iCurrentPage !== 0) {
                sHtml += '<li>';
                sHtml += '<a href="#" ng-click="ctrl.callTableFunc(\'goToFirstPage\')">&laquo;</a>';
                sHtml += '</li>';
            } else {
                sHtml += '<li class="disabled">';
                sHtml += '<a href="#">&laquo;</a>';
                sHtml += '</li>';
            }

            // Pagination numbers.
            for (var i = 0; i <= this.getMaxPage(); i++) {
                if (i - this.oConfig.visibleNeighbourPages <= this.iCurrentPage && i + this.oConfig.visibleNeighbourPages >= this.iCurrentPage) {
                    sHtml += '<li ' + (i === this.iCurrentPage ? 'class="active"' : '') + '>';
                    sHtml += '<a href="#" ng-click="ctrl.callTableFunc(\'goToPage\',' + i + ')">' + (i + 1) + '</a>';
                    sHtml += '</li>';
                }
            }

            // Last.
            if (this.iCurrentPage !== this.getMaxPage()) {
                sHtml += '<li>';
                sHtml += '<a href="#" ng-click="ctrl.callTableFunc(\'goToLastPage\')">&raquo;</a>';
                sHtml += '</li>';
            } else {
                sHtml += '<li class="disabled">';
                sHtml += '<a href="#">&raquo;</a>';
                sHtml += '</li>';
            }

            return sHtml;
        }

    }
}]);
