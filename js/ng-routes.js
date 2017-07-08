app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('authenticate', {
            url: '/authenticate',
            templateUrl: 'view/authenticate.html',
            controller: 'AuthenticateCtrl',
            controllerAs: 'ctrl'
        })
        // Dashboard.
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'view/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'ctrl'
        })
        // Users list.
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
        // User form.
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
        // User reports.
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
        // PartnerGroups and partners... is it the same or not? maybe... who knows...
        .state('partnerGroups-list', {
            url: '/partner-groups/list',
            templateUrl: 'view/partnerGroups/list.html',
            controller: 'PartnerGroupsListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoPartnerGroupsData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'partners/groups/');
                }]
            }
        })
        .state('partnerGroups-create', {
            url: '/partner-groups/create',
            templateUrl: 'view/partnerGroups/form.html',
            controller: 'PartnerGroupFormCtrl',
            controllerAs: 'ctrl'
        })
        // PartnerGroups - customers
        .state('partnerGroups-customersList', {
            url: '/partner-groups/{partnerId}/customers/list',
            templateUrl: 'view/partnerGroups/customersList.html',
            controller: 'PartnerGroupCustomersListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoPartnerGroupCustomersData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'partners/' + $stateParams.partnerId  + '/groups/');
                }]
            }
        })
        .state('partnerGroups-customersForm', {
            url: '/partner-groups/{partnerId}/customers/form',
            templateUrl: 'view/partnerGroups/customersForm.html',
            controller: 'PartnerGroupCustomersFormCtrl',
            controllerAs: 'ctrl'
        })
        // Partners - contacts
        .state('partner-contacts', {
            url: '/partner/{id}/contacts/list',
            templateUrl: 'view/partners/contactsList.html',
            controller: 'PartnerContactsListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoPartnerContactsData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'partners/' + $stateParams.id  + '/contacts/');
                }]
            }
        })
        .state('partner-contactForm', {
            url: '/partner/{id}/contacts/create',
            templateUrl: 'view/partners/contactForm.html',
            controller: 'PartnerContactFormCtrl',
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
        // Hosts
        .state('hosts-list', {
            url: '/customer/{customerId}/hosts/list',
            templateUrl: 'view/hosts/list.html',
            controller: 'HostListCtrl',
            controllerAs: 'ctrl',
            resolve: {
                aoHostsData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
                    return _ajax.get(sBackendUrl + 'customer/' + $stateParams.customerId);
                }]
            }
        })
    ;

    $urlRouterProvider.otherwise('/authenticate');

});
