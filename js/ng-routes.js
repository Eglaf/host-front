app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('authenticate', {
            url: '/authenticate',
            templateUrl: 'view/authenticate.html',
            controller: 'AuthenticateCtrl',
            controllerAs: 'ctrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'view/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oResponseData: [function () {
                    return null;
                }]
            }
        })
        // Partners
        .state('partner-list', {
            url: '/partner/list',
            templateUrl: 'view/partner-list.html',
            controller: 'PartnerListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoPartnersData: [function () {
                    console.warn('todo');
                    return [{
                        id: 1, email: 'partner1@mail.com', group: 'group1'
                    }, {
                        id: 2, email: 'partner2@mail.com', group: 'group2'
                    }, {
                        id: 3, email: 'partner3@mail.com', group: 'group3'
                    }, {
                        id: 4, email: 'partner4@mail.com', group: 'group4'
                    }, {
                        id: 5, email: 'partner5@mail.com', group: 'group5'
                    }, {
                        id: 6, email: 'partner6@mail.com', group: 'group6'
                    }, {
                        id: 7, email: 'partner7@mail.com', group: 'group7'
                    }]
                }]
            }
            // resolve: {
            //     aoPartnersData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
        .state('partner-create', {
            url: '/partner/create',
            templateUrl: 'view/partner-form.html',
            controller: 'PartnerFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oPartnerData: [function () {
                    return null;
                }]
            }
        })
        .state('partner-update', {
            url: '/partner/update/{id}',
            templateUrl: 'view/partner-form.html',
            controller: 'PartnerFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oPartnerData: [function () {
                    console.warn('todo');
                    return {id: 20, email: 'some.test@mail.com', group: 'anotherGroup'};
                }]
            }
            // resolve: {
            //     oPartnerData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
        // Customers
        .state('customer-list', {
            url: '/customer/list',
            templateUrl: 'view/customer-list.html',
            controller: 'CustomerListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoCustomersData: [function () {
                    console.warn('todo');
                    return [{
                        id: 1, email: 'customer1@mail.com', partner: 'partner1'
                    }, {
                        id: 2, email: 'customer2@mail.com', partner: 'partner1'
                    }, {
                        id: 3, email: 'customer3@mail.com', partner: 'partner2'
                    }, {
                        id: 4, email: 'customer4@mail.com', partner: 'partner2'
                    }, {
                        id: 5, email: 'customer5@mail.com', partner: 'partner3'
                    }, {
                        id: 6, email: 'customer6@mail.com', partner: 'partner4'
                    }, {
                        id: 7, email: 'customer7@mail.com', partner: 'partner5'
                    }, {
                        id: 8, email: 'customer8@mail.com', partner: 'partner6'
                    }]
                }]
            }
            // resolve: {
            //     aoCustomersData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
        .state('customer-create', {
            url: '/customer/create',
            templateUrl: 'view/customer-form.html',
            controller: 'CustomerFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oCustomerData: [function () {
                    return null;
                }]
            }
        })
        .state('customer-update', {
            url: '/customer/update/{id}',
            templateUrl: 'view/customer-form.html',
            controller: 'CustomerFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oCustomerData: [function () {
                    console.warn('todo');
                    return {id: 20, email: 'some.test@mail.com', group: 'anotherGroup'};
                }]
            }
            // resolve: {
            //     oCustomerData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
        // Hosts
        .state('host-list', {
            url: '/host/list',
            templateUrl: 'view/host-list.html',
            controller: 'HostListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoHostsData: [function () {
                    console.warn('todo');
                    return [{
                        id: 1, url: 'test1.com', ip: '127.0.0.1', customer: 'customer1'
                    }, {
                        id: 2, url: 'test2.com', ip: '127.0.0.2', customer: 'customer1'
                    }, {
                        id: 3, url: 'test3.com', ip: '127.0.0.3', customer: 'customer2'
                    }, {
                        id: 4, url: 'test4.com', ip: '127.0.0.4', customer: 'customer2'
                    }, {
                        id: 5, url: 'test5.com', ip: '127.0.0.5', customer: 'customer3'
                    }, {
                        id: 6, url: 'test6.com', ip: '127.0.0.6', customer: 'customer4'
                    }]
                }]
            }
            // resolve: {
            //     aoHostsData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
        .state('host-create', {
            url: '/host/create',
            templateUrl: 'view/host-form.html',
            controller: 'HostFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oHostData: [function () {
                    return null;
                }]
            }
        })
        .state('host-update', {
            url: '/host/update/{id}',
            templateUrl: 'view/host-form.html',
            controller: 'HostFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oHostData: [function () {
                    console.warn('todo');
                    return {id: 7, url: 'test7.com', ip: '127.0.0.255', customer: 'customer5'};
                }]
            }
            // resolve: {
            //     oHostData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
    ;

    $urlRouterProvider.otherwise('/authenticate');

});