import { contextBridge, ipcRenderer } from 'electron';

export interface SparkBuddyBridge {
  minimize: () => Promise<void>;
  hide: () => Promise<void>;
  close: () => Promise<void>;
  toggleAlwaysOnTop: () => Promise<boolean>;
  sendNotification: (options: {
    title: string;
    body: string;
    quietStart?: string;
    quietEnd?: string;
  }) => Promise<boolean>;
}

const api: SparkBuddyBridge = {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  hide: () => ipcRenderer.invoke('window-hide'),
  close: () => ipcRenderer.invoke('window-close'),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('window-toggle-always-on-top'),
  sendNotification: (options) => ipcRenderer.invoke('send-notification', options),
};

contextBridge.exposeInMainWorld('sparkBuddyAPI', api);

