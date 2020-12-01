const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

module.exports.MongoArchive = class MongoArchive {
    constructor(config){
        this.config = config;
        this.connect()
    }

    async connect(){
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
        return this.dbo.collection(collection).insertOne(document)
    }

    async insertDocuments(collection, documents){
        return this.dbo.collection(collection).insertMany(documents)
    }

    async updateDocument(collection, docId, document){
        let queryForUpdate = { _id: docId };
        let newDoc = { $set: document}
        return this.dbo.collection(collection).updateOne(queryForUpdate, newDoc)
    }

    async getAllDocuments(collection){
        return this.dbo.collection(collection).find({}).toArray()
    }

    async getAllCollections(){
        return this.dbo.listCollections().toArray()
    }

    async deleteCollection(collection){
        return this.dbo.collection(collection).drop()
    }

    async removeDocumentsByIds(collection, docIds){
        var myquery = { _id: { $in: docIds.map(x=> ObjectID(x)) } };
        return this.dbo.collection(collection).deleteMany(myquery)
    }

    async close() {
        return this.dbo.close();
    }
}