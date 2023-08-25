const express = require('express');
const router = express.Router();
const postController = require('../controller/posts')
const userController = require('../controller/user')
router.post('/add-post', postController.addPost)
router.get('/getUserById/:id', userController.getUserById)
router.get('/getUserById/:id', userController.getUserById)
router.get('/get-all-user', userController.getAllUser)


module.exports = router;