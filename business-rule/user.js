const { responseWithError, responseREST } = require("../config/commonFunction");
const httpStatus = require("../config/httpStatus");
const Users = require("../models/user")
const bcrypt = require('bcrypt');
const UserSession = require("../models/userSession");
const { createToken } = require("./authFunctions");
const fs = require('fs');
const mongoose = require('mongoose');
const Posts = require("../models/posts");
const db = require("../config/dbConnection");
const userRegisterInDB = async (req, res) => {
    try {
        // check if email id already exist in db;

        const {
            email_id,
            first_name,
            last_name,
            password,
            company_name
        } = req.body;

        const checkUserExist = await Users.findOne({
            email_id
        })
        if (checkUserExist) {
            return responseREST(
                res,
                httpStatus.ALREADY_EXIST,
                "This User Already Exist"
            )
        }

        // hash the password 

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // create user in db

        const userData = await Users.create({
            first_name,
            last_name,
            password: hashedPassword,
            company_name,
            email_id
        })

        const createSession = await createSessionInDB(req, res, userData.user_id)
        if (!createSession.status) {
            return createSession;
        }

        // create token
        const getAccessToken = await createToken(
            req,
            userData,
            createSession.data.session_id
        )

        if (!getAccessToken.status) {
            return responseREST(
                res,
                httpStatus.INTERNAL_SERVER_ERROR,
                'Internal Server Error',
                null,
                ['Could not create Token']
            )
        }
        // update session
        await saveToken(
            req,
            res,
            getAccessToken.data
        )
        // // ctreate db for this user
        // if (mongoose.connection.readyState === 1) {
        //     mongoose.connection.close();
        // }

        const createDB = await createUserDB(req, res, userData.user_id)
        console.log(createDB)
        if (!createDB.status) {
            return responseWithError(req, res, createDB.error)
        }

        let dataToreturn = {
            access_token: getAccessToken.data.access_token,
            user_id: userData.user_id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email_id: userData.email_id

        }

        // user registered Success
        return responseREST(
            res,
            httpStatus.SUCCESS,
            "User Registered Successfully..",
            dataToreturn
        )

    } catch (error) {
        return responseWithError(req, res, error)
    }
}
const createUserDB = async (req, res, userId) => {
    try {

        let dbName = req.body.company_name.replace(" ", "_").toLowerCase()
        dbName = `${dbName}-${userId}`;
        // Create a new user-specific database
        const userDb = mongoose.createConnection(`mongodb://127.0.0.1:27017/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Define and export schemas specific to this tenant's database
        const userSchema = new mongoose.Schema({
            version_name: String,
            version: String

        });

        const Version = userDb.model('Version', userSchema);

        await Version.create({
            version: "titlw111",
            version_name: "versionNamemkoert"
        })
        return {
            status: true,
            data: null
        };
    } catch (error) {
        return {
            status: false,
            error
        }
    }


}
const createSessionInDB = async (req, res, userId) => {
    try {
        const addSession = await UserSession.create({
            user_id: userId
        })
        return {
            status: true,
            data: addSession
        }
    } catch (error) {
        return responseWithError(req, res, error)
    }
}

const saveToken = async (req, res, data) => {
    try {
        const updateData = await UserSession.findOneAndUpdate(
            { session_id: data.session_id },
            {
                access_token: data.access_token,
                login_at: new Date()
            },
            {
                new: true
            }
        )

        return {
            status: true,
            data: updateData
        }
    } catch (error) {
        return responseWithError(req, res, error)
    }
}

const loginUserInDB = async (req, res) => {
    try {
        const { email_id, password } = req.body;
        const checkUserExist = await Users.findOne({
            email_id
        })
        if (!checkUserExist) {
            return responseREST(
                res,
                httpStatus.NOT_FOUND,
                "Invalid Email Or Password"
            )
        }
        const checkPassword = await bcrypt.compare(
            password,
            checkUserExist.password
        )
        if (!checkPassword) {
            return responseREST(
                res,
                httpStatus.NOT_FOUND,
                "Invalid Email Or Password"
            )
        }

        const createSession = await createSessionInDB(
            req,
            res,
            checkUserExist.user_id
        )
        if (!createSession.status) {
            return createSession;
        }

        // create token
        const getAccessToken = await createToken(
            req,
            checkUserExist,
            createSession.data.session_id
        )
        if (!getAccessToken.status) {
            return responseREST(
                res,
                httpStatus.INTERNAL_SERVER_ERROR,
                'Internal Server Error',
                null,
                ['Could not create Token']
            )
        }
        // update session
        await saveToken(
            req,
            res,
            getAccessToken.data
        )

        let dataToreturn = {
            access_token: getAccessToken.data.access_token,
            user_id: checkUserExist.user_id,
            first_name: checkUserExist.first_name,
            last_name: checkUserExist.last_name,
            email_id: checkUserExist.email_id

        }
        return responseREST(
            res,
            httpStatus.SUCCESS,
            "User Login Successfully..",
            dataToreturn
        )

    } catch (error) {
        return responseWithError(req, res, error)
    }
}
const imageUploadIndb = async (req, res) => {
    try {
        // upload file in folder

        const { path } = req.file;

        // find user and update profile image
        const getUser = await Users.findOne({
            user_id: req.userInfo.user_id
        })

        fs.unlinkSync(getUser.profile_image)

        const updateImage = await Users.findOneAndUpdate(
            { user_id: req.userInfo.user_id },
            {
                profile_image: path
            },
            {
                new: true
            }
        )
        return responseREST(
            res,
            httpStatus.SUCCESS,
            "Image Uploaded Successfully..",
            updateImage
        )
    } catch (error) {
        return responseWithError(req, res, error)
    }
}
const getUserDataById = async (req, res) => {
    try {
        let data = await Users.findOne({
            user_id: req.params.id
        })
        return responseREST(
            res,
            httpStatus.SUCCESS,
            "User Data",
            data
        )
    } catch (error) {
        return responseWithError(req, res, error)
    }
}
const getAllUserFromDB = async (req, res) => {
    try {
        let condition = "";
        if (req.query.search_text && req.query.search_text !== "") {
            condition =
            {
                // $or: [
                //     { first_name: { $regex: req.query.search_text, $options: 'i' } },
                //     { last_name: { $regex: req.query.search_text, $options: 'i' } },
                //     { email_id: { $regex: req.query.search_text, $options: 'i' } },
                //     { company_name: { $regex: req.query.search_text, $options: 'i' } },
                // ]
                first_name: {
                    $regex: req.query.search_text,
                    options: 'i'
                }
            }
        }


        let data = await Users.find({
            first_name: {
                $regex: req.query.search_text,
                $options: 'i'
            }
        })
            .skip(parseInt(req.query.skip))
            .limit(parseInt(req.query.take))
        return responseREST(
            res,
            httpStatus.SUCCESS,
            "User Data",
            data
        )

    } catch (error) {
        return responseWithError(req, res, error)
    }
}
module.exports = {
    userRegisterInDB,
    loginUserInDB,
    imageUploadIndb,
    getUserDataById,
    getAllUserFromDB
}