let getRolesList = require("../entitiesConfig").getRolesList
let ROLES = require("../entitiesConfig").ROLES

var container = require('../containerConfig');
var crypto = require('crypto');
var authenticator = container.get('authenticator')
var usersManager = container.get('usersManager')

module.exports.authenticate = async function (req, res, next) {
    if(!req.headers.authorization){
        res.statusCode = 401
        res.end(JSON.stringify({error: 'invalid authorization header'}))
    }
    else {
        res.setHeader("Content-Type", "application/json")
        let base64Token = req.headers.authorization.replace('Basic ', '')
        let credentials = Buffer.from(base64Token, 'base64').toString().split(':')
        let user = credentials[0]
        let hashedPass = crypto.createHash('md5').update(credentials[1]).digest('hex');
        try {
            let authData = await authenticator.issueToken(user, hashedPass)
            res.statusCode = 201
            res.end(JSON.stringify(authData))
        }
        catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({error: e.message}))
        }
    }
}

module.exports.createUser = async function (req, res, next) {
    if(!req.headers.authorization){
        res.statusCode = 401
        res.end(JSON.stringify({error: 'invalid authorization header'}))
    }
    else {
        res.setHeader("Content-Type", "application/json")
        let role = null
        try {
            role = await authenticator.getRole(req.headers.authorization)
        }
        catch (e) {
            res.statusCode = 401
            res.end(JSON.stringify({error: 'unauthorized token'}))
            return
        }
        try {
            if(role !== ROLES.ADMIN){
                throw Error('you are not authorized to perform this operation')
            }
            let userObj = req.body
            if(getRolesList().indexOf(userObj.role) === -1 || !userObj.username || !userObj.password){
                res.statusCode = 400
                res.end(JSON.stringify({error: 'invalid user object'}))
                return
            }
            userObj.password = crypto.createHash('md5').update(userObj.password).digest('hex');
            let data = await usersManager.addUser(userObj)
            res.statusCode = 201
            res.end(JSON.stringify(data))
        } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({error: e.message}))
        }
    }
}

module.exports.deleteUsers = async function (req, res, next) {
    if (!req.headers.authorization) {
        res.statusCode = 401
        res.end(JSON.stringify({error: 'invalid authorization header'}))
    } else {
        res.setHeader("Content-Type", "application/json")
        let role = null
        try {
            role = await authenticator.getRole(req.headers.authorization)
        } catch (e) {
            res.statusCode = 401
            res.end(JSON.stringify({error: 'unauthorized token'}))
            return
        }
        try {
            if (role !== ROLES.ADMIN) {
                throw Error('you are not authorized to perform this operation')
            }
            let ids = req.query.userIds.split(',').map(x => x.trim())
            let data = await usersManager.deleteUsers(ids)
            res.statusCode = 201
            res.end(JSON.stringify(data))
        } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({error: e.message}))
        }
    }
}

module.exports.getAllUsers = async function (req, res, next) {
    if(!req.headers.authorization){
        res.statusCode = 401
        res.end(JSON.stringify({error: 'invalid authorization header'}))
    }
    else {
        res.setHeader("Content-Type", "application/json")
        let role = null
        try {
            role = await authenticator.getRole(req.headers.authorization)
        }
        catch (e) {
            res.statusCode = 401
            res.end(JSON.stringify({error: 'unauthorized token'}))
            return
        }
        try {
            if(role !== ROLES.ADMIN){
                throw Error('you are not authorized to perform this operation')
            }
            let data = await usersManager.getAllUsers()
            res.statusCode = 200
            res.end(JSON.stringify(data))
        } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({error: e.message}))
        }
    }
}