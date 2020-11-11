var kontainer = require('kontainer-di');

var config = require('./config/production.json');
var archive = require('./services/archive/mongoArchive').MongoArchive;
var budgetManager = require('./services/budgetManager').BudgetManager;

kontainer.register('config', [], config);
kontainer.register('archiveConfig', [], config.archive);
kontainer.register('archive', ['archiveConfig'], archive);
kontainer.register('budgetManager', ['config', 'archive'], budgetManager);

module.exports = kontainer;