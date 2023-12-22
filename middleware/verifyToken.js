const jwt = require('jsonwebtoken');
const model = require('../models/model')
const knex = require('knex');
async function verifyToken(req, res, next) {
    const Token = req.headers['authorization'];
    const apiKey = req.headers['x-api-key'];
    if (typeof Token !== 'undefined' && apiKey === 'qr6rVPANhy03oj6E1jfSvHud4UhTFjlD') {
        const token = Token.split(' ')
        const bearerToken = token[1]
        const dataUser = jwt.decode(bearerToken)
        // const user = await model.findById('users', dataUser.user.id)
        const user = await model.db
            .select(['users.id', 'users.name', 'users.email', 'users.username', 'users.role', 'permissions.*'])
            .from('users')
            .leftJoin('permissions', 'users.id', 'permissions.user_id')
            .where({ 'users.id': dataUser.user.id })
        if (user.length === 0) {
            return res.status(404).send('User not found')
        }
        req.user = user[0]
        next()
    } else {
        return res.status(403).send("not authorized")
    }
}

module.exports = verifyToken;