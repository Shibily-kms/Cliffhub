const express = require('express');
const router = express.Router();

const { checkSignUpData, sendOtp, verifyOtp, doSingUp, verifyUserNameOrEmail, setNewPassword,
    doSingIn, getUserData } = require('../controllers/auth-controller')
const { verifyUser } = require('../middlewares/verify-middleware')

router.get('/', (req, res, next) => {
    res.json('hello world')
});

// Sing Up And Otp
router.post('/check-signup', checkSignUpData)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.post('/sign-up', doSingUp)

//  Forgot Password
router.post('/verify-username-or-email', verifyUserNameOrEmail);
router.post('/new-password', setNewPassword);

// Sign In
router.post('/sign-in', doSingIn)
router.get('/:api/get-user', verifyUser, getUserData)

module.exports = router;