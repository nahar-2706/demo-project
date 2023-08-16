const { userRegisterInDB, loginUserInDB, imageUploadIndb } = require("../business-rule/user")
const { responseWithError, responseInvalidArgs } = require("../config/commonFunction")
const Joi = require('joi')
const userRegister = async (req, res) => {
    try {

        const schema = Joi.object({
            first_name: Joi.string().min(3).max(30).required(),
            last_name: Joi.string().min(3).max(30).required(),
            email_id: Joi.string().email({
                tlds: { allow: false }
            }).required(),
            password: Joi.string()
                .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/))
                .required()
                .messages({
                    'any.required': 'Password is required',
                    'string.pattern.base': 'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character'
                }),
            confirm_password: Joi.string()
                .required()
                .valid(Joi.ref('password'))
                .label('Confirm Password')
                .messages({
                    'any.required': 'Confirm Password is required',
                    'any.only': 'Confirm Password must match Password'
                }),
        })

        const validateSchema = schema.validate(req.body)
        if (validateSchema.error) {
            return responseInvalidArgs(res, validateSchema)
        }

        return await userRegisterInDB(req, res)


    } catch (error) {
        return responseWithError(req, res, error)
    }
}
const loginUser = async (req, res) => {
    try {
        const validate = Joi.object({
            email_id: Joi.string().email({
                tlds: { allow: false }
            }).required(),
            password: Joi.string()
                .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/))
                .required()
                .messages({
                    'any.required': 'Password is required',
                    'string.pattern.base': 'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character'
                }),
        })
        const validateSchema = validate.validate(req.body)
        if (validateSchema.error) {
            return responseInvalidArgs(res, validateSchema)
        }
        return await loginUserInDB(req, res)

    } catch (error) {
        return responseWithError(req, res, error)
    }
}
const imageUpload = async (req, res) => {
    try {

        return await imageUploadIndb(req, res)

    } catch (error) {
        return responseWithError(req, res, error)
    }
}
module.exports = {
    userRegister,
    loginUser,
    imageUpload
}