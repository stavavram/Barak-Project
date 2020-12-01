var jwt = require('jwt-simple');

const EXPIRATION_IN_SECONDS = 1000 * 60 * 60

module.exports.TokenHandler = class TokenHandler {
    constructor(config){
        this.config = config
    }

    async encode(payload){
        try {
            payload.exp = Date.now() + EXPIRATION_IN_SECONDS
            let secret = Buffer.from(process.env.SECRET, 'hex')
            return {
                accessToken: jwt.encode(payload, secret),
                expiration: payload.exp
            }
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }

    async decode(token){
        try {
            let secret = Buffer.from(process.env.SECRET, 'hex')
            let payload = jwt.decode(token, secret);
            if (payload.exp <= Date.now()){
                throw Error('Your token has expired')
            }
            return payload
        }
        catch(ex) {
            console.log("Error caught,", ex);
            throw ex
        }
    }
}