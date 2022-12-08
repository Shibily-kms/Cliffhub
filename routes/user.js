const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/verify-middleware')
const upload = require('../util/multer')

// Controller Link
const { checkSignUpData, sendOtp, verifyOtp, doSingUp, verifyUserNameOrEmail, setNewPassword,
    doSingIn, getUserData } = require('../controllers/auth-controller')
const { doPost } = require('../controllers/post-controller')



router.get('/', (req, res, next) => {
    res.json('server connection is OK')
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
router.get('/user-details', verifyUser, getUserData)

// Post
router.post('/post', verifyUser, upload.single('file'), doPost)

module.exports = router;