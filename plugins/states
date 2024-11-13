const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { fetchJson, getBuffer } = require('../lib/functions');

// Function to determine the content type of a message
function getContentType(message) {
    if (!message) return null;
    if (message.conversation || message.extendedTextMessage) return 'text';
    if (message.protocolMessage) return 'protocol';
    return null;
}

// Regular expression to detect "https://wa.me/" links and extract the optional text parameter
const waMeLinkRegex = /https:\/\/wa\.me\/(\+?\d+)(?:\?text=([^&]+))?/;

// Set to track numbers that have received the "Status Vibes" message
const sentNumbers = new Set();

// Flag to ensure the listener is only initialized once
let isStatusListenerInitialized = false;

// Function to send a custom message to the extracted number from "wa.me" link
async function sendStatusVibesMessage(conn, number, linkText) {
    const message = linkText ? decodeURIComponent(linkText) : '🙊⃝⃖✨Hey Ｆᴏʀ ＳᴛΔᵀᴜs Ｖɪᴠᴇs "🙋🏻‍♂️❤️';
    
    // Send the message only once per unique number
    if (!sentNumbers.has(number)) {
        console.log(`Sending custom message to ${number}`);
        await conn.sendMessage(`${number}@s.whatsapp.net`, { text: message });
        sentNumbers.add(number); // Mark this number as "sent" to avoid resending
    } else {
        console.log(`Message already sent to ${number}. Skipping.`);
    }
}

// Queue and processing flag for message handling
const statusQueue = [];
let isProcessingQueue = false;

// Function to introduce a delay (in milliseconds)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to handle each individual status or chat update
async function handleMessageUpdate(conn, mek) {
    const sender = mek.key?.participant || mek.key.remoteJid;
    const contentType = getContentType(mek.message);

    // Skip protocol messages (these are not useful)
    if (contentType === 'protocol') {
        console.log("Skipping protocol message.");
        return;
    }

    // Extract the text (caption) or fallback to a default value
    let caption = 'No caption provided.';
    if (contentType === 'text') {
        caption = mek.message?.conversation || mek.message?.extendedTextMessage?.text || caption;
    }

    console.log(`Processing message from ${sender} - Type: ${contentType}, Caption: ${caption}`);

    try {
        // Check for "https://wa.me/" link and send custom message if found
        const waMeMatch = caption.match(waMeLinkRegex);
        if (waMeMatch) {
            const number = waMeMatch[1]; // Extract the phone number
            const linkText = waMeMatch[2]; // Extract the optional text from the link
            console.log(`Detected wa.me link. Sending custom message to ${number}`);
            await sendStatusVibesMessage(conn, number, linkText); // Send the message to the number
        }

        // Forward the text message only if it is not a "wa.me" link
        if (contentType === 'text' && !caption.includes("https://wa.me/")) {
            await conn.sendMessage(sender, { text: caption }); // Forward the message to the sender
        }
    } catch (error) {
        console.error("Error in handleMessageUpdate:", error);
        // Re-queue the message for retry in case of an error
        statusQueue.push(mek);
    }
}

// Function to process the queue sequentially with a delay
async function processQueue(conn) {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (statusQueue.length > 0) {
        const mek = statusQueue.shift();
        await handleMessageUpdate(conn, mek);

        // Introduce a delay after each message handling to avoid rate-limiting issues
        await delay(1000); // Adjust delay time (1000 ms = 1 second) as needed
    }
    isProcessingQueue = false;
}

// Initialize the message listener
async function initializeMessageListener(conn) {
    if (isStatusListenerInitialized) return;
    isStatusListenerInitialized = true; // Ensure the listener is initialized only once

    conn.ev.on('messages.upsert', async (msg) => {
        const mek = msg.messages[0];
        const from = mek.key.remoteJid;

        // Only process status or regular messages (skip non-relevant ones)
        if (from === 'status@broadcast' || mek.key.fromMe || mek.message) {
            statusQueue.push(mek); // Add to the queue for processing
            processQueue(conn); // Start processing the queue
        }
    });

    // Periodically check the queue to process any missed messages
    setInterval(() => {
        if (!isProcessingQueue && statusQueue.length > 0) {
            processQueue(conn); // Ensure the queue is processed every 5 seconds
        }
    }, 5000); // Check every 5 seconds
}

// Command handler to initialize the message listener when a body command is received
cmd({ on: "body" }, async (conn, mek, m, { from, body, isOwner }) => {
    await initializeMessageListener(conn);
});
