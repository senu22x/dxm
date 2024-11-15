const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "jRtxlCCD#M0WU5lTH1FjZmTTzryLVond8rMH5pqvfCkdez6mbWSU",
MONGODB: process.env.MONGODB || "mongodb://mongo:wSjjKewmwoBCTOlNqQbgywenYekDJIkw@junction.proxy.rlwy.net:42099",
FOOTER: process.env.FOOTER || "Mr Dila",
BTN: process.env.BTN || "Click Here",
BTNURL: process.env.BTNURL || "https://whatsapp.com/channel/0029VarK8LEHbFVFcPRvxl3T",

};
