const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "eIFEQAqK#tdNX3JVU-8L9ndGPgKIV51pxywp9uZWAxZkyLxPwB-4",
MONGODB: process.env.MONGODB || "mongodb://mongo:XdELHjSHLDFSJjrsGwZoAcHfKYqPBtMN@autorack.proxy.rlwy.net:59578",
FOOTER: process.env.FOOTER || "Mr Dila",
BTN: process.env.BTN || "Click Here",
BTNURL: process.env.BTNURL || "https://whatsapp.com/channel/0029VarK8LEHbFVFcPRvxl3T",

};
