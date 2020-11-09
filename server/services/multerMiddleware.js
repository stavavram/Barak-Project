var multer = require("multer");
var is = require("type-is");

module.exports = function(storage){
    return function(req,res,next){
        if(!is(req, ["multipart"])){
            next();
            return;
        }
        var upload = multer({storage: storage}).any();
        upload(req,res,(err)=>{
            if(err){
                res.statusCode = 400;
                res.end(`File upload failed with error: ${err.message}`);
                return;
            }
            let uploadData = {
                "body": req.body,
                "files": req.files
            }
            req.upload = uploadData;
            next();
        });
    }
}