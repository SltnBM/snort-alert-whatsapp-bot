# 🚨 Snort WhatsApp Alert Bot
A simple **Node.js bot** to forward **Snort IDS alerts** to **WhatsApp** in real-time.
This bot continuously monitors the `snort.alert.fast` log file and sends detected alerts directly to your WhatsApp chat.

## ✨ Features
- Real-time monitoring of Snort alerts.
- Instant forwarding of alerts to WhatsApp.
- Includes alert details: message, classification, priority, protocol, source, and destination.
- Throttling to prevent spam (configurable interval).
- Displays local server timestamp in each alert.
- Supports custom Snort rules via `local.rules` file.

## ⚙️ Requirements
- Node.js 18+
- Required libraries:
  - `whatsapp-web.js`
  - `qrcode-terminal`
  - `tail`
  - `dotenv`

Install dependencies:
```bash
npm install
```

Or install manually:
```bash
npm install whatsapp-web.js qrcode-terminal tail dotenv
```

## 🚀 How to Use
1. Make sure you have Node.js installed (v18 or higher recommended). Download it from [nodejs.org](https://nodejs.org/).
2. Clone this repository
```bash
git clone https://github.com/SltnBM/snort-alert-whatsapp-bot.git
```
3. Navigate to the project directory
```bash
cd snort-alert-whatsapp-bot
```
4. Configure environment variables in `.env`:
5. Add your custom Snort rules:
- A sample `local.rules` file is already provided in this repository.
- Open `/etc/snort/rules/local.rules` with a text editor:
  ```bash
  sudo nano /etc/snort/rules/local.rules
  ```
- Add your detection rules following Snort syntax.
- Save and exit the editor.
6. Run the bot
```bash
node index.js
```

## 📝 Example Alert
```plaintext
🚨 SNORT ALERT 🚨

⚠️ Message: NMAP HTTP Scan detected
📖 Classification: Attempted Information Leak
Priority: 2
📡 Protocol: TCP
➡️ 192.168.1.100:54321 → 192.168.1.10:80
🕒 24 Sep 2025 22:15:42
```

## 🤝 Contributing
Pull requests are welcome! Feel free to improve regex parsing, add new features, or optimize the alert system.

## 📬 Connect With Me
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sultan%20Badra-blue?logo=linkedin\&logoColor=white\&style=flat-square)](https://www.linkedin.com/in/sultan-badra)

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.