const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const nvmCommand = '/Users/ermmakoov/.nvm/nvm.sh';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,  // Включи nodeIntegration для доступа к Node.js API
      contextIsolation: false,  // Отключи contextIsolation, если используешь старую версию React или другие плагины
    }
  });

  // Открой клиентское приложение, собранное React
  mainWindow.loadURL('http://localhost:3000');
}

// Запускаем сервер
function startServer() {
  const server = spawn('bash', ['-c', `source ${nvmCommand} && node server/index.js`]);

  server.stdout.on('data', (data) => {
    console.log(`SERVER: ${data}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`SERVER ERROR: ${data}`);
  });
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});