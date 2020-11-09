const MongoClient = require('mongodb').MongoClient;

module.exports.MongoArchive = class MongoArchive {
    constructor(config){
        this.config = config;
    }

    async connect(host){
        try {
            var connection = await MongoClient.connect(`mongodb://${this.config.host}`, { useNewUrlParser: true });
            this.dbo = connection.db(this.config.dbName);
            console.log("MongoClient Connection successfull.");
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async insertDocument(collection, document){
        return this.dbo.insertDocument(collection, document)
    }

    async findByQuery(collection, query){
        return this.dbo.findByQuery(collection, query)
    }

    async close() {
        return this.dbo.close();
    }
}