const { responseWithError, responseREST } = require("../config/commonFunction")
const httpStatus = require("../config/httpStatus")
const Posts = require("../models/posts")


/**
 * ## Get all data of the General Setting ʲˢ
 *
 * This Function returns an Object with data key which contain all details of General Settings
 * @param
 * context -- which contains req and res object
 * @example
 * allGeneralSetting(context)
 */

const addPostInDB = async (req, res) => {
    try {

        const createPost = await Posts.create({
            title: req.body.title,
            description: req.body.description,
            created_by: req.userInfo.user_id
        })

        return responseREST(res, httpStatus.SUCCESS, "Post created successfully", createPost)
    } catch (error) {
        return responseWithError(res, res, error)
    }
}
module.exports = {
    addPostInDB
}