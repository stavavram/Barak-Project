var multer = require('multer');
var path = require("path")

module.exports.Storage = class Storage{
    constructor(config){
        this.config = config;
        this.filesystemConfig = config.filesystem;
    }

    getStorage(){
        return multer.diskStorage({
            destination: this.filesystemConfig.path,
            filename: (req, file, cb) => {
                cb(null, `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`)
            }
        });
    }
}