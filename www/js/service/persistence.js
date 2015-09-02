app.service('Persistence', function($q, $ionicPlatform, $cordovaSQLite){

  self = this;

  persistence.store.cordovasql.config(
    persistence,
    'dharmaseed.db',
    '1.0',                // DB version
    'Dharmaseed DB',        // DB display name
    5 * 1024 * 1024,        // DB size (WebSQL fallback only)
    0,                      // SQLitePlugin Background processing disabled
    2                       // DB location (iOS only), 0 (default): Documents (iTunes+iCloud), 1: Library (NO iTunes + iCloud), 2: Library/LocalDatabase (NO iTunes + NO iCloud)
  );

  var entities = {};

  entities.Talk = persistence.define('Talk', {
    name: 'TEXT',
    length: 'INT',
    date: 'DATE',
    description: 'TEXT',
    audioLink: 'TEXT',
    dharma: 'TEXT'
  });

  entities.Teacher = persistence.define('Teacher', {
    name: 'TEXT',
    website: 'TEXT',
    donate: 'TEXT',
    dharma: 'TEXT',
    description: 'TEXT',
    pictureLink: 'TEXT',
    picturePath: 'TEXT'
  });

  entities.Community = persistence.define('Community', {
    name: 'TEXT',
    dharma: 'TEXT'
  });

  entities.Retreat = persistence.define('Retreat', {
    name: 'TEXT',
    dharma: 'TEXT'
  });

  entities.Collection = persistence.define('Collection', {
    name: 'TEXT',
    dharma: 'TEXT'
  });

  entities.Teacher.hasMany('talks', entities.Talk, 'teacher');
  entities.Community.hasMany('talks', entities.Talk, 'community');
  entities.Retreat.hasMany('talks', entities.Talk, 'retreat');
  entities.Collection.hasMany('talks', entities.Talk, 'collection');

  entities.Talk.hasOne('teacher', entities.Teacher, 'talks');
  entities.Talk.hasOne('community', entities.Community, 'talks');
  entities.Talk.hasOne('retreat', entities.Retreat, 'talks');
  entities.Talk.hasOne('collection', entities.Collection, 'talks');

  entities.Teacher.index(['name', 'dharma'], {unique: true});
  entities.Community.index(['name', 'dharma'], {unique: true});
  entities.Retreat.index(['name', 'dharma'], {unique: true});
  entities.Collection.index(['name', 'dharma'], {unique: true});
  entities.Talk.index(['name', 'dharma'], {unique: true});

  persistence.debug = true;

  var schemaSynced = $q.defer();
  persistence.schemaSync(function() {
    schemaSynced.resolve();
  });

  self.schemaSynced = schemaSynced.promise;

  self.Entities = entities;

  self.add = function(entity) {
    var finished = $q.defer();
    persistence.add(entity);
    persistence.flush(function() {
      finished.resolve();
    });
    return finished.promise;
  };

  var preloaded = $q.defer();

  self.preload = function() {
    var promises = [];
    for (var i = 0; i < talks.length; i++) {
      var talkEntity = new self.Entities.Talk(talks[i]);
      promises.push(self.add(talkEntity));
    }
    return $q.all(promises).then(function(){
      preloaded.resolve();
    });
  };

  self.preloaded = preloaded.promise;


  /*
   * A wrapper for executing custom queries through persistence.js
   */
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    var ready = $q.defer();

    $q.all([self.schemaSynced, self.preloaded]).then(function(){
      persistence.db.conn.transaction(function(sqlt){
        sqlt.executeSql(
          query,
          parameters,
          function(result){
            q.resolve(result);
          },
          function(error){
            q.reject(error);
          }
        );
      });
    });
    return q.promise;
  };

  var teachers = [
    new self.Entities.Teacher({
      name: 'Winnie Nazarko',
      website: 'http://google.com',
      donate: 'http://paypal.com',
      description: "I'm a cool teacher !",
      pictureLink: 'http://media.dharmaseed.org/uploads/photos/teacher_315_125_0.png',
      picturePath: null,
      dharma: 'http://www.dharmaseed.org/teacher/170'
    }),
    new self.Entities.Teacher({
      name: 'James Baraz',
      website: 'http://xkcd.com',
      donate: 'http://paypal.com',
      description: "Buddhist monk.",
      pictureLink: null,
      picturePath: null,
      dharma: 'http://www.dharmaseed.org/teacher/182'
    })
  ];

  var talks = [
    {
      name: 'A talk on stuff',
      length: 30,
      date: '2015-03-02',
      description: 'Cool talk',
      audioLink: 'http://www.dharmaseed.org/teacher/315/talk/29093/20150828-winnie_nazarko-imsfr-the_progress_of_insight_part_3.mp3',
      dharma: 'http://www.dharmaseed.org/teacher/170/talk/2215',
      teacher: teachers[0]
    },
    {
      name: 'Hi talk',
      length: 30,
      date: '2015-04-02',
      description: "That's a new talk !",
      audioLink: 'http://www.dharmaseed.org/teacher/86/talk/29089/20150827-james_baraz-imcb-refinement_of_mind_part_ii.mp3',
      dharma: 'http://www.dharmaseed.org/teacher/170/talk/2212',
      teacher: teachers[1]
    },
    {
      name: 'Hello this is talk',
      length: 30,
      date: '2013-03-02',
      description: 'Yeah a talk, now that is brand new. Testy testy talk.',
      audioLink: 'http://www.dharmaseed.org/teacher/182/talk/29084/20150826-tony_bernhard-sr-meditation_supports_ethical_practice_the_heart_of_the_way.mp3',
      dharma: 'http://www.dharmaseed.org/teacher/210/talk/11926',
      teacher: teachers[0]
    },
  ];
});
