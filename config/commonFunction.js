const { error } = require("console")
const httpStatus = require("./httpStatus")
const jwt = require('jsonwebtoken')
const responseWithError = (_, res, error = null) => {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR.statusCode).json({
        ...httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server Error",
        data: null,
        error:
            typeof error === "object" && error != null
                ? [error.error || error.message]
                : [error],
    })
}

const responseREST = (res, resHttpStatus, message, data = null, error = null) => {
    return res.status(resHttpStatus.statusCode).json({
        ...resHttpStatus,
        message: message,
        data: data,
        error: error
    })
}
const responseInvalidArgs = (res, validate) => {
    return res.status(httpStatus.INVALID_ARGUMENTS.statusCode).json({
        ...httpStatus.INVALID_ARGUMENTS,
        message: validate.error.details.map((i) => i.message).join(","),
        data: null,
        error: null
    })
}
const signJwt = async (data, secret, expireAt) => {
    let token;
    token = jwt.sign(data, secret, {
        expiresIn: expireAt
    })
    return token;
}
const verifyJwt = async (token, secret) => {
    try {
        const verifyJwtData = jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return { status: false, message: err, data: null }
            }
            return { status: true, data: decoded, message: "Token in Valid" }
        })

        if (!verifyJwtData.status) {

            if (verifyJwtData.message.toString().split(':')[1].trim() == 'jwt expired') {
                return {
                    ...httpStatus.UNAUTHORIZED,
                    message: "You are unauthorized for this request",
                    data: null,
                    error: ["Token Exprired"]
                }
            } else {
                return {
                    ...httpStatus.UNAUTHORIZED,
                    message: "You are unauthorized for this request",
                    data: null,
                    error: ["Invalid Token"]
                }
            }
        }

        return {
            ...httpStatus.SUCCESS,
            message: "success",
            data: verifyJwtData.data,
            error: []
        }
    } catch (error) {
        return {
            ...httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
            data: null,
            error: error.message
        }
    }
}

module.exports = {
    responseREST,
    responseWithError,
    signJwt,
    verifyJwt,
    responseInvalidArgs
}