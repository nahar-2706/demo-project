const express = require('express');
const router = express.Router();
const postController = require('../controller/posts')
router.post('/add-post', postController.addPost)

module.exports = router;