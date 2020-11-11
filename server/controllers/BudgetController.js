var container = require('../containerConfig');
var archiveContainer = container.get('archive')
var budgetManager = container.get('budgetManager')
const csv = require("csvtojson");

module.exports.uploadFile = async function (req, res, next) {
    let file = req.files.upfile[0]
    let collection = req.query.collection
    let jsonForm = await csv({ output: "json"}).fromString(file.buffer.toString())
    await budgetManager.storeBudgetData(collection, jsonForm)
    res.setHeader("Content-Type", "application/json")
    res.statusCode = 201
    res.end()
}
