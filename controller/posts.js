const Joi = require("joi")
const { responseWithError, responseInvalidArgs } = require("../config/commonFunction");
const { addPostInDB } = require("../business-rule/posts");

const addPost = async (req, res) => {
    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required()
        });

        const validate = schema.validate(req.body)
        if (validate.error) {
            return responseInvalidArgs(res, validate)
        }

        return await addPostInDB(req, res)
    } catch (error) {
        return responseWithError(req, res, error)
    }
}
module.exports = {
    addPost
}