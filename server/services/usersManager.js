let RESOURCES = require("../entitiesConfig").RESOURCES
let ROLES = require("../entitiesConfig").ROLES

module.exports.UsersManager = class UsersManager {
    constructor(config, archive){
        this.config = config
        this.archive = archive
        this.resource = RESOURCES.USERS
    }

    async getAllUsers(){
        try {
            return this.archive.getAllDocuments(this.resource)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async addUser(userObj){
        try {
            let allUsers = await this.archive.getAllDocuments(this.resource)
            let userFromDB = allUsers.find(x=> x.username === userObj.username)
            if(userFromDB){
                throw Error('user already exists, please delete him first.')
            }
            return this.archive.insertDocument(this.resource, userObj)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async deleteUsers(userIds){
        try {
            let allUsers = await this.archive.getAllDocuments(this.resource)
            for(let user of allUsers){
                if(userIds.indexOf(user._id.toString()) !== -1 && user.role === ROLES.ADMIN){
                    throw Error('cannot remove user admin ! ! !')
                }
            }
            return this.archive.removeDocumentsByIds(this.resource, userIds)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }
}