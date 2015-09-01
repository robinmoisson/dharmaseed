var app = angular.module('dharmaseed', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite, Persistence) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // Persistence.preload();
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('newest', {
      url: '/newest',
      views: {
        'main-content': {
          templateUrl: 'template/talk-list.html',
          controller: 'talkNewestCtrl'
        }
      },
      params: {
        filter: null
      }
    });

  $urlRouterProvider
    .when('/', function ($state) {
      $state.go('newest');
    })
    .otherwise("/");


});
