import { app, Menu, shell } from 'electron';
import path from 'path';
import url from 'url';
import MainWindow from './windows/mainWindow';
// import { mainMenu } from './menu';
import TrayCreator from './tray';

const isDev = process.env.NODE_ENV === 'development';
const port = parseInt(process.env.PORT!, 10) || 3000;
const devUrl = `http://localhost:${port}/`;

// https://github.com/jarek-foksa/xel/issues/23
const prodUrl = url.format({
  pathname: path.resolve(__dirname, 'build/index.html'),
  protocol: 'file:',
  slashes: true
});
const indexUrl = isDev ? devUrl : prodUrl;

class Electron {
  mainWindowInstance: MainWindow;

  init() {
    this.initApp();
  }

  initApp() {
    app.on('ready', async () => {
      this.createMainWindow();
      this.mainWindowInstance.loadURL(indexUrl);
      // Menu.setApplicationMenu(mainMenu);
      Menu.setApplicationMenu(null);
      const appIconPath = path.join(__dirname, './assets/electron.png');
      const tray = new TrayCreator(appIconPath);
      tray.initTray();
      if (isDev) {
        this.mainWindowInstance.openDevTools();
        await this.installExtensions();
      }
    });
    app.on('window-all-closed', () => {
      app.quit();
    });
    /** Prevent links or window.open from opening new windows. */
    app.on('web-contents-created', (_, contents) => {
      contents.on('will-navigate', (event, url2: string) => {
        if (!isDev || url2.indexOf('//localhost:') < 0) {
          event.preventDefault();
          shell.openExternal(url2);
        }
      });
    });
  }

  createMainWindow() {
    this.mainWindowInstance = new MainWindow();
    this.mainWindowInstance.show();
  }

  installExtensions = async () => {
    const { default: installer, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

    installer([REACT_DEVELOPER_TOOLS])
    .then((name: string) => console.log(`Added Extension:  ${name}`))
    .catch((err: Error) => console.log('An error occurred: ', err));
  }
}

new Electron().init();

// 在主进程中.
const { ipcMain } = require('electron');
ipcMain.on('asynchronous-message', (event: any, arg: any) => {
  console.log(arg); // prints "ping"
  event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('synchronous-message', (event: any, arg: any) => {
  console.log(arg); // prints "ping"
  event.returnValue = 'pong';
});
