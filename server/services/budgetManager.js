const MongoClient = require('mongodb').MongoClient;

module.exports.BudgetManager = class BudgetManager {
    constructor(config, archive){
        this.config = config
        this.archive = archive
        this.archive.connect()
    }

    async storeBudgetData(collection, budgetDataChunk){
        try {
            for(let budgetRow of budgetDataChunk){
                await this.archive.insertDocument(collection, {
                    ...budgetRow, ...this.enrichData()
                })
            }
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    enrichData(){
        return {
            'insertTime': Date.now()
        }
    }
}