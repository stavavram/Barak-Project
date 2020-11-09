var ES = require('elasticsearch');

module.exports.ElasticArchive = class ElasticArchive {
    constructor(config){
        this.config = config;
        this.client = new ES.Client({
            host: config.host
        })
    }

    async searchDocsCount(index){
        try{
            let res = await this.client.count({
                index: index
            });

            return res.count;
        }catch(err){
            console.log("error");
            throw err;
        }
    }
}