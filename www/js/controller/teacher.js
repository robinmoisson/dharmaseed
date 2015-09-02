app.controller('teacherListCtrl', function($stateParams, $scope, $timeout, Persistence){
  Persistence.query('SELECT te.*, COUNT(ta.id) AS talkCount FROM Teacher AS te JOIN Talk AS ta ON ta.teacher=te.id GROUP BY te.id')
    .then(function(result){
      $scope.teachers = result;
      $timeout(function(){
        $scope.$apply();
      });
    });
});
