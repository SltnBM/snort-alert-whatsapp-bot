require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const tail = require("tail").Tail;
const fs = require("fs");

const LOG_FILE = process.env.LOG_FILE || "/var/log/snort/snort.alert.fast";
const THROTTLE_INTERVAL = parseInt(process.env.THROTTLE_INTERVAL) || 5000;
const CHAT_ID = process.env.CHAT_ID;
const CHROME_PATH = process.env.CHROME_PATH || "/usr/bin/chromium-browser";

let lastAlertTime = 0;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: CHROME_PATH,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu"
        ]
    }
});

client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("🚀 WhatsApp Snort Alert Bot is ready!");
    watchLog();
});

client.initialize();

function sendAlert(message) {
    const now = Date.now();
    if (now - lastAlertTime < THROTTLE_INTERVAL) return;
    lastAlertTime = now;

    client.sendMessage(CHAT_ID, message).catch(err => {
        console.error("❌ Failed to send alert:", err);
    });
}

function parseSnortLine(line) {
    const pattern =
        /(\d{2}\/\d{2}-[\d:.]+)\s+\[\*+\]\s+\[(\d+:\d+:\d+)\]\s+(.+?)\s+\[\*+\]\s+\[Classification:\s*(.+?)\]\s+\[Priority:\s*(\d+)\]\s+\{([\w\-]+)\}\s+(.+?)\s+->\s+(.+)/;
    const match = line.match(pattern);
    if (!match) return null;

    const [, timestamp, alertId, alertMsg, classification, priority, protocol, src, dst] = match;
    return `⚠️ Message: ${alertMsg}\n📖 Classification: ${classification}\nPriority: ${priority}\n📡 Protocol: ${protocol}\n➡️ ${src} → ${dst}\n🕒 ${new Date().toLocaleString()}`;
}

function watchLog() {
    if (!fs.existsSync(LOG_FILE)) {
        console.error(`❌ Log file not found: ${LOG_FILE}`);
        process.exit(1);
    }

    const tailFile = new tail(LOG_FILE);

    tailFile.on("line", line => {
        const alert = parseSnortLine(line.trim());
        if (alert) sendAlert(`🚨 SNORT ALERT 🚨\n\n${alert}`);
    });

    tailFile.on("error", err => {
        console.error("❌ Error reading log file:", err);
    });
}
