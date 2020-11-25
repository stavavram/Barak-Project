var container = require('../containerConfig');
var projectsManager = container.get('projectsManager')
const csv = require("csvtojson");

module.exports.uploadFile = async function (req, res, next) {
    let file = req.files.upfile[0]
    let collection = req.query.collection
    let jsonForm = await csv({ output: "json"}).fromString(file.buffer.toString())
    res.setHeader("Content-Type", "application/json")
    try{
        await projectsManager.storeProjectData(collection, jsonForm)
        res.statusCode = 201
        res.end()
    }
    catch (e) {
        res.statusCode = 400
        res.end(JSON.stringify({error: e.message}))
    }
}