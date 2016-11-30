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
            resolve: { oResponseData: [function () { return null; }] }
        })
        .state('first-table', {
            url: '/first/table',
            templateUrl: 'view/table.html',
            controller: 'FirstTableCtrl',
            controllerAs: 'ctrl',
            resolve: { aoTableContent: [function () { return null; }] }
            // resolve: {
            //     oResponseData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        })
        .state('first-create', {
            url: '/first/create',
            templateUrl: 'view/form.html',
            controller: 'FirstCreateCtrl',
            controllerAs: 'ctrl',
            resolve: { oResponseData: [function () { return null; }] }
        })
        .state('first-update', {
            url: '/first/update/{id}',
            templateUrl: 'view/form.html',
            controller: 'FirstUpdateCtrl',
            controllerAs: 'ctrl',
            resolve: { oResponseData: [function () { return null; }] }
            // resolve: {
            //     oResponseData: ['$stateParams', '_ajax', function ($stateParams, _ajax) {
            //         return _ajax.get('http://tp/back/index.php?ctrl=subscriber&action=load&id=' + $stateParams.id);
            //     }]
            // }
        });

    $urlRouterProvider.otherwise('/authenticate');

});
