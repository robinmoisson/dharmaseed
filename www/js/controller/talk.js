app.controller('talkNewestCtrl', function($stateParams, $scope, Persistence){
  var filter = $stateParams.filter;

  if (filter === null) {
    Persistence.Entities.Talk.all().prefetch('teacher').order('date', true).list(function(results){
      $scope.talks = results;
      $scope.$apply();
    });
  }
});
