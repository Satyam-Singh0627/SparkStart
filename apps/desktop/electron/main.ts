import { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, Notification } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isAlwaysOnTop = true;
let isPausedUntil: number | null = null;

function getConfigPath() {
  try {
    return path.join(app.getPath('userData'), 'sparkbuddy-bounds.json');
  } catch {
    return path.join(__dirname, 'sparkbuddy-bounds.json');
  }
}

function loadSavedBounds() {
  try {
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return data;
    }
  } catch {}
  return null;
}

function saveBounds() {
  if (!mainWindow) return;
  try {
    const configPath = getConfigPath();
    const bounds = mainWindow.getBounds();
    fs.writeFileSync(configPath, JSON.stringify(bounds));
  } catch {}
}

function isInQuietHours(quietStart: string = '22:00', quietEnd: string = '08:00'): boolean {
  try {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    const [sH, sM] = quietStart.split(':').map(Number);
    const [eH, eM] = quietEnd.split(':').map(Number);
    const startMin = sH * 60 + sM;
    const endMin = eH * 60 + eM;

    if (startMin < endMin) {
      return currentMin >= startMin && currentMin < endMin;
    } else {
      // Over midnight
      return currentMin >= startMin || currentMin < endMin;
    }
  } catch {
    return false;
  }
}

function createMainWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const defaultWidth = 360;
  const defaultHeight = 520;

  let x = screenWidth - defaultWidth - 24;
  let y = screenHeight - defaultHeight - 24;

  const saved = loadSavedBounds();
  if (saved && saved.x !== undefined && saved.y !== undefined) {
    // Validate saved bounds are still within visible screen area
    const inBounds = screen.getAllDisplays().some((d) => {
      const b = d.bounds;
      return (
        saved.x >= b.x &&
        saved.x <= b.x + b.width - 100 &&
        saved.y >= b.y &&
        saved.y <= b.y + b.height - 100
      );
    });
    if (inBounds) {
      x = saved.x;
      y = saved.y;
    }
  }

  mainWindow = new BrowserWindow({
    width: defaultWidth,
    height: defaultHeight,
    x,
    y,
    frame: false,
    transparent: true,
    alwaysOnTop: isAlwaysOnTop,
    resizable: false,
    skipTaskbar: false,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Load URL or local dist
  const localDist = path.join(__dirname, '../dist/index.html');
  const devUrl = process.env.VITE_DEV_SERVER_URL;

  if (devUrl) {
    mainWindow.loadURL(devUrl).catch(() => {
      if (fs.existsSync(localDist)) {
        mainWindow?.loadFile(localDist);
      }
    });
  } else if (fs.existsSync(localDist)) {
    // Fast, reliable, 0-timeout direct load of built renderer
    mainWindow.loadFile(localDist);
  } else {
    // Fallback dev server URL if dist not built
    mainWindow.loadURL('http://localhost:5174').catch((err) => {
      mainWindow?.loadURL(`data:text/html,<html><body style="font-family:sans-serif;padding:20px;text-align:center;background:#fff;border-radius:16px;">
        <h3 style="color:#16a34a;">🌱 SparkBuddy Starting...</h3>
        <p style="color:#64748b;font-size:12px;">Renderer is compiling. Run <code>npm run build</code> in apps/desktop or launch the dev server.</p>
        <p style="color:#ef4444;font-size:10px;">${err.message}</p>
      </body></html>`);
    });
  }

  mainWindow.on('moved', saveBounds);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // Simple sprout 16x16 icon SVG base64
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#22c55e"/><path d="M8 12V6M8 6C7 4 5 4.5 5 6C5 7.5 8 8 8 8M8 6C9 4 11 4.5 11 6C11 7.5 8 8 8 8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  const icon = nativeImage.createFromBuffer(Buffer.from(svg));

  tray = new Tray(icon);
  tray.setToolTip('SparkBuddy — Desktop Productivity Companion');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show SparkBuddy',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createMainWindow();
        }
      },
    },
    {
      label: 'Always on Top',
      type: 'checkbox',
      checked: isAlwaysOnTop,
      click: (item) => {
        isAlwaysOnTop = item.checked;
        mainWindow?.setAlwaysOnTop(isAlwaysOnTop);
      },
    },
    {
      label: 'Pause Reminders (1 Hour)',
      click: () => {
        isPausedUntil = Date.now() + 60 * 60 * 1000;
      },
    },
    { type: 'separator' },
    {
      label: 'Quit SparkBuddy',
      click: () => {
        saveBounds();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });
}

// IPC Handlers
ipcMain.handle('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window-hide', () => {
  mainWindow?.hide();
});

ipcMain.handle('window-close', () => {
  saveBounds();
  app.quit();
});

ipcMain.handle('window-toggle-always-on-top', () => {
  isAlwaysOnTop = !isAlwaysOnTop;
  mainWindow?.setAlwaysOnTop(isAlwaysOnTop);
  return isAlwaysOnTop;
});

ipcMain.handle('send-notification', (_event, { title, body, quietStart, quietEnd }) => {
  // Check global pause
  if (isPausedUntil && Date.now() < isPausedUntil) {
    return false;
  }
  // Check quiet hours
  if (isInQuietHours(quietStart, quietEnd)) {
    return false;
  }

  if (Notification.isSupported()) {
    const notif = new Notification({
      title: title || 'SparkBuddy',
      body: body || 'Ready for a gentle next step?',
      silent: false,
    });
    notif.show();
    return true;
  }
  return false;
});

app.whenReady().then(() => {
  createMainWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('before-quit', saveBounds);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

