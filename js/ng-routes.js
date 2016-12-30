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
        // Customer contacts
        .state('customerContact-list', {
            url: '/customer-contact/list/{id}',
            templateUrl: 'view/customerContact-list.html',
            controller: 'CustomerContactListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoCustomerContactsData: [function () {
                    console.warn('todo');
                    return [{
                        id: 1, country: 'Ireland', city: 'Dublin', address: 'Some Street 1.', phone: '+123-456789'
                    }, {
                        id: 2, country: 'Ireland', city: 'Aletown', address: 'Beer street 3.', phone: '+333-333-333'
                    }];
                }]
            }
            // resolve: {
            //     aoCustomersData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
        .state('customerContact-create', {
            url: '/customer-contact/create',
            templateUrl: 'view/customerContact-form.html',
            controller: 'CustomerContactFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oCustomerContactData: [function () {
                    return null;
                }]
            }
        })
        .state('customerContact-update', {
            url: '/customer-contact/update/{id}',
            templateUrl: 'view/customerContact-form.html',
            controller: 'CustomerContactFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oCustomerContactData: [function () {
                    console.warn('todo');
                    return {id: 666, country: 'Ireland', city: 'Dublin', address: 'Existing Street 0.', phone: '+123-456789'};
                }]
            }
            // resolve: {
            //     oCustomerData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
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
        // Partner contacts
        .state('partnerContact-list', {
            url: '/partner-contact/list/{id}',
            templateUrl: 'view/partnerContact-list.html',
            controller: 'PartnerContactListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoPartnerContactsData: [function () {
                    console.warn('todo');
                    return [{
                        id: 1, country: 'Ireland', city: 'Dublin', address: 'Some Street 1.', phone: '+123-456789'
                    }, {
                        id: 2, country: 'Ireland', city: 'Aletown', address: 'Beer street 3.', phone: '+333-333-333'
                    }];
                }]
            }
            // resolve: {
            //     aoPartnersData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
        .state('partnerContact-create', {
            url: '/partner-contact/create',
            templateUrl: 'view/partnerContact-form.html',
            controller: 'PartnerContactFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oPartnerContactData: [function () {
                    return null;
                }]
            }
        })
        .state('partnerContact-update', {
            url: '/partner-contact/update/{id}',
            templateUrl: 'view/partnerContact-form.html',
            controller: 'PartnerContactFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oPartnerContactData: [function () {
                    console.warn('todo');
                    return {id: 666, country: 'Ireland', city: 'Dublin', address: 'Existing Street 0.', phone: '+123-456789'};
                }]
            }
            // resolve: {
            //     oPartnerData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
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
        // Host Types
        .state('hostType-list', {
            url: '/host-type/list',
            templateUrl: 'view/hostType-list.html',
            controller: 'HostTypeListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoHostTypesData: [function () {
                    console.warn('todo');
                    return [{
                        id: 1, name: 'htOne', description: 'First host type'
                    }, {
                        id: 2, name: 'htTwo', description: 'Second host type'
                    }, {
                        id: 3, name: 'htThree', description: 'Third host type'
                    }]
                }]
            }
            // resolve: {
            //     aoHostsData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
        .state('hostType-create', {
            url: '/host-type/create',
            templateUrl: 'view/hostType-form.html',
            controller: 'HostTypeFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oHostTypeData: [function () {
                    return null;
                }]
            }
        })
        .state('hostType-update', {
            url: '/host-type/update/{id}',
            templateUrl: 'view/hostType-form.html',
            controller: 'HostTypeFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oHostTypeData: [function () {
                    console.warn('todo');
                    return {id: 4, name: 'htFour', description: 'Fourth hostType'};
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
