const { verifyUser } = require("../business-rule/authFunctions");
const { responseWithError, responseREST } = require("../config/commonFunction");
const httpStatus = require("../config/httpStatus");

const verifyUserData = async (req, res, next) => {
    try {
        let access_token;
        if (req.headers.hasOwnProperty('authorization')) {
            access_token = req.headers.authorization.replace('Bearer ', '');
        }
        if (!access_token ||
            access_token == 'undefined' ||
            access_token == undefined
        ) {
            return responseREST(
                res,
                httpStatus.UNAUTHORIZED,
                "You are unauthorized for this request..",
                null,
                null
            )
        }
        const verifyUserToken = await verifyUser({
            access_token
        })
        // console.log(verifyUserToken)
        if (!verifyUserToken.status) {
            // return res.status(verifyUserToken.statusCode || 401).json(verifyUserToken)
            return responseREST(
                res,
                { status: false, statusCode: verifyUserToken.statusCode || 401 },
                verifyUserToken.message,
                null,
                verifyUserToken.error
            )
        }

        req.userInfo = verifyUserToken.data

        next();
    } catch (error) {
        return responseWithError(req, res, error)
    }
}
module.exports = {
    verifyUserData
}