let getActionsList = require("../../entitiesConfig").getActionsList
let RESOURCES = require("../../entitiesConfig").RESOURCES

module.exports.Authenticator = class Authenticator {
    constructor(config, archive, tokenHandler){
        this.config = config
        this.archive = archive
        this.tokenHandler = tokenHandler
    }

    async issueToken(username, password){
        try {
            let records = await this.archive.getAllDocuments(RESOURCES.USERS)
            let userDocument = records.find(x=> x.username === username && x.password === password)
            if (userDocument){
                return this.tokenHandler.encode({
                    username: userDocument.username,
                    role: userDocument.role,
                    sub: username,
                    aud: 'all',
                    iss: 'projects'
                })
            }
            throw Error('user does not exist')
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async validateToken(token){
        try {
            return this.tokenHandler.decode(token)
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async getRole(token){
        let payload = await this.validateToken(token)
        return payload.role
    }

    validateRole(role, resource, requiredActions){
        if(
            !requiredActions ||
            requiredActions.length === 0 ||
            requiredActions.filter(x => getActionsList().indexOf(x) === -1).length > 0
        ){
            throw Error('invalid required permissions')
        }
        if(this.config.allowedResources.indexOf(resource) === -1){
            throw Error('invalid resource')
        }
        let rolePermissions = this.config.roles[role][resource]
        if(!rolePermissions || requiredActions.filter(x => rolePermissions.indexOf(x) !== -1).length === 0){
            throw Error('invalid role permissions')
        }
    }
}