var kontainer = require('kontainer-di');

var config = require('./config/production.json');
var archive = require('./services/archive/mongoArchive').MongoArchive;
var projectsManager = require('./services/projectsManager').ProjectsManager;
var usersManager = require('./services/usersManager').UsersManager;
var tokenHandler = require('./services/auth/tokenHandler').TokenHandler;
var authenticator = require('./services/auth/authenticator').Authenticator;

kontainer.register('config', [], config);
kontainer.register('tokenHandler', ['config'], tokenHandler);
kontainer.register('archiveConfig', [], config.archive);
kontainer.register('archive', ['archiveConfig'], archive);
kontainer.register('authenticator', ['config', 'archive', 'tokenHandler'], authenticator);
kontainer.register('projectsManager', ['config', 'archive', 'authenticator'], projectsManager);
kontainer.register('usersManager', ['config', 'archive'], usersManager);

module.exports = kontainer;