const jwt = require('jsonwebtoken');
const Config = require('../Config');

var generateToken = function(tokenData)
{
    return jwt.sign(tokenData,Config.Constants.data.jwtKey);
}

var checkToken = function(token,callback) 
{
    console.log(token);
 jwt.verify(token,Config.Constants.data.jwtKey,(err,data)=>
{
    console.log(err,data);
    if(err)
        callback(err);
    else
        callback(null,data);
})
}

module.exports = {
    generateToken : generateToken,
    checkToken : checkToken
}