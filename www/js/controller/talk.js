app.controller('talkLatestCtrl', function($stateParams, $scope, Persistence){
  var filter = $stateParams.filter;

  if (filter === null) {
    Persistence.Entities.Talk.all().prefetch('teacher').order('date', false).list(function(results){
      $scope.talks = results;
      $scope.$apply();
    });
  }
});
