const CustomError = require("../../Helpers/error/CustomError")

const customErrorHandler = (err,req,res,next)=> {
   
    if (err.code == 11000) {
        let message = "Duplicate Field Value Enter";
        
        // Extract field name from error message
        if (err.keyValue) {
            const field = Object.keys(err.keyValue)[0];
            const value = err.keyValue[field];
            
            if (field === 'email') {
                message = `Email '${value}' is already registered. Please use a different email.`;
            } else if (field === 'title') {
                message = `Story title '${value}' already exists. Please choose a different title.`;
            } else {
                message = `${field} '${value}' already exists. Please choose a different value.`;
            }
        }
        
        err = new CustomError(message, 400)
    }

    if (err.name === 'SyntaxError') {

        err = new CustomError('Unexpected Sytax ', 400)
    }
    if (err.name === 'ValidationError') {

        err = new CustomError(err.message, 400)
    }

    if (err.name === "CastError") {

        err = new CustomError("Please provide a valid id  ", 400)
    }
    if (err.name === "TokenExpiredError") {

        err = new CustomError("Jwt expired  ", 401)
    }
    if (err.name === "JsonWebTokenError") {
        err = new CustomError("Jwt malformed  ", 401)

    }

    console.log("Custom Error Handler => ", err.name, err.message, err.statusCode)
  
    return res.status(err.statusCode||500)
    .json({
        success: false  ,
        error : err.message || "Server Error"
    })

}


module.exports = customErrorHandler
