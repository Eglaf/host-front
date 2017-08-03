app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        // Auth
        .state('authenticate', {
            url: '/authenticate',
            templateUrl: 'view/authenticate.html',
            controller: 'AuthenticateCtrl',
            controllerAs: 'ctrl'
        })
        // Dashboard
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'view/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'ctrl'
        })
        // Users list
        .state('users-list', {
            url: '/user/list',
            templateUrl: 'view/users/list.html',
            controller: 'UsersListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoUsersData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'users/');
                }]
            }
        })
        // User form
        .state('users-password-form', {
            url: '/user/{userId}/password-change',
            templateUrl: 'view/users/passwordForm.html',
            controller: 'UserPasswordFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oUserData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'users/' + $stateParams.userId + '/settings/');
                }]
            }
        })
        // User-report list
        .state('userReports-list', {
            url: '/user-reports/list',
            templateUrl: 'view/userReports/list.html',
            controller: 'UserReportsListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoUsersData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'users/settings/');
                }]
            }
        })
        // User-report form
        .state('usersReports-flagForm', {
            url: '/user-reports/{userId}/flag-form',
            templateUrl: 'view/userReports/flagForm.html',
            controller: 'UserReportsFlagFormCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oUserData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'users/' + $stateParams.userId + '/settings/');
                }]
            }
        })

        /*********************
         * Partners
         *********************/


        // Partner list
        .state('partners-list', {
            url: '/partners/list',
            templateUrl: 'view/partners/list.html',
            controller: 'PartnersListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oSourceData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'partners/groups/');
                }]
            }
        })
        // partner form
        .state('partners-create', {
            url: '/partners/create',
            templateUrl: 'view/partners/form.html',
            controller: 'PartnersFormCtrl',
            controllerAs: 'ctrl'
        })


        // Partner/contact list
        .state('partners-contactsList', {
            url: '/partners/{id}/contacts/list',
            templateUrl: 'view/partners/contactsList.html',
            controller: 'PartnersContactsListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oSourceData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'partners/' + $stateParams.id  + '/contacts/');
                }]
            }
        })
        // Partner/contact form
        .state('partners-contactsForm', {
            url: '/partners/{id}/contacts/create',
            templateUrl: 'view/partners/contactsForm.html',
            controller: 'PartnersContactsFormCtrl',
            controllerAs: 'ctrl'
        })


        // Partner/customer list
        .state('partners-customersList', {
            url: '/partners/{partnerId}/customers/list',
            templateUrl: 'view/partners/customersList.html',
            controller: 'PartnersCustomersListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oSourceData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'partners/' + $stateParams.partnerId  + '/groups/');
                }]
            }
        })
        // Partner/customer create
        .state('partners-customersForm', {
            url: '/partners/{partnerId}/customers/form',
            templateUrl: 'view/partners/customersForm.html',
            controller: 'PartnersCustomersFormCtrl',
            controllerAs: 'ctrl'
        })


        // Partners/customers/contacts list
        .state('partners-customers-contactsList', {
            url: '/partners/{partnerId}/customers/{customerId}/contacts/list',
            templateUrl: 'view/partners/customersContacts/list.html',
            controller: 'PartnersCustomersContactsListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oSourceData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'customers/' + $stateParams.customerId  + '/contacts/');
                }]
            }
        })
        // Partners/customers/contacts create
        .state('partners-customers-contactsForm', {
            url: '/partners/{partnerId}/customers/{customerId}/contacts/create',
            templateUrl: 'view/partners/customersContacts/form.html',
            controller: 'PartnersCustomersContactsFormCtrl',
            controllerAs: 'ctrl'
        })

        // Partners/customers/hosts list
        .state('partners-customers-hostsList', {
            url: '/partners/{partnerId}/customers/{customerId}/hosts/list',
            templateUrl: 'view/partners/customersHosts/list.html',
            controller: 'PartnersCustomersHostsListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                oSourceData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'customer/' + $stateParams.customerId + '/');
                }]
            }
        })
        // Partners/customers/hosts create
        .state('partners-customers-hostsForm', {
            url: '/partners/{partnerId}/customers/{customerId}/hosts/create',
            templateUrl: 'view/partners/customersHosts/form.html',
            controller: 'PartnersCustomersHostsFormCtrl',
            controllerAs: 'ctrl'
        })




        // Host types
        .state('hostTypes-list', {
            url: '/host-types/list',
            templateUrl: 'view/hostTypes/list.html',
            controller: 'HostTypeListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoHostTypesData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'hosttypes/');
                }]
            }
        })
        .state('hostTypes-create', {
            url: '/host-types/create',
            templateUrl: 'view/hostTypes/form.html',
            controller: 'HostTypeFormCtrl',
            controllerAs: 'ctrl'
        })


    ;

    $urlRouterProvider.otherwise('/authenticate');

});
