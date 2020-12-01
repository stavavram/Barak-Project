const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    DEFAULT: 'default'
}

const RESOURCES = {
    USERS: 'users',
    PROJECTS: 'projects'
}

const ACTIONS = {
    WRITE: 'write',
    READ: 'read',
    DELETE: 'delete'
}

module.exports.ROLES = ROLES
module.exports.RESOURCES = RESOURCES
module.exports.ACTIONS = ACTIONS

module.exports.getActionsList = function() {
    let actionsList = []
    for(let action in ACTIONS){
        actionsList.push(ACTIONS[action])
    }
    return actionsList
}

module.exports.getRolesList = function(){
    let rolesList = []
    for(let role in ROLES){
        if(role !== 'ADMIN') {
            rolesList.push(ROLES[role])
        }
    }
    return rolesList
}