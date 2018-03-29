import path from 'path';
import { ipcMain } from 'electron';
import log from 'electron-log';
import { daedalusLogger } from './remoteLog';
import ensureDirectoryExists from './ensureDirectoryExists';
import { pubLogsFolderPath, APP_NAME } from '../config';

const isTest = process.env.NODE_ENV === 'test';

export const setupLogging = () => {
  const logFilePath = path.join(pubLogsFolderPath, APP_NAME + '.log');
  ensureDirectoryExists(pubLogsFolderPath);

  log.transports.console.level = isTest ? 'error' : false;
  log.transports.rendererConsole.level = 'error';
  log.transports.file.level = 'debug';
  log.transports.file.maxSize = 20 * 1024 * 1024;
  log.transports.file.file = logFilePath;
  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}';

  try {
    let sendLogsToRemoteServer;
    ipcMain.on('send-logs-choice', (event, sendLogs) => {
      sendLogsToRemoteServer = sendLogs;
    });
    ipcMain.on('log-to-remote', (event, logEntry) => {
      if (sendLogsToRemoteServer) daedalusLogger.info(logEntry);
    });
  } catch (error) {
    log.error('Error setting up log logging to remote server', error);
  }
};
