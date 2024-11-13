const { cmd } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');
const sensitiveData = require('../dila_md_licence/a/b/c/d/dddamsbs');

const formatViews = views => 
    views >= 1_000_000_000 ? `${(views / 1_000_000_000).toFixed(1)}B` :
    views >= 1_000_000 ? `${(views / 1_000_000).toFixed(1)}M` :
    views >= 1_000 ? `${(views / 1_000).toFixed(1)}K` : 
    views.toString();

cmd({
    pattern: "song",
    desc: "Download songs",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            await conn.sendPresenceUpdate('recording', from);
            await conn.sendMessage(from, { audio: { url: 'https://github.com/themiyadilann/DilaMD-Media/raw/main/voice/song.mp3' }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
            return;
        }

        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;
        let desc = `> ${sensitiveData.hhhhhhczss}\n\n🎶 *𝗧𝗶𝘁𝗹𝗲*: _${data.title}_\n👤 *𝗖𝗵𝗮𝗻𝗻𝗲𝗹*: _${data.author.name}_\n📝 *𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻*: _${data.description || 'N/A'}_\n⏳ *𝗧𝗶𝗺𝗲*: _${data.timestamp}_\n⏱️ *𝗔𝗴𝗼*: _${data.ago}_\n👁️‍🗨️ *𝗩𝗶𝗲𝘄𝘀*: _${formatViews(data.views)}_\n🔗 *𝗟𝗶𝗻𝗸*: ${url}\n\n${sensitiveData.siteUrl}\n${sensitiveData.footerText}`;

        // Define buttons
        const buttons = [
            { buttonId: `downloadSong_${url}`, buttonText: { displayText: '🎵 Download Audio' }, type: 1 },
            { buttonId: `downloadDoc_${url}`, buttonText: { displayText: '📄 Download as Doc' }, type: 1 }
        ];

        // Button message
        const buttonMessage = {
            text: desc,
            footer: "Choose an option below:",
            buttons: buttons,
            headerType: 1 // This can be set based on the type of message
        };

        // Attempt to send button message
        try {
            console.log("Sending button message:", buttonMessage); // Debug log
            await conn.sendMessage(from, buttonMessage, { quoted: mek });
            console.log("Button message sent successfully");
        } catch (err) {
            console.error("Error sending button message:", err);
            reply("Failed to send button message, please try again.");
            return;
        }

        // Handle button responses
        conn.ev.on('messages.upsert', async (msg) => {
            const buttonId = msg?.messages[0]?.message?.buttonsResponseMessage?.selectedButtonId;
            if (!buttonId || !buttonId.includes(url)) return;

            await conn.sendPresenceUpdate('recording', from);
            const down = await fg.yta(url);
            const downloadUrl = down.dl_url;

            if (buttonId.startsWith('downloadSong')) {
                await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
            } else if (buttonId.startsWith('downloadDoc')) {
                await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "audio/mpeg", fileName: `${data.title}.mp3`, caption: "💻 *ᴍᴀᴅᴇ ʙʏ ᴍʀᴅɪʟᴀ*" }, { quoted: mek });
            }
        });
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
