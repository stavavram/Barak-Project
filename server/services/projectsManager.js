let ACTIONS = require("../entitiesConfig").ACTIONS
let RESOURCES = require("../entitiesConfig").RESOURCES

module.exports.ProjectsManager = class BudgetManager {
    constructor(config, archive, authenticator){
        this.config = config
        this.archive = archive
        this.resource = RESOURCES.PROJECTS
        this.methodsAuth = {
            'storeProjectData': [ACTIONS.WRITE],
            'getProjectsData': [ACTIONS.READ],
            'removeProjectsByIds': [ACTIONS.DELETE]
        }
        this.authenticator = authenticator
    }

    async storeProjectData(projectDataChunk, role){
        this.authenticator.validateRole(role, this.resource, this.methodsAuth[this.storeProjectData.name])
        let documentsToInsert = []
        let documentsToUpdate = []
        try {
            let allDocs = await this.getProjectsData(role)
            for(let projectRow of projectDataChunk){
                let transformedData = this.transformData(projectRow)
                let nullKey = this.containsNull(transformedData)
                if (nullKey){
                    throw Error(`Project row does not contain ${nullKey} value`)
                }
                let docFromDB = allDocs.find(x=> x.projectName === transformedData.projectName)
                if(docFromDB){
                    documentsToUpdate.push({...transformedData, ...{_id: docFromDB._id}})
                }else {
                    documentsToInsert.push({...transformedData, ...this.enrichData()})
                }
            }
            if(documentsToInsert.length > 0) {
                await this.archive.insertDocuments(this.resource, documentsToInsert)
            }
            for(let docToUpdate of documentsToUpdate){
                await this.archive.updateDocument(this.resource, docToUpdate._id, docToUpdate)
            }
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async getProjectsData(role){
        this.authenticator.validateRole(role, this.resource, this.methodsAuth[this.getProjectsData.name])
        try {
            return this.archive.getAllDocuments(this.resource)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async removeProjectsByIds(ids, role){
        this.authenticator.validateRole(role, this.resource, this.methodsAuth[this.removeProjectsByIds.name])
        try {
            return this.archive.removeDocumentsByIds(this.resource, ids)
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