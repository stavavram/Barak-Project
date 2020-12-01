let ROLES = require("../entitiesConfig").ROLES
var container = require('../containerConfig');
var projectsManager = container.get('projectsManager')
var authenticator = container.get('authenticator')


module.exports.getProjects = async function(req, res, next) {
    res.setHeader("Content-Type", "application/json")
    try {
        let data = await projectsManager.getProjectsData(ROLES.DEFAULT)
        res.statusCode = 200
        res.end(JSON.stringify(data))
    } catch (e) {
        res.statusCode = 500
        res.end(JSON.stringify({error: e.message}))
    }
}

module.exports.deleteProjects = async function (req, res, next) {
    if(!req.headers.authorization){
        res.statusCode = 401
        res.end(JSON.stringify({error: 'invalid authorization header'}))
    }
    else {
        res.setHeader("Content-Type", "application/json")

        let role = ''
        try {
            role = await authenticator.getRole(req.headers.authorization)
        }
        catch (e) {
            res.statusCode = 401
            res.end(JSON.stringify({error: 'unauthorized token'}))
            return
        }
        let ids = req.query.projectIds.split(',').map(x => x.trim())
        try {
            let result = await projectsManager.removeProjectsByIds(ids, role)
            res.statusCode = 201
            res.end(JSON.stringify(result))
        } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({error: e.message}))
        }
    }
}

