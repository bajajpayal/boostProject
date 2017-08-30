/*
 * @file: universalfunctions.js-Utils
 * @description: common functions that can be used throughout the code
 * @date: 2-May-2017
 * @author: Nidhi
 * */

var Models = require('../Models');
var md5 = require('md5');
//var Utils = require('./mailer');
//var transporter = Utils.transporter;
var async = require('async');
var messages = require('./responses');
var jwt = require('jsonwebtoken');

const validator  = require('validator');
const bcrypt = require('bcrypt');
//var Configs = require('../Configs');
//var path = require('path');
//var fs = require('fs');
//var moment = require('moment');
//var thumbler = require('video-thumb');


const saltRounds = 10;

module.exports = {

    failActionFunction: function(request, reply, source, error) { // to modify the payload error messages

        var customErrorMessage = '';
        if (error.output.payload.message.indexOf("[") > -1) {
            customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
        } else {
            customErrorMessage = error.output.payload.message;
        }
        customErrorMessage = customErrorMessage.replace(/"/g, '');
        customErrorMessage = customErrorMessage.replace('[', '');
        customErrorMessage = customErrorMessage.replace(']', '');
        error.output.payload.message = customErrorMessage;
        delete error.output.payload.validation
        return reply(error);
    },
    date_filters: function(request, reply) { // validate date of birth is not future date

        if (request.payload.date_of_birth && request.payload.date_of_birth != "") { // check only when user enters date of birth

            var currentDate = moment();
            var newdate = currentDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

            var dob = moment(request.payload.date_of_birth)
            dob.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

            if (dob.isAfter(newdate, 'day')) { // dob is greater than current date
                reply(messages.dateRangeError).takeover();
            } else if (dob.isSame(newdate, 'day')) { // dob is same as current date
                reply(messages.dateRangeError).takeover();
            } else {
                reply(true);
            }
        } else {
            reply(true);
        }

    },
    uploadDocuments: function(data, type, cb) { // upload images(users, accessories etc)

        var time = new Date().getTime();
        var randnum = Math.floor(Math.random() * 1000000000)
        var obj = {}
        var name, imagepath

        if (type == 'user') {
            name = data.hapi.filename;
        } else if (type == 'video') {
            name = data.hapi.filename;
        }

        var ext = name.split('.')
        var count = ext.length;
        var extension = ext[count - 1];

        if (type == 'user') { // save user images
            var filename = "user" + time + '_' + randnum + "." + extension;
            var dest = path.join('./Assets/Users', filename)

        } else if (type == 'video') { // save user images

            if (data.video_filename)
                var filename = data.video_filename;
            else
                var filename = "video" + time + '_' + randnum + "." + extension;
            var dest = path.join('./Assets/Video', filename)
          
        }

        fs.writeFile(dest, data['_data'], function(err) { // write the stream to file at a dest(path where to be stored)
            if (err) {
                console.log(err)
                cb(messages.fileWriteError)
            } else {
                obj.imagename = filename;
                obj.original_name = data.hapi.filename ? data.hapi.filename : data.hapi.filename;
                cb(null, obj)
            }
        });
    },
    encryptpassword: function(request) { // encrypt the password
        return md5(request);
    },
    require_login: function(request, reply) { // validate the given token
        var token = request.headers['x-logintoken'];
        async.waterfall([
            function(cb) {
                jwt.verify(token, Configs.config.data.jwtkey, function(err, decode) { // checking token expiry
                    if (err) {
                        console.log("error..", err)
                        cb(messages.tokenExpired)
                    } else {
                        cb(null, decode);
                    }
                })
            },
            function(decodedata, cb) {
                Models.users.User.findOne({ login_token: token }, function(err, res) { // verifying token and respective userid existence in db
                    if (err) {
                        cb(messages.systemError)
                    } else {
                        if (!res) {
                            console.log("here....")
                            cb(messages.tokenExpired);
                        } else {
                            console.log("successfully proceed no error...")
                            cb(null, { data: res })
                        }
                    }
                })
            }
        ], function(err, result) {
            if (err) {
                reply(err).takeover();
            } else {
                reply(result);
            }

        })
    },
    capitalizeFirstLetter: function(string) { // capitalize the first letter of the string
        var firstname;
        var secondname;
        var name = string.split(' ')

        if (name.length > 1) { // first name and second name both
            var username = "";
            for (var i = 0; i < name.length; i++) {
                //console.log('name',name[0])
                firstname = name[i].charAt(0).toUpperCase() + name[i].slice(1);
                if (i != 0) {
                    username = username + ' ' + firstname;
                } else {
                    username = firstname;
                }
            }
            return username
        } else if (name.length == 1) { // only first name
            firstname = name[0].charAt(0).toUpperCase() + name[0].slice(1);
            username = firstname;
            return username
        }
    },
    send_email: function(request, cb) {
        var Attachments = [];
        if (request.attachments) {
            Attachments = request.attachments
        }
        var mailOptions = {
            from: request.from, // sender address
            to: request.to, // list of receivers
            subject: request.subject, // Subject line
            text: '', // plaintext body
            attachments: Attachments,
            html: request.html // html body
        };
        transporter.sendMail(mailOptions, function(error, info) { // send mail with defined transport object
            cb(error, info)
        });
    },
    check_email_exist: function(request, callback) { // check if any given email is already registered with us
        Models.users.find({ email: request }, function(err, res) {
            callback(err, res);
        });
    },
    check_login_token_and_userid_exist: function(request, callback) { // check login token and user id exists in the db
        Models.users.User.find(request, function(err, res) {
            callback(err, res);
        });
    },
    check_email_password: function(request, callback) { // check if given email and password match
        Models.users.findOne({ email: request.email, password: request.password }, function(err, res) {
            callback(err, res);
        });
    },
    convert_base64_to_image: function(image, type, callback) {

        var time = new Date().getTime()
        var randnum = Math.floor(Math.random() * 1000000000)
        var filename = "user" + time + "_num_" + randnum + "." + type;
        var dest = path.join('./Assets/Users', filename)

        var imageBuffer = new Buffer(image, 'base64');
        fs.writeFile(dest, imageBuffer, function(err, res) {
            if (err) {
                console.log("inside error/.....")
                console.log(err)
                callback(err, null)
            } else {
                console.log("inside success")
                var obj = {
                    name: filename
                }
                callback(null, obj)
            }
        });
    },
    check_secondaryEmail_token_exist: function(request, callback) {
        Models.users.User.find({ secondaryEmail_verify_token: request }, function(err, res) {
            callback(err, res);
        });
    },
    check_Email_token_exist: function(request, callback) {
        Models.users.User.find({ email_verify_token: request }, function(err, res) {
            callback(err, res);
        });
    },
    secondaryEmailTokenValidation: function(request, reply) { // check if secondaryEmail_verify_token is valid and exists in db
        async.waterfall([
            function(cb) {
                Models.users.User.findOne({ secondaryEmail_verify_token: request.payload.token }).lean().exec(function(err, res) {
                    if (err)
                        cb(err);
                    else {
                        if (res)
                            cb(null, res);
                        else {
                            cb(messages.linkExpired);
                        }
                    }
                });
            },
            function(data, cb) {
                jwt.verify(request.payload.token, Configs.config.data.jwtkey, { algorithms: [Configs.config.data.jwtAlgo] }, function(err, res) {
                    if (err) {
                        cb(messages.linkExpired);
                    } else {
                        cb(null, res);
                    }
                });
            }
        ], function(err, result) {
            if (err)
                reply(err).takeover();
            else
                reply(result);
        });
    },
    registeredEmailCheck: function(request, reply) {
        async.waterfall([
            function(cb) {
                Models.users.User.findOne({ email_verify_token: request.payload.token }).lean().exec(function(err, res) {
                    if (err)
                        cb(err);
                    else {
                        if (res)
                            cb(null, res);
                        else {
                            cb(messages.linkExpired);
                        }
                    }
                });
            },
            function(data, cb) {
                jwt.verify(request.payload.token, Configs.config.data.jwtkey, { algorithms: [Configs.config.data.jwtAlgo] }, function(err, res) {
                    if (err) {
                        cb(messages.linkExpired);
                    } else {
                        cb(null, res);
                    }
                });
            }
        ], function(err, result) {
            if (err)
                reply(err).takeover();
            else
                reply(result);
        });
    },
    validateVideo: function(request, reply) { // validae the size and type of video
        var video_type = request.payload.video.hapi.headers['content-type']

        var extension = video_type.split("/")

        var validExtensions = ["mp4", "mpeg", "mov", "avi", "wmv", "flv"]

        if (extension[1].toString() == "mp4" || extension[1].toString() == "mpeg" || extension[1].toString() == "mov" || extension[1].toString() == "avi" || extension[1].toString() == "wmv" || extension[1].toString() == "flv") { // not valid format
            reply(true)
        } else {
            reply(messages.videoExtensionNotAllowed).takeover()
        }

    },
    generateVideoThumbnail: function(request, reply) {

        var time = new Date().getTime();
        var randnum = Math.floor(Math.random() * 1000000000)


        if (request.thumb_filename)
            var filename = request.thumb_filename;
        else
            var filename = "thumb" + time + '_' + randnum + ".jpg";

        var videopaths = path.join(__dirname, '../Assets/Video/') + request.video_filename // read the video file


        var thumbnailPath = path.join(__dirname, '../Assets/Thumbnails/') + filename // generate the thumbnail image 

        thumbler.extract(videopaths, thumbnailPath, '00:00:2', '200x125', function(err, res) {
            if (err) {
                console.log(err)
                reply(err)
            } else {
                console.log('snapshot saved to snapshot.png (200x125) with a frame at 00:00:2');
                reply(null, filename)
            }
        });
    },
    validateImage: function(request, reply) { // validae the image extension

        if (request.payload.image && request.payload.image != "") {

            var image_type = request.payload.image.hapi.headers['content-type']
            var extension = image_type.split("/")

            if (extension[1].toString() == "jpg" || extension[1].toString() == "png" || extension[1].toString() == "jpeg") { // not valid format
                reply(true)
            } else {
                reply(messages.imageExtensionNotAllowed).takeover()
            }
        } else {
            reply(true)
        }


    },

  
    
    isEmail :function(email) {
        return validator.isEmail(email);
    },
    
   encryptPassword : function(password,callback)
    {
        bcrypt.genSalt(10,(err,salt)=>
    {
        if(err)
            console.log(err);
        else{
            bcrypt.hash(password,salt,(err,hash)=>
        {
            callback(err,hash);
        })
        }
    })
    },
    
    comparePassword : function(plaintext,hash,callback)
    {
        console.log("inside comapre password",plaintext,hash)
        bcrypt.compare(plaintext,hash,(err,mathched)=>
    {
        return err == null ?
        callback(null, mathched) :
        callback(err);
    })
    }
    

}
