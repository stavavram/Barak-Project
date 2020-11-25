var kontainer = require('kontainer-di');

var config = require('./config/production.json');
var archive = require('./services/archive/mongoArchive').MongoArchive;
var projectsManager = require('./services/projectsManager').ProjectsManager;
var collectionsManager = require('./services/collectionsManager').CollectionsManager;

kontainer.register('config', [], config);
kontainer.register('archiveConfig', [], config.archive);
kontainer.register('archive', ['archiveConfig'], archive);
kontainer.register('projectsManager', ['config', 'archive'], projectsManager);
kontainer.register('collectionsManager', ['config', 'archive'], collectionsManager);

module.exports = kontainer;