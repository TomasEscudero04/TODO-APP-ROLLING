import nodemailer from 'nodemailer';
import {resolve} from 'path';
import exphbs from 'nodemailer-express-handlebars';
import {config} from 'dotenv';

config();

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
})

//Configuro handlebars para los templates del email
transport.use('compile', exphbs({
    viewEngine: {
        extName: '.handlebars',
        partialsDir: resolve('./src/views/emails/'),
        defaultLayout: false,
    },
    viewPath: resolve('./src/views/emails/'),
    extName: '.handlebars',
}))

export default transport;