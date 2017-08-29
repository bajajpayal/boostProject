'use strict'

const Joi = require('joi');
const Controllers = require('../Controllers');


module.exports=[
	{
		method: 'POST',
		path : '/users/signUp',
		handler:(request,reply)=>
		{
			Controllers.users.signUp(request.payload,(err,data)=>
				{
					if(err)
						{
							console.log(err,"erorooror")
							reply({
		                        statusCode: 400,
		                        status: "error",
		                        message: err,		                        
		                    })
						}
						else{
							reply({
		                        statusCode: 200,
		                        status: "success",
		                        message: "SignUp successfully.",
		                        result: {
		                           	userData:data
		                        }
		                    })
						}
					})
		},
		config:{
			tags:['api'],
			description:'sign up api ',
			validate:{
				payload:{
					name:Joi.string().required(),
					password:Joi.string().min(6).max(20).required(),
					email: Joi.string().required().lowercase().max(256).regex(/^([a-zA-Z0-9.])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/),
					phoneNo:Joi.number()
				},
				failAction: function (request, reply, source, error){
					reply('Enter valid email address');
				} 
			},
			plugins:{
				'hapi-swagger':{
					payloadType : 'form'
				}
			}
		}
	
	},
	{
			method:'POST',
			path: '/users/login',
			config: {
	            description: 'API admin login',
	            notes: 'API admin login',
	            tags: ['api'],
	            validate: {
		                payload: {
	                  	  email: Joi.string().required().lowercase().max(256).regex(/^([a-zA-Z0-9.])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/).options({ language: { string: { regex: { base: 'valid email address' } } } }).label('Please enter '),
	                  	  password : Joi.required(),
		                },
		            failAction: function (request, reply, source, error){
									reply('Enter valid email address');
		  					  } 
		            }
        	},
         	handler: function (request, reply) {

			         Controllers.users.login(request.payload, function(err, res) {
			         	console.log(err,res)
		                if (err) {
		                    reply({
		                        statusCode: 400,
		                        status: "error",
		                        message: err,
		                        
		                    })
		                } else {
		                    reply({
		                        statusCode: 200,
		                        status: "success",
		                        message: "Login successfully.",
		                        result: {
		                           	userData:res
		                        }
		                    }).header('X-logintoken', res.token);
		                }
		            });  
				},
				
},
{
	method:'POST',
	path: '/users/changePassword',
	config: {
		description: 'API admin change password',
		tags: ['api'],
		validate: {
				payload: {
					token : Joi.string().required(),
					email: Joi.string().required().lowercase().max(256).regex(/^([a-zA-Z0-9.])+\@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/).options({ language: { string: { regex: { base: 'valid email address' } } } }).label('Please enter '),
					oldPassword : Joi.required(),
					newPassword: Joi.required(),
				},
			failAction: function (request, reply, source, error){
							reply('Enter valid email address');
						} 
			},
			plugins:{
				'hapi-swagger':{
					payloadType : 'form'
				}
			}
	},
	 handler: function (request, reply) {

			 Controllers.users.changePassword(request.payload, function(err, res) {
				if (err) {
					reply({
						statusCode: 400,
						status: "error",
						message: err,
						
					})
				} else {
					reply({
						statusCode: 200,
						status: "success",
						message: "Password Changed successfully.",
						result: {
							   userData:res
						}
					}).header('X-logintoken', res.token);
				}
			});  
		},
	},
	{
		method:'POST',
		path: '/users/emailForPasswordChange',
		config: {
			description: 'API admin change password',
			tags: ['api'],
			validate: {
					payload: {
						token : Joi.string().required()
					},
				failAction: function (request, reply, source, error){
								reply('Enter valid email address');
							} 
				},
				plugins:{
					'hapi-swagger':{
						payloadType : 'form'
					}
				}
		},
		 handler: function (request, reply) {
	
				 Controllers.users.emailForPasswordChange(request.payload, function(err, res) {
					if (err) {
						reply({
							statusCode: 400,
							status: "error",
							message: err,
							
						})
					} else {
						reply({
							statusCode: 200,
							status: "success",
							message: "Email Send Successfully."
						})
					}
				});  
			},
		}
];
