var app = angular.module('dharmaseed', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite, Persistence) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    Persistence.preload();
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('latest', {
      url: '/latest',
      views: {
        'main-content': {
          templateUrl: 'template/talk.list.html',
          controller: 'talkLatestCtrl'
        }
      },
      params: {
        filter: null
      }
    })
    .state('teacher', {
      url: '/teacher',
      views: {
        'main-content': {
          templateUrl: 'template/teacher.list.html',
          controller: 'teacherListCtrl'
        }
      }
    });

  $urlRouterProvider
    .when('/', function ($state) {
      $state.go('latest');
    })
    .otherwise("/");


});
