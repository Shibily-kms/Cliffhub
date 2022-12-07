const jwt = require('jsonwebtoken')

module.exports = {
    generateJWT: (urId, userName) => {
        return jwt.sign({ urId, userName }, process.env.TOKEN_KEY, { expiresIn: '30d' })
    }
}