const UserModel = require('../models/user-model')
const jwt = require('jsonwebtoken')

module.exports = {

    verifyUser: async (req, res, next) => {
        let token

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1]
                const decoded = jwt.verify(token, process.env.TOKEN_KEY)
                const user = await UserModel.findOne({ urId: decoded.urId })
    
                if (user.status === 'Blocked') {
                    return res.status(403).json({
                        status: false, message: 'You are currently blocked for violating cleverHires Terms and conditions'
                    })
                }

                req.user = {
                    urId: decoded.urId,
                    userName: decoded.userName
                }
                next()
            } catch (error) {
                res.status(401).json({ status: false, message: 'Not authorized' })
            }
        }

        if (!token) {
            res.status(401).json({ status: false, message: 'Not authorizaton, No Token' })
        }
    }

}
