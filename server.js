const Hapi    = require('hapi');
const Swagger = require('hapi-swagger');
const Inert   = require('inert');
const Vision   = require('vision');
const mongoose = require('mongoose');

/** require routes */
const routes = require('./Routes') 


var server = new Hapi.Server();
server.connection({host: 'localhost', 	port: 8001 });

server.route(routes);
server.route({
    method: 'GET',
    path:'/', 
    config:{
    	description:'Boost API',
    	tags: ['api'], // ADD THIS TAG
    },
    handler: function (request, reply) {

        return reply('hello world');
    }
});
/** Setting Up Swagger*/

const options={
	info:{
		title:'Boost Admin API',
		version:'1.0.0'
	}
}

server.register([Inert,Vision,{
	"register":Swagger,
	 "options":options
}]);


/**  DB Connection */
var dbUrl = 'mongodb://localhost:27017/boostDatabase';
var option = {
    user: '',
    pass: ''
}


server.start((err)=>{
if(err)
{
	throw err;
}

mongoose.connect(dbUrl, option, function(err) {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    } else {
        console.log('MongoDB Connected', dbUrl);
    }
});


});