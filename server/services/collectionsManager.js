const MongoClient = require('mongodb').MongoClient;

module.exports.CollectionsManager = class BudgetManager {
    constructor(config, archive){
        this.config = config
        this.archive = archive

    }

    async getAllCollections(){
        try {
            return (await this.archive.getAllCollections()).map(x=> x.name)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async removeCollection(collection){
        try {
            return this.archive.deleteCollection(collection)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }
}