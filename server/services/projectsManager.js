const MongoClient = require('mongodb').MongoClient;

module.exports.ProjectsManager = class BudgetManager {
    constructor(config, archive){
        this.config = config
        this.archive = archive
    }

    async storeProjectData(collection, budgetDataChunk){
        let documents = []
        try {
            for(let budgetRow of budgetDataChunk){
                let transformedData = this.transformData(budgetRow)
                let nullKey = this.containsNull(transformedData)
                if (nullKey){
                    throw Error(`Budget row does not contain ${nullKey} value`)
                }
                documents.push({...transformedData, ...this.enrichData()})
            }
            await this.archive.insertDocuments(collection, documents)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async getProjectsData(collection){
        try {
            return this.archive.getAllDocuments(collection)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async removeProjectsByIds(collection, ids){
        try {
            return this.archive.removeDocumentsByIds(collection, ids)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    transformData(budgetData){
        return {
            projectName: this.getTransformConfigMap('projectName', budgetData),
            projectDescription: this.getTransformConfigMap('projectDescription', budgetData),
            totalBudgetNis: this.getTransformConfigMap('totalBudgetNis', budgetData),
            totalBudgetDollar: this.getTransformConfigMap('totalBudgetDollar', budgetData),
            operationDeadline: this.getTransformConfigMap('operationDeadline', budgetData),
            nisBudgetAtRisk: this.getTransformConfigMap('nisBudgetAtRisk', budgetData),
            dollarBudgetAtRisk: this.getTransformConfigMap('dollarBudgetAtRisk', budgetData),
            personnel: this.getTransformConfigMap('personnel', budgetData),
            commitment: this.getTransformConfigMap('commitment', budgetData),
            updatedOerationDeadline: this.getTransformConfigMap('updatedOerationDeadline', budgetData),
            other: this.getTransformConfigMap('other', budgetData),
            isDigital: this.getTransformConfigMap('isDigital', budgetData),
            operationaleader: this.getTransformConfigMap('operationaleader', budgetData)
        }
    }

    getTransformConfigMap(configField, budgetData){
        let value = this.config.dataFieldsTransformers[configField].map(x => budgetData[x]).filter(x=> x)
        if (!value || value.length === 0){
            throw Error(`There is no map for field: '${configField}'`)
        }
        return value[0]
    }

    enrichData(){
        return {
            'insertTime': Date.now()
        }
    }

    containsNull(object){
        for(let key in object){
            if(object[key] === null  || object[key] === undefined){
                return key
            }
        }
    }
}