var container = require('../containerConfig');

module.exports.uploadFile = function (req, res, next) {
    res.setHeader("Content-Type", "application/json")
    res.statusCode = 201;
    res.end(JSON.stringify(pathResults));
}
