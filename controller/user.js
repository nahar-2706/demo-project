const { userRegisterInDB, loginUserInDB, imageUploadIndb, getUserDataById, getAllUserFromDB } = require("../business-rule/user")
const { responseWithError, responseInvalidArgs } = require("../config/commonFunction")
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
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
            company_name: Joi.string().min(3).max(30).required(),
        })

        const validateSchema = schema.validate(req.body)
        if (validateSchema.error) {
            return responseInvalidArgs(res, validateSchema)
        }

        return userRegisterInDB(req, res)


    } catch (error) {
        console.log(error)
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
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required()

        }).unknown(true);

        const validateSchema = schema.validate(req.body)
        if (validateSchema.error) {
            return responseInvalidArgs(res, validateSchema)
        }


        return await imageUploadIndb(req, res)

    } catch (error) {
        return responseWithError(req, res, error)
    }
}
const getUserById = async (req, res) => {
    try {
        const schema = Joi.object({
            id: Joi.objectId().required()
        })
        const validateSchema = schema.validate(req.params)
        if (validateSchema.error) {
            return responseInvalidArgs(res, validateSchema)
        }
        return getUserDataById(req, res)
    } catch (error) {
        return responseWithError(req, res, error)
    }
}
const getAllUser = async (req, res) => {
    try {
        console.log("req", req.query)
        const schema = Joi.object({
            search_text: Joi.string().allow(null, ''),
            skip: Joi.number(),
            take: Joi.number(),
        })
        const validateSchema = schema.validate(req.query)
        if (validateSchema.error) {
            return responseInvalidArgs(res, validateSchema)
        }
        return getAllUserFromDB(req, res)
    } catch (error) {
        return responseWithError(req, res, error)
    }
}
module.exports = {
    userRegister,
    loginUser,
    imageUpload,
    getUserById,
    getAllUser
}