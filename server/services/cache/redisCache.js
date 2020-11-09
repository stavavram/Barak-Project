var Redis = require('ioredis');

module.exports.RedisCache = class RedisCache {
    constructor(config){
        this.config = config;
        this.client = new Redis({
            port: this.config.cache.port,
            host: this.config.cache.host
        });
    }

    async setValueByKey(key, value, ttl = 10000){
        await this.client.set(key,value);
    }

    async getValueByKey(key){
        let res = await this.client.get(key,value);
        return res;
    }
}