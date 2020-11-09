var kontainer = require('kontainer-di');

var config = require('./config/production.json');
var archive = require('./services/archive/mongoArchive').MongoArchive;

kontainer.register('config', [], config);
kontainer.register('archiveConfig', [], config.archive);
kontainer.register('archive', ['archiveConfig'], archive);

module.exports = kontainer;