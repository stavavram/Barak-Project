var fs = require('fs')
var path = require('path')

module.exports.Resolve = function () {
    var replaceEnv = function (config) {
        for (let key in config){
            if(config[key] instanceof Object){
                config[key] = replaceEnv(config[key])
            }
            else if (typeof config[key] == 'string'){
                let expression = config[key].match(new RegExp("\\${(.*)}"))
                if (expression) {
                    let env_key = expression[1]
                    if (!process.env[env_key])
                        throw Error(`Env var: '${env_key}' does not exist`)
                    config[key] = config[key].replace(env_key, process.env[env_key]).replace('${', '').replace('}', '')
                }
            }
        }
        return config
    }

    var defaultConfigContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/default.json'), 'utf8'))
    var newConfigContent = replaceEnv(defaultConfigContent)
    fs.writeFileSync( 'config/production.json', JSON.stringify(newConfigContent) )
}