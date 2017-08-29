const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
        user: 'bajaj.payal27@gmail.com',
        pass: 'jaisairam1'
    }
 }));

var sendEmail = function(to,callback)
{
let mailOptions = {
    from : 'bajaj.payal27@gmail.com',
    to : to,
    subject : 'Verification Email',
    html: '<a href = "hello">hello world!</a>',
    text: 'hello world!'
    //body : 'Hi , please click on below mwntioned link to activate your account'
};

transporter.sendMail(mailOptions,(err,done)=>
{
    if(err)
        {
            callback(err);
        }
        else{
            callback(null,done);
        }
})
}

module.exports = {
    sendEmail : sendEmail
}