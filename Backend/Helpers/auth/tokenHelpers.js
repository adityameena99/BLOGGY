const isTokenIncluded =(req) => {
   
    return (
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) ||
        (req.headers.Authorization && req.headers.Authorization.startsWith("Bearer"))
    )

}

const getAccessTokenFromHeader = (req) => {

    const authorization = req.headers.authorization || req.headers.Authorization

    if (!authorization) {
        return null;
    }

    const access_token = authorization.split(" ")[1]

    return access_token
}

const sendToken = (user,statusCode ,res)=>{

    const token = user.generateJwtFromUser()

    return res.status(statusCode).json({
        success: true ,
        token
    })

}

module.exports ={
    sendToken,
    isTokenIncluded,
    getAccessTokenFromHeader
}
