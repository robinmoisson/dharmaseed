app.service('DBA', ['$cordovaSQLite', '$q', '$ionicPlatform', function($cordovaSQLite, $q, $ionicPlatform) {
    var self = this;

    self.query = function (query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();

        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query, parameters)
            .then(function (result) {
                q.resolve(result);
            }, function (error) {
                console.error('DBA - I found an error:', error);
                q.reject(error);
            });
        });
        return q.promise;
    };

    // Process a result set
    self.getAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
          output.push(result.rows.item(i));
        }
        return output;
    };

    // Process a single result
    self.getSingle = function(result) {
        if (result.rows.length === 0) { return null; }
        var output = angular.copy(result.rows.item(0));
        return output;
    };

    self.createDatabase = function() {
        var drops = [
            // self.query('DROP TABLE IF EXISTS Talk'),
            // self.query('DROP TABLE IF EXISTS Teacher'),
            // self.query('DROP TABLE IF EXISTS Community'),
            // self.query('DROP TABLE IF EXISTS Retreat'),
            // self.query('DROP TABLE IF EXISTS Collection'),
        ];

        var creates = [];
        $q.all(drops).then(function() {
            creates.push(self.query(
                'CREATE TABLE IF NOT EXISTS Teacher '                         +
                '( '                                                          +
                    'id INT NOT NULL PRIMARY KEY, '     +
                    'name VARCHAR(255) NOT NULL, '                            +
                    'dharma VARCHAR(255) UNIQUE, '                            +
                    'website VARCHAR(255), '                                  +
                    'donate VARCHAR(255), '                                   +
                    'description TEXT, '                                      +
                    'pictureLink VARCHAR(255), '                              +
                    'picturePath VARCHAR(255), '                              +
                    'UNIQUE (name, dharma) '                              +
                ')'
            ));
            creates.push(self.query(
                'CREATE TABLE IF NOT EXISTS Community '                        +
                '( '                                                          +
                    'id INT NOT NULL PRIMARY KEY, '     +
                    'name VARCHAR(255) NOT NULL, '                            +
                    'dharma VARCHAR(255), '                                   +
                    'UNIQUE (name, dharma) '                              +
                ')'
            ));

            creates.push(self.query(
                'CREATE TABLE IF NOT EXISTS Retreat '                         +
                '( '                                                          +
                    'id INT NOT NULL PRIMARY KEY, '     +
                    'name VARCHAR(255) NOT NULL, '                            +
                    'dharma VARCHAR(255), '                                   +
                    'UNIQUE (name, dharma) '                              +
                ')'
            ));

            creates.push(self.query(
                'CREATE TABLE IF NOT EXISTS Collection '                      +
                '( '                                                          +
                    'id INT NOT NULL PRIMARY KEY, '     +
                    'name VARCHAR(255) NOT NULL, '                            +
                    'dharma VARCHAR(255), '                                   +
                    'description TEXT, '                                      +
                    'UNIQUE (name, dharma) '                              +
                ')'
            ));

            creates.push(self.query(
                'CREATE TABLE IF NOT EXISTS Talk '                            +
                '( '                                                          +
                    'id INT NOT NULL PRIMARY KEY, '     +
                    'name VARCHAR(255) NOT NULL, '                            +
                    'description TEXT, '                                      +
                    'audioLink VARCHAR(255), '                                +
                    'dharma VARCHAR(255), '                                   +
                    'length INT, '                                            +
                    '`date` DATE, '                                           +
                    'teacherId INT, '                                         +
                    'communityId INT, '                                       +
                    'retreatId INT, '                                         +
                    'collectionId INT, '                                      +
                    'FOREIGN KEY (teacherId) REFERENCES Teacher (id), '       +
                    'FOREIGN KEY (communityId) REFERENCES Community (id), '   +
                    'FOREIGN KEY (retreatId) REFERENCES Retreat (id), '       +
                    'FOREIGN KEY (collectionId) REFERENCES Collection (id), ' +
                    'UNIQUE (name, dharma) '                              +
                '); '
            ));

        });

        $q.all(creates).then(function(){
            self.query("SELECT * FROM Talk").then(function(result){
                console.log(result);
            });
        });

        return $q.all(creates);
        var query =
            'DROP TABLE IF EXISTS Talk;'                                  +
            'DROP TABLE IF EXISTS Teacher; '                              +
            'DROP TABLE IF EXISTS Community; '                            +
            'DROP TABLE IF EXISTS Retreat; '                              +
            'DROP TABLE IF EXISTS Collection; '                           +

            'CREATE TABLE Teacher '                          +
            '( '                                                          +
                'id INT NOT NULL UNIQUE PRIMARY KEY, '     +
                'name VARCHAR(255) NOT NULL, '                            +
                'dharma VARCHAR(255) UNIQUE, '                            +
                'website VARCHAR(255), '                                  +
                'donate VARCHAR(255), '                                   +
                'description TEXT, '                                      +
                'pictureLink VARCHAR(255), '                              +
                'picturePath VARCHAR(255), '                              +
                'UNIQUE KEY (name, dharma) '                              +
            '); '                                                         +

            'CREATE TABLE Community '                        +
            '( '                                                          +
                'id INT NOT NULL UNIQUE PRIMARY KEY, '     +
                'name VARCHAR(255) NOT NULL, '                            +
                'dharma VARCHAR(255), '                                   +
                'UNIQUE KEY (name, dharma) '                              +
            '); '                                                         +

            'CREATE TABLE Retreat '                         +
            '( '                                                          +
                'id INT NOT NULL UNIQUE PRIMARY KEY, '     +
                'name VARCHAR(255) NOT NULL, '                            +
                'dharma VARCHAR(255), '                                   +
                'UNIQUE KEY (name, dharma) '                              +
            '); '                                                         +

            'CREATE TABLE Collection '                      +
            '( '                                                          +
                'id INT NOT NULL UNIQUE PRIMARY KEY, '     +
                'name VARCHAR(255) NOT NULL, '                            +
                'dharma VARCHAR(255), '                                   +
                'description TEXT, '                                      +
                'UNIQUE KEY (name, dharma) '                              +
            '); '                                                         +

            'CREATE TABLE Talk '                            +
            '( '                                                          +
                'id INT NOT NULL UNIQUE PRIMARY KEY, '     +
                'name VARCHAR(255) NOT NULL, '                            +
                'description TEXT, '                                      +
                'audioLink VARCHAR(255), '                                +
                'dharma VARCHAR(255), '                                   +
                'length INT, '                                            +
                '`date` DATE, '                                           +
                'teacherId INT, '                                         +
                'communityId INT, '                                       +
                'retreatId INT, '                                         +
                'collectionId INT, '                                      +
                'FOREIGN KEY (teacherId) REFERENCES Teacher (id), '       +
                'FOREIGN KEY (communityId) REFERENCES Community (id), '   +
                'FOREIGN KEY (retreatId) REFERENCES Retreat (id), '       +
                'FOREIGN KEY (collectionId) REFERENCES Collection (id), ' +
                'UNIQUE KEY (name, dharma) '                              +
            '); ';
    };

}]);

app.service('talkDataService', ['DBA', function(DBA) {
    var self = this;

    self.all = function() {
        return DBA.query("SELECT * FROM Talk")
            .then(function(result){
                return DBA.getAll(result);
            });
    };

    self.getById = function(talkId) {
        var parameters = [talkId];
        return DBA.query("SELECT * FROM Talk WHERE id = (?)", parameters)
            .then(function(result) {
                return DBA.getSingle(result);
            });
    };

    self.getByTeacher = function(teacher) {
        var parameters = [teacher.id];
        return DBA.query("SELECT * FROM Talk WHERE teacherId = (?)", parameters)
            .then(function(result) {
                return DBA.getAll(result);
            });
    };

    self.insert = function(talk) {
        var parameters = [
            talk['id'],
            talk['name'],
            talk['length'],
            talk.dharma,
            talk.date,
            talk['description'],
            talk.audioLink,
            talk.teacherId,
            talk.communityId,
            talk.retreatId,
            talk.collectionId
        ];
        return DBA.query(
            "INSERT OR REPLACE INTO Talk " +
            "(id, name, length, dharma, date, description, audioLink, teacherId, communityId, retreatId, collectionId) VALUES " +
            "( ?,    ?,      ?,      ?,    ?,           ?,         ?,         ?,           ?,         ?,            ?)",
            parameters
        );
    };

    self.insertMultiple = function(talks) {
        for (var i = 0; i < talks.length; i++) {
            self.insert(talks[i]);
        }
    };

    self.preload = function() {
        self.insertMultiple(talks);
    };

    var talks = [
        {
            id: 1,
            name: 'A talk on stuff',
            length: 30,
            date: '2015-03-02',
            description: 'Cool talk',
            audioLink: 'http://www.dharmaseed.org/teacher/315/talk/29093/20150828-winnie_nazarko-imsfr-the_progress_of_insight_part_3.mp3',
            teacherId: 1,
            communityId: 1,
            retreatId: 3,
            collectionId: 1,
            dharma: 'http://www.dharmaseed.org/teacher/170/talk/2215'
        },
        {
            id: 2,
            name: 'Hi talk',
            length: 30,
            date: '2015-04-02',
            description: "That's a new talk !",
            audioLink: 'http://www.dharmaseed.org/teacher/86/talk/29089/20150827-james_baraz-imcb-refinement_of_mind_part_ii.mp3',
            teacherId: 2,
            communityId: 3,
            retreatId: null,
            collectionId: null,
            dharma: 'http://www.dharmaseed.org/teacher/170/talk/2212'
        },
        {
            id: 3,
            name: 'Hello this is talk',
            length: 30,
            date: '2013-03-02',
            description: 'Yeah a talk, now that is brand new. Testy testy talk.',
            audioLink: 'http://www.dharmaseed.org/teacher/182/talk/29084/20150826-tony_bernhard-sr-meditation_supports_ethical_practice_the_heart_of_the_way.mp3',
            teacherId: 1,
            communityId: null,
            retreatId: 1,
            collectionId: 1,
            dharma: 'http://www.dharmaseed.org/teacher/210/talk/11926'
        },
    ];
}]);


app.service('teacherDataService', ['DBA', function(DBA) {
    var self = this;

    self.insert = function(teacher) {
        var parameters = [
            teacher['id'],
            teacher['name'],
            teacher.dharma,
            teacher.website,
            teacher['description'],
            teacher.donate,
            teacher.pictureLink,
            teacher.picturePath
        ];
        return DBA.query(
            "INSERT OR REPLACE INTO Teacher " +
            "(id, name, dharma, website, description, donate, pictureLink, picturePath) VALUES " +
            "( ?,    ?,      ?,       ?,           ?,      ?,           ?,           ?)",
            parameters
        );
    };

    self.insertMultiple = function(teachers) {
        for (var i = 0; i < teachers.length; i++) {
            self.insert(teachers[i]);
        }
    };

    self.preload = function() {
        self.insertMultiple(teachers);
    };

    var teachers = [
        {
            id: 1,
            name: 'Winnie Nazarko',
            website: 'http://google.com',
            donate: 'http://paypal.com',
            description: "I'm a cool teacher !",
            pictureLink: 'http://media.dharmaseed.org/uploads/photos/teacher_315_125_0.png',
            picturePath: null,
            dharma: 'http://www.dharmaseed.org/teacher/170'
        },
        {
            id: 2,
            name: 'James Baraz',
            website: 'http://xkcd.com',
            donate: 'http://paypal.com',
            description: "Buddhist monk.",
            pictureLink: null,
            picturePath: null,
            dharma: 'http://www.dharmaseed.org/teacher/182'
        },
    ];
}]);
