'use strict'

const async = require('async');
const Utils = require('../Utils');
const Config = require('../Config');
const jwt = require('jsonwebtoken');
const Models= require('../Models'); 
//const Services = require('./Services');
const plugins = require('../Plugins');


module.exports={
	login : function(data,callback)
	{
		let encryptPassword, ID;
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
			  console.log(err,"eroororoor");
			  if(err)
				  cb(err)
			  else if(result)
			  {
				  console.log(err,result,"knvdjkbvdjbvd")
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
			  Services.dbCommonServices.getData("users", criteria, {}, { password : 0 , __v : 0 , isDeleted : 0 , isVerified : 0 , createdAt : 0 , updatedAt : 0}, (err,result)=>
			  {
				  if(err)
					  cb(err)
				  else
					  {
						  cb(result);
					  }
					 
			  } )
		  },
		  function(cb)
		  {
			  let tokenData = {
				  id: ID,
				  email:data.email,
				  password:data.password
			  }
			  var token = plugins.auth.generateToken(tokenData);
			  result.token = token;
			  cb();
		  },
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
	}   
}