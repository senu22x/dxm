const { readEnv } = require('../lib/database');
const { cmd } = require('../command');
const { downloadMediaMessage } = require('@adiwajshing/baileys');

// Store last message ID for each user to prevent duplicate replies
let lastMessageId = {};

// Function to determine the content type of the message
function getContentType(message) {
    if (!message) return null;
    if (message.conversation || message.extendedTextMessage) return 'text';
    if (message.imageMessage) return 'image';
    if (message.videoMessage) return 'video';
    if (message.audioMessage) return 'audio';
    if (message.documentMessage) return 'document';
    if (message.stickerMessage) return 'sticker';
    return null;
}

// Command handler for FUN_CHAT with unique message check
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
    const config = await readEnv();

    // Check if FUN_CHAT is enabled and if the chat is private (not a group)
    if (config.FUN_CHAT === 'true' && mek.key.remoteJid && !mek.key.remoteJid.includes('@g.us')) {
        const contentType = getContentType(mek.message);
        const messageId = mek.key.id;
        const sender = mek.key.participant || from;

        // Only reply if this is a new message and it's not sent by the bot
        if (lastMessageId[sender] === messageId || mek.key.fromMe) {
            return; // Skip if the message is the same as the last one or sent by the bot itself
        }

        lastMessageId[sender] = messageId; // Update last message ID for the sender

        // Respond based on the type of content received
        try {
            if (contentType === 'text') {
                const text = mek.message.conversation || mek.message.extendedTextMessage?.text;
                await conn.sendMessage(from, { text });
            } else if (['image', 'video', 'audio', 'document', 'sticker'].includes(contentType)) {
                const mediaBuffer = await downloadMediaMessage(mek, 'buffer', {}, { logger: console });
                if (mediaBuffer) {
                    await conn.sendMessage(from, { 
                        [contentType]: mediaBuffer,
                        caption: mek.message[`${contentType}Message`].caption || '' // Include caption if available
                    });
                } else {
                    console.log(`Failed to download media for content type: ${contentType}`);
                }
            } else {
                console.log(`Unsupported content type or no content found: ${contentType}`);
            }
        } catch (error) {
            console.error(`Error processing message of type ${contentType}:`, error);
        }
    }
});
