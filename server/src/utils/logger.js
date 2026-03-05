// Simple logger utility
const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'info'];

const timestamp = () => new Date().toISOString();

const logger = {
  error: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.error) {
      console.error(`[${timestamp()}] ERROR:`, ...args);
    }
  },
  warn: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.warn) {
      console.warn(`[${timestamp()}] WARN:`, ...args);
    }
  },
  info: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.info) {
      console.log(`[${timestamp()}] INFO:`, ...args);
    }
  },
  debug: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.debug) {
      console.log(`[${timestamp()}] DEBUG:`, ...args);
    }
  },
};

export default logger;
