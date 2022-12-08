const { customId } = require('../util/customId')
const PostModel = require('../models/post-model')
const UserModel = require('../models/user-model')
const { cloudinary } = require('../util/cloudinary')


module.exports = {
    doPost: async (req, res) => {
        try {
            const body = req.body     // {text}
            const file = req.file
            if (!file && !body.text) {
                return res.status(400).json({ status: false, message: 'Required fields is null' })
            }
            if (file) {
                const result = await cloudinary.uploader.upload(file.path, {
                    upload_preset: 'aqeek9mr'
                })

                body.file = {
                    format: result.format,
                    type: result.resource_type,
                    url: result.secure_url
                }
            } else {
                body.file = null
            }

            body.postId = customId(10, 'PS')
            body.createDate = new Date();
            body.urId = req.user.urId

            await PostModel.create(body).then((result) => {
                UserModel.findOne({ urId: body.urId }).then((user) => {

                    result._doc.firstName = user.firstName
                    result._doc.lastName = user.lastName
                    result._doc.userName = user.userName
                    delete result._doc._id
                    res.status(201).json({ status: true, post: result, message: 'New post added' })
                })
            }).catch((error) => {
                res.status(400).json({ status: false, message: 'posts validation failed' })
            })
        } catch (error) {
            res.status(400).json({ status: false, message: 'Unexpected Error, Choose 1 image only' })
        }
    }
}