/*
 * @file: mailer.js
 * @description: initialising nodemailer transport for sending mails
 * @date: 2-May-2017
 * @author: Nidhi
 * */

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const configs = require('../Configs');
const env = require('../env');
const mailerinstance = configs.mailer[env.instance];

const mailer = mailerinstance ;

var transporter = nodemailer.createTransport(smtpTransport({
    service: "Gmail",
    auth: {
        user: mailerinstance.username,
        pass: mailerinstance.password
    }
}));

module.exports = {
    transporter: transporter
}
