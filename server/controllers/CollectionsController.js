var container = require('../containerConfig');
var collectionsManager = container.get('collectionsManager')

module.exports.getCollections = async function(req, res, next) {
    res.setHeader("Content-Type", "application/json")
    try {
        let data = await collectionsManager.getAllCollections()
        res.statusCode = 200
        res.end(JSON.stringify(data))
    } catch (e) {
        res.statusCode = 500
        res.end(JSON.stringify({error: e.message}))
    }
}

module.exports.deleteCollection = async function (req, res, next) {
    let collection = req.query.collection
    res.setHeader("Content-Type", "application/json")
    try{
        let result = await collectionsManager.removeCollection(collection)
        res.statusCode = 201
        res.end(JSON.stringify(result))
    }
    catch (e) {
        res.statusCode = 500
        res.end(JSON.stringify({error: e.message}))
    }
}

