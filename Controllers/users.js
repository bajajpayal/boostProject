'use strict'

const Services = require('../Services');
const async = require('async');
const utils = require('../Utils'); 
const plugins = require('../Plugins');
const fs = require ('fs');
var Path = require ('path');

module.exports = {
   
    login: function(data, callback) {
       
		let encryptPassword, ID,  finalData, token;
		const criteria = {
		  email : data.email,
		  isDeleted: false,
		  isVerified : true
	  }
	  async.series([
		  function(cb)
		  {
			 
			  Services.dbCommonServices.getData("users", criteria, {},{}, (err,result)=>
		  {
			  if(err)
				  cb(err)
			  else 
				  {
					  ID = result[0].id;
					  encryptPassword = result[0].password;
					  cb();
                  }               
				 
		  } )
		  },
		  function(cb)
		  {
			  utils.universalFunctions.comparePassword(data.password , encryptPassword , (err,result)=>
		  {
			  if(err)
				  cb(err)
			  else if(result)
			  {
					  cb()
			  }
			  else
				  {
					  cb('password is not matched');
				  }
		  })
		  },
          function(cb)
		  {
			  let tokenData = {
				  id: ID,
				  email:data.email,
				  password:data.password
			  }
			  token = plugins.auth.generateToken(tokenData);
              console.log(token,"token----------------------")
			  cb();
          },
          function(cb)
          {
              let query = {
                  $set : {
                    token : token
                  }                
              }
            Services.dbCommonServices.findOneAndUpdateData("users",criteria, query , { lean : true }, (err,data)=>
            {
                if(err)
                    {
                        cb(err);
                    }
                    else{
                        cb(null,data);
                    }
            } )
          },
		  function(cb)
		  {
			  Services.dbCommonServices.getData("users", criteria, {}, { password : 0 , __v : 0 , isDeleted : 0 , isVerified : 0 , createdAt : 0 , updatedAt : 0}, (err,result)=>
			  {
				  if(err)
					  cb(err)
				  else
					  {
                          result[0].token =  token;
                          finalData = result;
						  cb();
					  }
					 
			  } )
		  },
		 
	  ],(err,result)=>
	  {
		  if(err)
			  {
				  callback(err);
			  }
			  else{
                  callback(null,finalData);
			  }
	  })
	 
    },

    signUp : function(data,callback)
    {
        console.log("i am herererererererererererer")
        let encryptPassword;
      async.series([
          function(cb)
          {
              if(utils.universalFunctions.isEmail(data.email))
                  {
                      cb();
                  }
                  else{
                      cb('email is not valid');
                  }
          },
          function(cb)
          {
            Services.dbCommonServices.getData("users", { email : data.email , phoneNo : data.phoneNo }, {},{}, (err,result)=>
            {
                if(err)
                    {
                    cb(err)    
                     }   
                     else if(result.length > 0)
                        {
                            cb("email or phone number already exist");
                        }
                    else{
                        cb();
                    }      
                   
            } )
          },
          function(cb)
          {
             utils.universalFunctions.encryptPassword(data.password,(err,hash)=>
          {
              if(err)
                  cb(err);
           else{
              data.password = hash;
              cb();
           }
          });  
          },
          function(cb)
          {
              plugins.EmailNotification.sendEmail('bajaj.payal27@gmail.com',(err,d)=>
          {
              console.log(err,d);
              if(err)
                  cb(err);
              else
                  cb();
          })
          },
          function(cb)
          {
              console.log(Services.dbCommonServices);
              Services.dbCommonServices.insertData("users", data, (err,data)=>
                  {
                      if(err)
                          {
                              cb(err);
                          }
                          else{
                              cb(null,data);
                          }
                  })
          }
      ],(err,result)=>
          {
              if(err)
                  {
                      callback(err);
                  }
                  else{
                      callback(null,result);
                  }
          })
    },

    changePassword : function(data , callback)
    {
        let criteria = {
            token : data.token,
            email : data.email,
            isDeleted: false,
            isVerified : true
        };
        let password , encryptPassword, finalData;
        async.series([
            function(cb)
            {
                plugins.auth.checkToken(data.token , (err, d)=>
            {
                console.log(err,d);
                if(err)
                    {
                        cb(err)
                    }
                    else{
                        cb();
                    }
            })
            },
            function(cb)
            {
               criteria = {
                   email : data.email,
                   isDeleted: false,
                   isVerified : true
               }
                Services.dbCommonServices.getData("users", criteria, {},{}, (err,result)=>
            {
                if(err)
                    cb(err)
                else if(result)
                    {
                        encryptPassword = result[0].password;
                        cb();
                    }         
                    else{
                        cb("Not a Valid User Account");
                    }      
                   
            } )
            },
            function(cb)
            {
                utils.universalFunctions.comparePassword(data.oldPassword , encryptPassword , (err,result)=>
            {
                if(err)
                    cb(err)
                else if(result)
                {
                        cb()
                }
                else
                    {
                        cb('password is not matched');
                    }
            })
            },
            function(cb)
            {
               utils.universalFunctions.encryptPassword(data.newPassword,(err,hash)=>
            {
                if(err)
                    cb(err);
             else{
                password = hash;
                cb();
             }
            });  
            },
            function(cb)
            {
                let query = {
                    $set : {
                        password : password
                    }
                }
                Services.dbCommonServices.findOneAndUpdateData("users",criteria, query , { lean : true }, (err,data)=>
            {
                if(err)
                    {
                        cb(err);
                    }
                    else{
                        finalData =  data;
                        cb();
                    }
            } )
            }
        ],(err,result)=>
        {
            if(err)
                {
                    callback(err);
                }
                else{
                    callback(null,finalData);
                }
        })
    },

    emailForPasswordChange : function(data , callback)
    {
        let email , encryptPassword, finalData;
        async.series([
            function(cb)
            {
                plugins.auth.checkToken(data.token , (err, d)=>
            {
                console.log(err,d);
                if(err)
                    {
                        cb(err)
                    }
                    else{
                        cb();
                    }
            })
            },
            function(cb)
            {
               let criteria = {
                   token : data.token,
                   isDeleted: false,
                   isVerified : true
               }
                Services.dbCommonServices.getData("users", criteria, {},{}, (err,result)=>
            {
                if(err)
                    cb(err)
                else if(result)
                    {
                        email = result[0].email;
                        cb();
                    }         
                    else{
                        cb("Not a Valid User Account");
                    }      
                   
            } )
            },
            function(cb)
            {
                var username = utils.universalFunctions.capitalizeFirstLetter('payal');
                var templatepath = Path.join(__dirname, '../emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'changePassword.html');
                var emailTemplate = '';
                    fileReadStream.on('data',function(buffer) {
                       emailTemplate += buffer.toString();
                    });
                var path =   'http://localhost:8001/documentation'
                fileReadStream.on('end', function(res) {
                var sendStr = emailTemplate.replace('{{name}}', username).replace('{{path}}', path)
                var email_data = { // set email variables
                        to:'payal@ignivasolutions.com',
                        from:'bajaj.payal27@gmail.com' ,
                        subject: 'Boost - Chnage password',
                        html: sendStr
                    }
                    plugins.EmailNotification.sendEmail(email_data, function(err, res) { // send password reset email to the admin
                        if (err) {
                            cb(err)
                        } else {
                            cb(null, data)
                        }
                    });
                })	
                    
            }
        ],(err,result)=>
        {
            if(err)
                {
                    callback(err);
                }
                else{
                    callback(null,null);
                }
        })
    }
};