const UserModel = require('../models/user-model')
const { customId } = require('../util/customId')
const bcrypt = require('bcrypt');
const otpHelper = require('../util/otp')
const { generateJWT } = require('../util/jwt')


module.exports = {

    // User Auth Start
    checkSignUpData: async (req, res, next) => {
        try {

            let { emailId, userName } = req.body
            let email = await UserModel.findOne({ emailId: emailId })
            let name = await UserModel.findOne({ userName: userName })

            if (email) {
                res.status(400).json({ status: false, message: 'Email Id already used' })
            } else if (name) {
                res.status(400).json({ status: false, message: 'user name already used' })
            } else {
                res.status(201).json({ status: true, message: 'user data is OK' })
            }

        } catch (error) {
            res.status(400).json({ status: false, message: 'Somthing error' })
        }
    },

    // OTP
    sendOtp: async (req, res, next) => {
        try {
            let { number } = req.body
            otpHelper.dosms(number).then((response) => {
                if (response) {
                    res.status(201).json({ status: true, message: `Otp Sended to ${number}` })
                }
            }).catch((error) => {
                res.status(400).json({ status: false, message: `try agin` })
            })

        } catch (error) {
            res.status(400).json({ status: false, message: 'Something error' })
        }
    },

    verifyOtp: (req, res, next) => {
        try {
            let { mobile, otp } = req.body
            otpHelper.otpVerify(otp, mobile).then((response) => {
                if (response) {
                    res.status(201).json({ status: true, message: 'verification Success' })
                } else {
                    res.status(400).json({ status: false, message: "Incurrect OTP" })
                }
            })
        } catch (error) {
            res.status(400).json({ status: false, message: "Something error" })
        }
    },

    // Sign Up
    doSingUp: async (req, res, next) => {
        try {
            //user all data save to server. must:(firstName,lastName,userName,emailId,mobile,password) 
            let body = req.body
            body.password = await bcrypt.hash(body.password, 10)
            body.urId = customId(6, 'UR')
            UserModel.create(body).then((response) => {
                if (response) {
                    res.status(201).json({ status: true, message: 'user sign up success' })
                } else {
                    res.status(400).json({ status: false, message: 'User Sign up not completed , try now' })
                }
            })

        } catch (error) {
            res.status(400).json({ status: false, message: 'Something error' })
        }
    },

    // Forgot Password
    verifyUserNameOrEmail: async (req, res, next) => {
        try {
            let { name } = req.body  // name = userName or Email
            await UserModel.findOne({ $or: [{ userName: name }, { emailId: name }] }).then((data) => {
                if (data) {
                    res.status(201).json({ status: true, message: 'User is Available', emailId: data.emailId, mobile: data.mobile })
                } else {
                    res.status(400).json({ status: false, message: 'Invalid user name or email Id' })
                }
            })

        } catch (error) {
            res.status(400).json({ status: false, message: 'Something error' })
        }
    },

    setNewPassword: async (req, res, next) => {
        try {
            let { emailId, password } = req.body
            password = await bcrypt.hash(password, 10)
            await UserModel.updateOne({ emailId }, {
                $set: {
                    password: password
                }
            }).then((result) => {
                res.status(201).json({ status: true, message: 'password updated' })
            }).catch((error) => {
                res.status(400).json({ status: false, message: 'Check your data' })
            })

        } catch (error) {
            res.status(400).json({ status: false, message: 'Something error' })

        }
    },

    doSingIn: async (req, res) => {
        try {
            let { name, password } = req.body   // name = userName or Email
            let user = await UserModel.findOne({ $or: [{ userName: name }, { emailId: name }] })
            if (user) {
                let status = await bcrypt.compare(password, user.password);
                if (status) {
                    delete user._doc.password
                    delete user._doc._id

                    res.status(201).json({
                        user: user,
                        token: generateJWT(user.urId, user.userName),
                        status: true, message: 'Sing In Completed'
                    })
                } else {
                    res.status(400).json({ status: false, message: 'Incurrect Password' })
                }

            } else {
                res.status(400).json({ status: false, message: "Invalid User name Or Email Id" })
            }

        } catch (error) {
            res.status(400).json({ status: false, message: "Something error" })
        }
    },
    getUserData: async (req, res, next) => {
        try {

            const urId = req.user.urId
            const user = await UserModel.findOne({ urId })

            delete user._doc.password
            delete user._doc._id

            res.status(200).json({
                user: user,
                status: true,
                message: 'User full details'
            })

        } catch (error) {
            res.status(400).json({ status: false, message: "User data can't access!" })
        }
    },
}