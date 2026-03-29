const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Add any IPC methods here if needed
  // e.g., send: (channel, data) => ipcRenderer.send(channel, data)
});
