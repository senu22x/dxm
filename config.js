const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "",
MONGODB: process.env.MONGODB || "mongodb://mongo:JErkltPmPpjqgnCnDjpWnBseRCuWXAML@junction.proxy.rlwy.net:30656",
FOOTER: process.env.FOOTER || "Mr Dila",
BTN: process.env.BTN || "Click Here",
BTNURL: process.env.BTNURL || "https://whatsapp.com/channel/0029VarK8LEHbFVFcPRvxl3T",

};
