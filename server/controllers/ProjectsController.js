var container = require('../containerConfig');
var projectsManager = container.get('projectsManager')

module.exports.getProjects = async function(req, res, next) {
    let collection = req.query.collection
    if(!collection){
        res.statusCode = 400
        res.end(JSON.stringify({error: 'collection is not defined'}))
    }
    else {
        res.setHeader("Content-Type", "application/json")
        try {
            let data = await projectsManager.getProjectsData(collection)
            res.statusCode = 200
            res.end(JSON.stringify(data))
        } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({error: e.message}))
        }
    }
}

module.exports.deleteProjects = async function (req, res, next) {
    let collection = req.query.collection
    let ids = req.query.projectIds.split(',').map(x=> x.trim())
    res.setHeader("Content-Type", "application/json")
    try{
        let result = await projectsManager.removeProjectsByIds(collection, ids)
        res.statusCode = 201
        res.end(JSON.stringify(result))
    }
    catch (e) {
        res.statusCode = 500
        res.end(JSON.stringify({error: e.message}))
    }
}

