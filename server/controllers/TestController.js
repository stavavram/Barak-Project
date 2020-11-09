var container = require('../containerConfig');

module.exports.uploadFile = function (req, res, next) {
    let pathResults = req.upload.files.map(file=> file.path);
    res.setHeader("Content-Type", "application/json")
    res.statusCode = 201;
    res.end(JSON.stringify(pathResults));
}
