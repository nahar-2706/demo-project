const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

const { verifyUserData } = require('../middleware/checkToken');
const upload = require('../config/imageUpload');

router.post('/user-register', userController.userRegister)
router.post('/login', userController.loginUser)
router.use(verifyUserData)
router.post('/image-upload', upload.single('file'), userController.imageUpload)

router.use('/user', require('./users'))

module.exports = router;