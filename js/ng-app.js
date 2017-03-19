{

    // todo _log.i() _log.e() _log.w() maybe _log()
    // todo _debug.v() _debug.vv() maybe _debug() too...

    "use strict";

    /** @type {boolean} It has to be true if you want to see any info in console. */
    var bNgLog = true;

    /** @type {boolean} It has to be true if you want to see debug info in console. */
    var bNgDebug = true;

    /**
     * Ng app.
     * In case of ngUi... second parameter array... "ui.bootstrap"
     */
    var app = angular.module("NgApp", ['ui.router', 'ui.bootstrap'], function ($interpolateProvider, $httpProvider, $locationProvider) { // var app = angular.module("NgApp", ['ui.router'], function ($interpolateProvider, $httpProvider, $locationProvider) {

        //
        // Set the module to use "|[ ]|" to display variables instead of "{{ }}" (because of SF2) or "[[ ]]" (because of Json array).
        //

        $interpolateProvider.startSymbol("|[");
        $interpolateProvider.endSymbol("]|");

        /*$locationProvider.html5Mode({
         enabled: true,
         requireBase: false
         });*/

        //
        // PHP can't get Json data from posted requests. With this hack, it'll change the way to encode data.
        //

        /**
         * Converts an object to x-www-form-urlencoded serialization. It doesn't send empty arrays/objects, but you can do that check in PHP.
         * @param oData {Object} Data object of the post request.
         * @return {String} Object converted into string.
         */
        var convertJsonParamToUrlEncodedString = function (oData) {
            var name, value, fullSubName, subName, subValue, innerObj, i;
            var query = '';

            for (name in oData) {
                value = oData[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += convertJsonParamToUrlEncodedString(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += convertJsonParamToUrlEncodedString(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            return (angular.isObject(data) && (String(data) !== "[object File]") ? convertJsonParamToUrlEncodedString(data) : data);
        }];
    });


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Directives                                                 **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Prevent the default event on links with href which is empty or hashtag.
     */
    app.directive('a', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function (e) {
                        e.preventDefault();
                    });
                }
            }
        };
    });


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Filters                                                    **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Debug filter in HTML.
     */
    app.filter('debug', function () {
        return function (input) {
            if (input === '') {
                return 'empty string';
            }
            else {
                return (input ? input : ('' + input));
            }
        };
    });


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Function services                                          **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Print all the parameters to console.
     * If the first parameter is "error", "warn", "info", "debug", "log" then shows other parameters as an error, warn, info, debug or log. Log is the default.
     * @param arguments {Mixed} All you want to see.
     */
    app.factory("_log", ["$log", function ($log) {
        return function () {
            if (bNgLog) {
                var sCall = "log";
                var sFirstParam = (typeof arguments[0] === "string" ? arguments[0].toLowerCase() : arguments[0]);
                var bAlwaysVisible = false;

                for (var i = 0; i < arguments.length; i++) {
                    if (i === 0 && (sFirstParam === "error" || sFirstParam === "warn" || sFirstParam === "info" || sFirstParam === "debug" || sFirstParam === "log")) {
                        sCall = sFirstParam;
                        bAlwaysVisible = (sFirstParam !== "debug");
                    }
                    else {
                        if (sCall !== 'debug' || bNgDebug) {
                            $log[sCall](arguments[i]);
                        }
                    }
                }
            }
        };
    }]);


    /**************************************************************************************************************************************************************
     *                                                          **         **         **         **         **         **         **         **         **         **
     * Object services                                            **         **         **         **         **         **         **         **         **         **
     *                                                          **         **         **         **         **         **         **         **         **         **
     *************************************************************************************************************************************************************/

    /**
     * Service to handle errors.
     */
    app.factory("_error", ["$state", "$stateParams", "$sce", "_func", "_log", function ($state, $stateParams, $sce, _func, _log) {
        return {

            /** @var {Array} The error messages. */
            aoErrors: [],

            /** @var {number} The status code. */
            iStatusCode: 0,

            /** @var {boolean} Show more error. */
            bOpen: false,

            /**
             * Add an error message
             * @param sMsg
             * @param iCode
             */
            add: function (sMsg, iCode) {
                iCode = _func.default(iCode, 0);

                this.aoErrors.push({
                    code: (iCode > 0 ? iCode : 0),
                    message: sMsg
                });

                return this;
            },

            /**
             * Check if there is an error.
             * @return {Number} Number of characters. Zero if there is'nt an error.
             */
            has: function () {
                return (this.aoErrors.length);
            },

            /**
             * Reset errors.
             */
            reset: function () {
                this.aoErrors = [];

                return this;
            },

            /**
             * Process response of ajax.
             * @param oResponse
             */
            processResponse: function (oResponse) {
                if (oResponse.status !== 200) {
                    _log('error processResponse');

                    if (oResponse.status === 401) {
                        this.setAuthFrom($state.current.name, _func.clone($stateParams));

                        $state.go('authenticate');
                    } else {
                        this.iStatusCode = oResponse.status;

                        if (Array.isArray(oResponse.data.errors)) {
                            this.aoErrors = oResponse.data.errors;
                        } else {
                            this.aoErrors = [{
                                code: -1,
                                message: 'Error!'
                            }];
                        }
                    }
                }
            },

            /** @var {string} In case of authentication needed... was redirect from here. */
            authFrom: '',

            /** @var {object} In case of authentication needed... had these params. */
            fromParams: {},

            /**
             * Set the page to redirect to after authentication.
             * @param authFrom
             * @param fromParams
             */
            setAuthFrom: function (authFrom, fromParams) {
                this.authFrom = authFrom;
                this.fromParams = fromParams;
            },

            /**
             * Go back to the page, it was redirect from. Then reset variables.
             */
            goBack: function () {
                $state.go(this.authFrom, this.fromParams);

                this.authFrom = '';
                this.fromParams = {};
            }

        }
    }]);

    /**
     * Some commonly used function.
     */
    app.factory("_func", ["_log", function (_log) {
        return {

            /**
             * To boolean.
             * @param xVar {mixed} Variable to bool.
             * @return {boolean} True or false.
             */
            boolVal: function (xVar) {
                if (xVar === false) {
                    return false
                }
                if (xVar === 0 || xVar === 0.0) {
                    return false
                }
                if (xVar === '' || xVar === '0') {
                    return false
                }
                if (Array.isArray(xVar) && xVar.length === 0) {
                    return false
                }
                if (xVar === null || xVar === undefined) {
                    return false
                }

                return true
            },

            /**
             * Set the default value to a variable.
             * Remember that, objects are passed by reference, while other variables are passed by value.
             * @param xVar {Mixed} The value that need to be set in case of undefined.
             * @param xDef {Mixed} The default value if the variale is undefined.
             * @return {Mixed} The variable.
             */
            default: function (xVar, xDef) {
                return (typeof xVar === "undefined" ? xDef : xVar);
            },

            /**
             * Clone object.
             * @param obj {Object} Something to create copy of it.
             * @return {Object} Cloned object.
             */
            clone: function (obj) {
                if (obj === null || typeof obj !== 'object') {
                    return obj;
                }
                var temp = obj.constructor(); // give temp the original obj's constructor
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        temp[key] = this.clone(obj[key]);
                    }
                }
                return temp;
            },

            /**
             * Turn object into an array. For example the orderBy filter requires this.
             * @param object {Object} Object that looks like an array but it isn't.
             * @return {Array} The object turned into array.
             */
            objectToArray: function (object) {
                var array = [];
                for (var prop in object) {
                    array.push(object[prop]);
                }
                return array;
            },

            /**
             * Gives back the size of an object. Something like an array.length but it works on objects.
             * @param oVar {Object} The object to check.
             * @return {Number} The number of properties.
             */
            getObjectSize: function (oVar) {
                var iSize = 0;
                var sProperty;

                for (sProperty in oVar) {
                    if (oVar.hasOwnProperty(sProperty)) {
                        iSize++;
                    }
                }
                return iSize;
            },

            /**
             * If the parameter is a string, then put the string in an array and give it back. Otherwise it gives back the variable.
             * @param aVar {Array|Object|String} The string or the array object.
             * @return {Array} An array itself or the array with the string value in it.
             */
            ifStringToArrayAsValue: function (aVar) {
                if (typeof aVar === "string") {
                    var sVar = aVar;
                    aVar = [];
                    aVar.push(sVar);
                }
                else if (typeof aVar !== "object") {
                    _log("error", "Invalid variable for _func.ifStringToArrayAsValue()! It got a(n) " + (typeof aVar) + " but it accept only string or an array object! The variable is: ", aVar);
                }

                return aVar;
            },

            /**
             * Check if the object properties have any of the searched text.
             * @param oHaystack {Object} The object where the text could be.
             * @param aProperties {Array|String} The properties of the object, that could have the text as content.
             * @param aNeedles {Array|String} The searched strings.
             * @param iMinLength {Number} The minimum number that the length of searched text should be.
             * @param bCaseSensitive {Boolean} If it's true, then it'll do a case sensitive search.
             * @return {boolean} Gives back true if there was at least one result, false otherwise.
             * @todo Right now it does OR search. +1 param to decide if it should do AND search instead?
             */
            isInObjectTextContent: function (oHaystack, aProperties, aNeedles, iMinLength, bCaseSensitive) {
                aProperties = this.ifStringToArrayAsValue(aProperties);
                aNeedles = this.ifStringToArrayAsValue(aNeedles);
                iMinLength = (typeof iMinLength === "undefined" ? 2 : iMinLength);
                bCaseSensitive = (typeof bCaseSensitive == "undefined" ? false : bCaseSensitive);

                var bResult = false;
                angular.forEach(aNeedles, function (sWord) {
                    if (sWord.length >= iMinLength) {
                        angular.forEach(aProperties, function (sProperty) {
                            if (oHaystack.hasOwnProperty(sProperty) || typeof sProperty === 'function') {
                                var sHayStackPropertyValue = '';
                                // Method of object.
                                if (oHaystack[sProperty] === 'function') {
                                    sHayStackPropertyValue = oHaystack[sProperty]();
                                }
                                // Function with object parameter.
                                else if (typeof sProperty === 'function') {
                                    sHayStackPropertyValue = sProperty(oHaystack);
                                }
                                // Number.
                                else if (typeof oHaystack[sProperty] === 'number') {
                                    sHayStackPropertyValue = oHaystack[sProperty].toString();
                                }
                                // String... probably.
                                else {
                                    sHayStackPropertyValue = oHaystack[sProperty];
                                }
                                if (sHayStackPropertyValue && ((bCaseSensitive && sHayStackPropertyValue.search(sWord) >= 0) || (!bCaseSensitive && sHayStackPropertyValue.toLowerCase().search(sWord.toLowerCase()) >= 0))) {
                                    bResult = true;
                                }
                            }
                            else {
                                _log("error", "Object doesn't have the property: " + sProperty + "! The object is: ", oHaystack);
                            }
                        });
                    }
                });
                return bResult;
            },

            /**
             * Find in array of objects by the id property of the iterated objects.
             * @param aoThese {Array} Array of objects.
             * @param iVal {Number} Searched value.
             * @return {Object|Null} The found object or null.
             */
            findInArrayOfObjectsById: function (aoThese, iVal) {
                return this.findInArrayOfObjectsBy(aoThese, "id", iVal);
            },

            /**
             * Find in array of objects by the given key property of the iterated objects.
             * @param aoThese {Array} Array of objects.
             * @param sProperty {String} The property of the object.
             * @param xVal {Number|String} Searched value.
             * @return {Object|Null} The found object or null.
             */
            findInArrayOfObjectsBy: function (aoThese, sProperty, xVal) {
                var oResult = null;
                angular.forEach(aoThese, function (oIsIt) {
                    if (oIsIt[sProperty] == xVal) {
                        oResult = oIsIt;
                    }
                });
                return oResult;
            },

            /**
             * Check if a key exists or not in an array.
             * @param array {Array} The array to check.
             * @param key {Number|String} The key that should exists.
             * @return {Boolean} True if it's found.
             */
            arrayKeyExists: function (array, key) {
                return (typeof array[key] !== "undefined");
            },

            /**
             * Check if the value is in array.
             * @param array {Array} The array to search in.
             * @param value {Mixed} The searched value.
             * @param bTypeCheck {Boolean} If it's true , then it does type check too.
             * @return {boolean} True if the element is in array.
             */
            isInArray: function (array, value, bTypeCheck) {
                bTypeCheck = (typeof bTypeCheck === "undefined" ? false : bTypeCheck);
                var bResult = false;
                angular.forEach(array, function (iteratedValue) {
                    if (bTypeCheck) {
                        bResult = (value === iteratedValue ? true : bResult);
                    }
                    else {
                        bResult = (value == iteratedValue ? true : bResult);
                    }
                });
                return bResult;
            },

            /**
             * Filter the given array by the condition of second function.
             * @param aList {Array} The array to filter.
             * @param funcCondition {Function} The function that'll decide if the element of array can be in results.
             * @return {Array} Element from the parameter array, which met the expectations.
             */
            filterArrayByCondition: function (aList, funcCondition) {
                var aResult = [];
                angular.forEach(aList, function (xElement) {
                    if (funcCondition(xElement)) {
                        aResult.push(xElement);
                    }
                });
                return aResult;
            },

            /**
             * Remove the an element from array by it's index key.
             * @param array {Array} The array that doesn't need the element with the index.
             * @param key {Number} The index key of the element.
             * @return {Boolean} True if it's removed.
             */
            removeFromArrayByKey: function (array, key) {
                if (key !== -1) {
                    array.splice(key, 1);
                    return true;
                }
                else {
                    return false;
                }
            },

            /**
             * Remove the given element from array.
             * @param array {Array} Array that doesn't need the element.
             * @param element {Number|String|Object} The value needs to be removed.
             * @return {Boolean} True if it's removed.
             */
            removeFromArrayByValue: function (array, element) {
                return this.removeFromArrayByKey(array, array.indexOf(element));
            },

            ///// String functions /////

            /**
             * ElemId with or without hashtag prefix.
             * @param {string} sElemId Elem id.
             * @return {string} ElemId with hashtag prefix.
             */
            elemId: function (sElemId) {
                if (typeof sElemId === 'string' && sElemId.length) {
                    if (sElemId.charAt(0) == '#') {
                        return sElemId;
                    } else {
                        return ('#' + sElemId);
                    }
                } else {
                    _log('error', 'Invalid elem id. Not string or empty.');
                }
            },

            /**
             * Remove the leading hashtag or dot from the string.
             * @param sElemSel {string} Elem selector (with maybe prefix).
             * @return {string} Elem selector.
             */
            removeElemSelector: function (sElemSel) {
                if (typeof sElemSel === 'string' && sElemSel.length) {
                    if (sElemSel.charAt(0) == '#' || sElemSel.charAt(0) == '.') {
                        return sElemSel.substring(1);
                    } else {
                        return sElemSel;
                    }
                } else {
                    _log('error', 'Invalid elem selector. Not string or empty.');
                }
            },

            /**
             * Capitalize string. The first character will be uppercase.
             * @param str {String} String needs a big first letter.
             * @return {string} String with an enormous first letter.
             */
            ucfirst: function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            },

            /**
             * The first character of string will be lowercase.
             * @param str {String} String needs a small first letter.
             * @return {String} String with tiny first letter.
             */
            lcfirst: function (str) {
                return str.charAt(0).toLowerCase() + str.slice(1);
            },

            /**
             * It adds leading zero to date (month and day) values.
             * @param iDate {Number|String} The number to extend with leading zero.
             * @param iRepeat {Number} The length of number with leading zeros. Default: 2.
             * @return {String} The value with leading zeros.
             * @todo The "0".repeat() part works only with modern browsers... do something about it if necessary.
             */
            withLeadingZero: function (iDate, iRepeat) {
                iRepeat = this.default(iRepeat, 2);
                return String("0".repeat(iRepeat) + iDate).slice(-iRepeat);
            },

            /**
             * Replace placeholders in a string. The string has to have "%varName%" in it, but the key need to be only "varName".
             * @param sText {string}
             * @param oReplace {Object}
             * @return {string}
             */
            replacePlaceholders: function (sText, oReplace) {
                angular.forEach(oReplace, function (value, key) {
                    sText = sText.replace('%' + key + '%', value);
                });

                return sText;
            },

            ///// Number /////

            /**
             * Get random float.
             * @param min {number}
             * @param max {number}
             * @return {float}
             */
            getRandomFloat: function (min, max) {
                return Math.random() * (max - min) + min;
            },

            /**
             * Get random integer.
             * @param min {number}
             * @param max {number}
             * @return {number} Integer.
             */
            getRandomInteger: function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

        }
    }]);

    /**
     * Some function to work with Ajax requests.
     */
    app.factory("_ajax", ["$rootScope", "$http", "_log", function ($rootScope, $http, _log) {
        return {

            /**
             * @type {Boolean} Decide if there is an ajax request or not. It's set by the functions of this service.
             */
            bAjaxRunning: false,

            /**
             * Check if the Ajax is running or not.
             * @return {boolean} True if there is an Ajax request running.
             */
            isAjaxRunning: function () {
                return this.bAjaxRunning;
            },

            /**
             * Get headers.
             * @param oHeaders {object}
             */
            headers: function (oHeaders) {
                var oHeadersAll = Object.assign({
                    // 'Content-Type': 'application/json',
                }, oHeaders);

                if (bHeaderAuthorization && $rootScope.sAccessToken /*&& $rootScope.sRefreshToken*/) {
                    oHeadersAll = Object.assign(oHeadersAll, {
                        'Authorization': $rootScope.sAccessToken,
                        // 'refresh_token': $rootScope.sRefreshToken
                    });
                }

                return oHeadersAll;
            },

            /**
             * Simple method to send a get ajax request to the server.
             * @param sUrl {String} Target URL.
             * @param oParams {Object} Parameters of request.
             * @param funcSuccess {Function} It'll run after the ajax request is done. The only parameter is the JSON array as result from server.
             * @param funcError {Function} It'll run after the ajax request is done, but the status isn't 200. The only parameter is the JSON array as result form the server.
             * @param oHeaders {object} Headers if needed.
             */
            get: function (sUrl, oParams, funcSuccess, funcError, oHeaders) {
                var oRequest = {
                    method: "GET",
                    url: sUrl,
                    params: oParams,
                    headers: this.headers(oHeaders)
                };
                return this.request(oRequest, funcSuccess, funcError);
            },

            /**
             * Simple method to send a post ajax request to the server.
             * @param sUrl {string} Target Url.
             * @param oData {object} Posted data. It works well only if it's in x-www-form-urlencoded format.
             * @param funcSuccess {function} It'll run after the ajax request is done. The only parameter is JSON array as result from server.
             * @param funcError {function} It'll run after the ajax request is done, but the status isn't 200. The only parameter is the JSON array as result form the server.
             * @param oHeaders {object} Headers if needed.
             */
            post: function (sUrl, oData, funcSuccess, funcError, oHeaders) {
                var oRequest = {
                    method: "POST",
                    url: sUrl,
                    data: JSON.stringify(oData),
                    headers: this.headers(oHeaders)
                };
                return this.request(oRequest, funcSuccess, funcError);
            },

            /**
             * Simple method to do the real ajax request part.
             * @param oRequest {Object} Request object.
             * @param funcSuccess {Function} It'll run after the ajax request is done. The only parameter is JSON array as result from server.
             * @param funcError {Function} It'll run after the ajax request is done, but the status isn't 200. The only parameter is the JSON array as result form the server.
             */
            request: function (oRequest, funcSuccess, funcError) {
                var oService = this;
                oService.bAjaxRunning = true;

                return $http(oRequest).then(
                    function (oResponse) { // Success
                        _log("Ajax request succeeded.\n" + oRequest.method.toUpperCase() + "=" + oRequest.url);
                        if (typeof funcSuccess === "function") {
                            funcSuccess(oResponse);
                        }
                        oService.bAjaxRunning = false;

                        return oResponse;
                    },
                    function (oResponse) { // Error
                        if (typeof funcError === "function") {
                            funcError(oResponse);
                        }
                        oService.bAjaxRunning = false;

                        return oResponse;
                    }
                );
            }

        };
    }]);

    /**
     * Create DOM elements.
     */
    app.factory("_html", ['_log', function (_log) {
        return {

            /**
             * Select one or more HTML element(s) from DOM. If the string's first character isn't a selector, then add the selector character to the string's beginning.
             * @param sel {String} The type of selector. Usually it should be "#", ".", "id" or "class". If none of these, then just simply try to select that as an element.
             * @param str {String} The id or class of HtmlElement.
             * @return {HtmlElement} The HtmlElement that was found by the given parameters.
             * @todo sel: name or attr!
             */
            find: function (str) {
                if (sel === "#" || sel === "." || sel === "id" || sel === "class") {
                    sel = (sel == "id" ? "#" : (sel == "class" ? "." : sel));

                    return angular.element((str.charAt(0) != sel) ? (sel + str) : str);
                }
                else {
                    return angular.element(sel);
                }
            },

            /**
             * It creates open/close tag of a DOM element with content between them.
             * @param sType {String} The type of HtmlElement.
             * @param oAttr {Object} Attributes of the HtmlElement.
             * @param xContent {Mixed} The content between the open and close tags. It can be string and HtmlElement object too.
             * @return {HtmlElement} Newly created HtmlElement.
             */
            create: function (sType, oAttr, xContent) {
                var oElem = angular.element(
                    "<" + sType + " " + this.objectToElementAttributes(oAttr) + ">" +
                    "</ " + sType + ">");
                if (xContent) {
                    oElem.append(xContent);
                }
                return oElem;
            },

            /**
             * Create a void DOM element. The tag is open and close in the same time. It can't have any content.
             * @param sType {String} The type of HtmlElement.
             * @param oAttr {Object} Attributes of the HtmlElement.
             * @return {HtmlElement} Newly created HtmlElement.
             */
            createVoid: function (sType, oAttr) {
                return angular.element("<" + sType + " " + this.objectToElementAttributes(oAttr) + " />");
            },

            /**
             * It converts an object into a attributes string for a HtmlElement.
             * To write angular attribute keys, put them between apostrophes or leave the dash out of it. The key ngClick will be replaced by ng-click.
             * In case of dynamically added angular attribute keys, call... $compile(eHtmlElement)($scope)
             * @param oAttr {Object} Attributes of the HtmlElement in object.
             * @return {String} Attributes of the HtmlElement in string.
             */
            objectToElementAttributes: function (oAttr) {
                var sAttr = "";
                angular.forEach(oAttr, function (sValue, sKey) {
                    if (sKey.substring(0, 2).toLowerCase() == "ng" && sKey.substring(0, 3).toLowerCase() != "ng-") {
                        sKey = "ng-" + sKey.slice(2, sKey.length);
                    }
                    sAttr += " " + sKey + "='" + sValue + "'";
                });
                return sAttr;
            },


            // Some simplified HtmlElements //

            /**
             * It crates a br (line-break) HtmlElement.
             * @return {HtmlElement} The br HtmlElement.
             */
            br: function () {
                return this.createVoid("br");
            },

            /**
             * It creates a select (drop-down) HtmlElement.
             * @param oAttr {Object} The attributes of the select.
             * @param oOptions {Object} The options of select.
             * @return {HtmlElement} The select HtmlElement.
             */
            select: function (oAttr, oOptions) {
                var oService = this;
                var oElem = oService.create("select", oAttr);
                angular.forEach(oOptions, function (sValue, sKey) {
                    oElem.append(oService.create("option", {value: sKey}, sValue));
                });
                return oElem;
            }

        };
    }]);

    /**
     * Service to draw on canvas.
     */
    app.factory("_canvas", ["_log", "_func", function (_log, _func) {
        return {

            /**
             * @var {HtmlElement} The Canvas element to work with.
             */
            eCanvas: null,

            /**
             * Set the element id of the working canvas.
             * It works only with document.getElementById().
             * @param sElementId {String} The element id.
             */
            setCanvasById: function (sElementId) {
                _log("canvas.setCanvasById(" + sElementId + ")");

                this.eCanvas = document.getElementById(sElementId.replace("#", ""));
                if (!this.isValid()) {
                    _log("error", "Element with id=" + sElementId + " wasn't found!");
                }

                this.useAsParent();
            },

            /**
             * It sets this object as parent to the children.
             */
            useAsParent: function () {
                _log("canvas.useAsParent()");

                for (var oChild in this) {
                    if (this.hasOwnProperty(oChild) && this[oChild] && typeof this[oChild] === "object") {
                        this[oChild].oParent = this;
                    }
                }
            },

            /**
             * Check if the canvas element is set.
             */
            isValid: function () {
                if (!this.eCanvas) {
                    _log("error", "No canvas element was found!");
                    return false;
                }
                return true;
            },

            /**
             * It gives back the canvas html element.
             * @return {HtmlElement} Canvas.
             */
            getCanvas: function () {
                return this.eCanvas;
            },

            /**
             * It gives back the canvas context object.
             * @return {CanvasRenderingContext2D} Rendering object of canvas.
             */
            getContext: function () {
                return (this.isValid() ? this.eCanvas.getContext("2d") : null);
            },

            /**
             * Child object of the drawing service.
             * It's specialized to draw lines.
             */
            line: {

                /**
                 * @var {Object} The parent service object. It's set the _draw.useAsParent() which is called from _draw.setElementId(string).
                 */
                oParent: null,

                /**
                 * @var {Number} The current X coordinate.
                 */
                iCoordinateX: 0,

                /**
                 * @var {Number} The current Y coordinate.
                 */
                iCoordinateY: 0,

                /**
                 * @var {Number} Width of line.
                 */
                iWidth: 1,

                /**
                 * @var {String} Color of line.
                 */
                sColor: "#000",

                /**
                 * Set the width of line.
                 * @param iWidth {Number} Line width.
                 */
                setWidth: function (iWidth) {
                    this.iWidth = iWidth;
                },

                /**
                 * Set the color of line.
                 * @param sColor {String} Line color.
                 */
                setColor: function (sColor) {
                    this.sColor = sColor;
                },

                /**
                 * Move the pointer to the given coordinates.
                 * @param iCoordinateX {Number} X coordinate.
                 * @param iCoordinateY {Number} Y coordinate.
                 */
                moveTo: function (iCoordinateX, iCoordinateY) {
                    if (this.oParent.isValid()) {
                        this.iCoordinateX = iCoordinateX;
                        this.iCoordinateY = iCoordinateY;
                    }
                },

                /**
                 * Draw a simple line by from and to coordinates.
                 * @param iCoordinateX {Number} To x coordinate.
                 * @param iCoordinateY {Number} To y coordinate.
                 * @param bStay {Boolean} [Default] If true, then the current coordinate doesn't move to the end of line.
                 */
                drawTo: function (iCoordinateX, iCoordinateY, bStay) {
                    if (this.oParent.isValid()) {
                        if (typeof bStay === "undefined") {
                            bStay = false;
                        }

                        this.getContext().beginPath();
                        this.getContext().lineWidth = this.iWidth;
                        this.getContext().strokeStyle = this.sColor;
                        this.getContext().moveTo(this.iCoordinateX, this.iCoordinateY);
                        this.getContext().lineTo(iCoordinateX, iCoordinateY);
                        this.getContext().stroke();
                        _log("Drawing line on canvas.\n(x:" + this.iCoordinateX + ", y:" + this.iCoordinateY + ")->(" + iCoordinateX + ", " + iCoordinateY + ")");

                        if (!bStay) {
                            _log("Start point of next line jumped to the end point of current line.");
                            this.iCoordinateX = iCoordinateX;
                            this.iCoordinateY = iCoordinateY;
                        }
                    }
                },

                /**
                 * It gives back the parent's canvas context object.
                 * @return {CanvasRenderingContext2D} Rendering object of canvas.
                 */
                getContext: function () {
                    return this.oParent.getContext();
                }
            }
        }
    }]);

    // Temp stuff...

    /**
     * Some commonly used google map function.
     *
     *  aCoordinate = [47, 19];
     *  aaCoordinates = [[47, 19], [48,20]];
     *  oPoint = {lat: 47, lng:19};
     *  aoPoints = [{lat:47, lng:19}, {lat:48, lng:20}];
     *  gmLatLng = google.maps.LatLng
     *  agmLatLng = [google.maps.LatLng, google.maps.LatLng]
     *  gmPolygon = google.maps.Polygon
     *  agmPolygons = [google.maps.Polygon, google.maps.Polygon]
     *  @todo Create a not project specific version of it.
     */
    app.factory("_gmap", ["_gmapConfig", function (_gmapConfig) {
        return {

            //
            // Methods to create GoogleMap objects.
            //

            /**
             * The GoogleMap object. The elementId of it has to be: "mapCanvas".
             * @TODO If necessary, create a selectMap(gmMap) function to work with multiple map objects.
             */
            gmMap: null,

            /**
             * Create GoogleMap.
             * @param sElementId {String} Html element Id. Default: "mapCanvas". It doesn't need the hashtag because it uses the basic selector of the JavaScript.
             * @return {google.maps.Map}
             */
            newMap: function (sElementId) {
                if (typeof sElementId === "undefined") {
                    sElementId = "mapCanvas";
                }
                this.gmMap = new google.maps.Map(document.getElementById(sElementId.replace("#", "")), _gmapConfig.map());

                return this.gmMap;
            },

            /**
             * Create the DrawingManager module for the map.
             * @param oParam {Object} The config object of the created polygon. Default: config of _gmap.targetBlockPart()
             * @return {google.maps.drawing.DrawingManager}
             */
            newDrawingManager: function (oParam) {
                if (typeof oParam === "undefined") {
                    oParam = _gmapConfig.targetBlockPart([], true);
                }

                var gmDrawingManager = new google.maps.drawing.DrawingManager(_gmapConfig.drawingManager(oParam));
                gmDrawingManager.setMap(this.gmMap);

                return gmDrawingManager;
            },

            /**
             * Create Block polygon.
             * @param aoPoints {Array} Array of objects with lat and lng values.
             * @param oPosition Object of jump to position values. Something like: {lat:47, lng:19, zoom:14}
             * @return {google.maps.Polygon}
             */
            newBlock: function (aoPoints, oPosition) {
                var gmBlock = new google.maps.Polygon(_gmapConfig.block(aoPoints));
                gmBlock.setMap(this.gmMap);

                if (typeof oPosition !== "undefined") {
                    this.jumpToPositionByObject(oPosition);
                }

                return gmBlock;
            },

            /**
             * Create a BlockPart polygon.
             * @param aoPoints {Array} Array of objects with lat and lng values.
             * @return {google.maps.Polygon}
             */
            newBlockPart: function (aoPoints) {
                var gmBlockPart = new google.maps.Polygon(_gmapConfig.blockPart(aoPoints));
                gmBlockPart.setMap(this.gmMap);

                return gmBlockPart;
            },

            /**
             * Create a highlighted BlockPart polygon. maybe editable, depending on second parameter.
             * @param aoPoints  {Array} Array of objects with lat and lng values.
             * @param bEdit {Boolean} Make the polygon editable.
             * @return {google.maps.Polygon}
             */
            newTargetBlockPart: function (aoPoints, bEdit) {
                var gmTargetBlockPartPolygon = new google.maps.Polygon(_gmapConfig.targetBlockPart(aoPoints, bEdit));
                gmTargetBlockPartPolygon.setMap(this.gmMap);

                return gmTargetBlockPartPolygon;
            },

            /**
             * Create Vine marker.
             * @param oPoint Object with lat and lng values.
             * @return {google.maps.Marker}
             */
            newVine: function (oPoint) {
                var gmVine = new google.maps.Marker(_gmapConfig.vine(oPoint));
                gmVine.setMap(this.gmMap);

                return gmVine;
            },


            //
            // Map methods.
            //

            /**
             * Remove selected marker, polygon or any object with setMap method from the map, if it's on it.
             * @param gmObj {Google.maps.*} Object to remove.
             */
            removeFromMap: function (gmObj) {
                if (gmObj) {
                    gmObj.setMap(null);
                }
            },

            /**
             * Jump the map to the given coordinates and to optional zoom.
             * @param fLat Latitude.
             * @param fLng Longitude.
             * @param iZoom Zoom.
             */
            jumpToPosition: function (fLat, fLng, iZoom) {
                this.gmMap.setCenter({
                    lat: fLat,
                    lng: fLng
                });
                if (typeof iZoom !== "undefined") {
                    this.gmMap.setZoom(iZoom);
                }
            },

            /**
             * Jump the map to the given position object with lat, lng and zoom values.
             * @param oPosition {Object} Something like this... {lat:47.0, lng:19.0, zoom:14}
             */
            jumpToPositionByObject: function (oPosition) {
                this.jumpToPosition(oPosition.lat, oPosition.lng, oPosition.zoom);
            },


            //
            // Points and polygon methods.
            //

            /**
             * Check if a point is in polygon.
             * @param oPoint {Object} Coordinates of the point. Something like... {lat:47, lng:19}
             * @param gmPolygon {Object} The overlay object of polygon.
             * @return {Boolean} True if in.
             */
            isPointInPolygon: function (oPoint, gmPolygon) {
                return this.isLatLngInPolygon(new google.maps.LatLng(oPoint), gmPolygon);
            },

            /**
             * Check if a LatLng object is in polygon.
             * @param gmLatLng
             * @param gmPolygon
             */
            isLatLngInPolygon: function (gmLatLng, gmPolygon) {
                return (gmLatLng ? (google.maps.geometry.poly.containsLocation(gmLatLng, gmPolygon)) : false);
            },

            /**
             * Check if a Polygon coordinates are in another polygon.
             * @param gmSmallPolygon The overlay of the polygon object.
             * @param gmBigPolygon The polygon overlay which has to have the another one.
             * @return {boolean}
             */
            isPolygonInPolygon: function (gmSmallPolygon, gmBigPolygon) {
                var oService = this;
                var bInBlock = true;
                angular.forEach(gmSmallPolygon.getPath().getArray(), function (gmLatLng) {
                    bInBlock = oService.isLatLngInPolygon(gmLatLng, gmBigPolygon) ? bInBlock : false;
                });
                return bInBlock;
            },

            /**
             * Gives back the area size of polygon.
             * @param gmPolygon {object} The polygon object. (The one that has the getGeometry() method... i guess)
             * @return {number} The size of area in hectare.
             * @todo Test it!
             */
            getAreaSizeOfPolygon: function (gmPolygon) {
                return google.maps.geometry.spherical.computeArea(gmPolygon.getGeometry().getArray()[0].getArray())
            },

            /**
             * Give back the coordinates of a polygon.
             * @param gmPolygon
             * @return {Array}
             */
            getPolygonCoordinates: function (gmPolygon) {
                var aBlockCoordinates = [];
                angular.forEach(gmPolygon.getPath().getArray(), function (gmLatLng) {
                    aBlockCoordinates.push([gmLatLng.lat(), gmLatLng.lng()]);
                });
                return aBlockCoordinates
            },

            /**
             * Gives back the stringified coordinates of a polygon.
             * @param gmPolygon Polygon overlay.
             * @return {String}
             */
            getStringifiedPolygonCoordinates: function (gmPolygon) {
                return angular.toJson(this.getPolygonCoordinates(gmPolygon));
            },

            /**
             * Sort array of GoogleMap markers into a polygon. It sort the markers by the angle from north.
             * @param agmMarkers {Array} Markers in an array. (LatLng objects)
             * @return {Array} LatLng coordinates in an array.
             * @link http://stackoverflow.com/questions/24047932/add-a-point-to-expand-polygon-without-appending-it-in-google-maps (Thx to: geocodezip)
             */
            sortMarkersToPolygon: function (agmMarkers) {
                var aResult = [];
                var gmBounds = new google.maps.LatLngBounds();

                var fBearingSort = function (a, b) {
                    return (a.bearing - b.bearing);
                };

                for (var i = 0; i < agmMarkers.length; i++) {
                    aResult.push(agmMarkers[i].getPosition());
                    gmBounds.extend(agmMarkers[i].getPosition());
                }
                for (var i = 0; i < aResult.length; i++) {
                    aResult[i].bearing = google.maps.geometry.spherical.computeHeading(gmBounds.getCenter(), aResult[i]);
                }

                aResult.sort(fBearingSort);
                return aResult;
            }
        };
    }]);

    /**
     * Give back config objects for GoogleMap items.
     */
    app.factory("_gmapConfig", [function () {
        return {

            /**
             * The map.
             * @return {Object}
             */
            map: function () {
                return {
                    zoom: 8,
                    center: {lat: 47, lng: 19.2},
                    mapTypeId: google.maps.MapTypeId.MAP,
                    streetViewControl: false
                };
            },

            /**
             * DrawingManager for polygons.
             * @param oPolygonConfig The config object of the created polygon.
             * @return {Object}
             */
            drawingManager: function (oPolygonConfig) {
                return {
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [
                            google.maps.drawing.OverlayType.POLYGON
                        ]
                    },
                    polygonOptions: oPolygonConfig
                };
            },

            /**
             * Block polygon.
             * @param aPolygonArray {Array} LatLng coordinates in an array.
             * @return {Object}
             */
            block: function (aPolygonArray) {
                return {
                    paths: aPolygonArray,
                    strokeColor: "#000",
                    strokeOpacity: 0.4,
                    strokeWeight: 2,
                    fillColor: "#000",
                    fillOpacity: 0.2
                };
            },

            /**
             * BlockPart polygon
             * @param aPolygonArray {Array} LatLng coordinates in an array.
             * @return {Object}
             */
            blockPart: function (aPolygonArray) {
                return {
                    paths: aPolygonArray,
                    strokeColor: "#000",
                    strokeOpacity: 0.2,
                    strokeWeight: 2,
                    fillColor: "#000",
                    fillOpacity: 0.1
                };
            },

            /**
             * Targeted BlockPart polygon (e.g.: selected, edited, created)
             * @param aPolygonArray {Array} LatLng coordinates in an array.
             * @param bEdit {Boolean} Decide if the polygon is editable or not.
             * @return {Object}
             */
            targetBlockPart: function (aPolygonArray, bEdit) {
                return {
                    paths: aPolygonArray,
                    strokeColor: "#a44",
                    strokeOpacity: 0.6,
                    strokeWeight: 3,
                    fillColor: "#a44",
                    fillOpacity: 0.3,
                    editable: bEdit
                };
            },

            /**
             * Vine marker.
             * @param aPosition LatLng coordinates.
             * @return {Object}
             */
            vine: function (aPosition) {
                return {
                    position: aPosition,
                    icon: {
                        url: "images/map/vine.png"
                    }
                };
            }
        };
    }]);

}