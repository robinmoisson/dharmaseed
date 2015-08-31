var db = null;

var app = angular.module('dharmaseed', ['ionic', 'ngCordova'])

.run(['$ionicPlatform', '$cordovaSQLite', 'DBA', 'talkDataService', 'teacherDataService', function($ionicPlatform, $cordovaSQLite, DBA, talkDataService, teacherDataService) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // open the database connection
    if(window.cordova) {
      db = $cordovaSQLite.openDB({name: 'dharmaseed.db' , bgType: 1});
    } else {
      db = window.openDatabase('dharmaseed.db' , '1.0', 'ES Database', 5 * 1024 * 1024);
    }

    DBA.createDatabase().then(function() {
      talkDataService.preload();
      teacherDataService.preload();
    });

    DBA.query("SELECT ta.*, te.id as 'teacher.id' FROM Talk as ta LEFT JOIN Teacher as te ON ta.teacherId=te.id;").then(function(result){
      joe = DBA.getAll(result);
      console.log(joe);
    });
  });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('newest', {
      url: '/newest',
      views: {
        'main-content': {
          templateUrl: 'template/talk-list.html',
          controller: 'talk'
        }
      },
      params: {
        filter: null
      }
    });

  // $urlRouterProvider
  //   .when('/', ['$state', function ($state) {
  //     $state.go('meditation');
  //   }])
  //   .otherwise("/");


}]);
