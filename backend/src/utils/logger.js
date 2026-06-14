const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOGS_DIR, 'app.log');

// Ensure directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function getTimestamp() {
  const now = new Date();
  return now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

function writeLog(level, message, error = null) {
  const timestamp = getTimestamp();
  let logText = `[${timestamp}] [${level}] ${message}`;
  if (error) {
    logText += `\n${error.stack || error}`;
  }
  logText += '\n';

  // 1. Write to Console (for docker compose logs stdout/stderr)
  if (level === 'ERROR') {
    console.error(logText.trim());
  } else if (level === 'WARN') {
    console.warn(logText.trim());
  } else {
    console.log(logText.trim());
  }

  // 2. Write to System Log File
  try {
    fs.appendFileSync(LOG_FILE, logText);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

const logger = {
  info: (msg) => writeLog('INFO', msg),
  log: (msg) => writeLog('INFO', msg),
  warn: (msg) => writeLog('WARN', msg),
  error: (msg, err = null) => writeLog('ERROR', msg, err),
};

module.exports = logger;
