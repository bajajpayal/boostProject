module.exports = {
	errorLogger : function(message, data) {
		console.log('\r\n++++++++++++++++'+message+'+++++++++++++\n\r', data);
	},
	successLogger: function(message, data){
		console.log('\r\n++++++++++++++++'+message+'+++++++++++++\n\r', data);
	}
}