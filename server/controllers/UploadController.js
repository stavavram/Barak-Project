var container = require('../containerConfig');
var projectsManager = container.get('projectsManager')
var authenticator = container.get('authenticator')
const csv = require("csvtojson");

module.exports.uploadFile = async function (req, res, next) {
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
        let file = req.files.upfile[0]
        let jsonForm = await csv({output: "json"}).fromString(file.buffer.toString())
        try {
            await projectsManager.storeProjectData(jsonForm, role)
            res.statusCode = 201
            res.end()
        } catch (e) {
            res.statusCode = 400
            res.end(JSON.stringify({error: e.message}))
        }
    }
}