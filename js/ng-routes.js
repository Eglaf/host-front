app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('dashboard', {
            url: '/',
            templateUrl: 'view/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'ctrl',
            resolve: { oResponseData: [function () { return null; }] }
        })
        .state('first-list', {
            url: '/first/list',
            templateUrl: 'view/list.html',
            controller: 'FirstListCtrl',
            controllerAs: 'ctrl',
            resolve: { oResponseData: [function () { return null; }] }
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

    $urlRouterProvider.otherwise('/');

});
