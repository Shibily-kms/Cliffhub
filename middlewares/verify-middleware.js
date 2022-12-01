const UserModel = require('../models/user-model')


module.exports = {


    verifyUser: (req, res, next) => {
        try {
            const urId = req.params.api
            UserModel.findOne({urId:urId}).then((result)=>{
                if (result) {
                    next()
                } else {
                    res.status(400).json({ status: false,  message: 'Invalid api key' })
                }
            }).catch((error)=>{
                res.status(400).json({ status: false,  message: 'Invalid api key' })  
            })
        } catch (error) {
            res.status(400).json({ status: false,  message: 'Something error' })  
           
        }
    }

}
