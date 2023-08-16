module.exports = {
    SUCCESS: {
        status: true,
        statusCode: 200
    },
    NOT_FOUND: {
        status: false,
        statusCode: 404
    },
    NOT_SUCCESS: {
        status: false,
        statusCode: 422
    },
    UNAUTHORIZED: {
        status: false,
        statusCode: 401
    },
    INTERNAL_SERVER_ERROR: {
        status: false,
        statusCode: 500
    },
    INVALID_ARGUMENTS: {
        status: false,
        statusCode: 422
    },
    ALREADY_EXIST: {
        status: false,
        statusCode: 409
    }
}
