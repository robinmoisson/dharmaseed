var talkControllers = angular.module('talkControllers', []);

talkControllers.controller('talkNewestCtrl', ['$params', '$scope', 'DBA', function($params, $scope, DBA){
    var filter = $params.filter;

    if (filter === false) {
        var talks = [];
        DBA.query('SELECT ta.*, te.* FROM Talk as ta LEFT JOIN Teacher te ON ta.teacherId=te.id ORDER BY ta.date DESC;')
            .then(function(result) {
                talks = DBA.getAll(result);
            });

        $scope.talks = talks;
    }
}]);
