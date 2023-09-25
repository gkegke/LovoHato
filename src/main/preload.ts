import { contextBridge, ipcRenderer } from 'electron';

export type Channels =
  | 'getStoreValue'
  | 'setStoreValue'
  | 'openFileBrowser'
  | 'openDirectory'
  | 'getRecentPaths'
  | 'addToRecentPaths'
  | 'getDirFilePaths'
  | 'moveFileToDir'
  | 'moveFilesToDir'
  | 'undoRecentMoves';

const electronHandler = {
  eAPI: {
    getStoreValue: (key: string) => ipcRenderer.invoke('getStoreValue', key),
    setStoreValue: (key: string, value: string) =>
      ipcRenderer.invoke('setStoreValue', key, value),
    openFileBrowser: () => ipcRenderer.invoke('openFileBrowser'),
    openDirectory: (dPath: string, folderName: string) =>
      ipcRenderer.invoke('openDirectory', dPath, folderName),
    getRecentPaths: () => ipcRenderer.invoke('getRecentPaths'),
    addToRecentPaths: (filePath) => ipcRenderer.invoke('addToRecentPaths', filePath),
    getDirFilePaths: (filePath: string) =>
      ipcRenderer.invoke('getDirFilePaths', filePath),
    moveFileToDir: (filePath: string, dir: string, actionType: string) =>
      ipcRenderer.invoke('moveFileToDir', filePath, dir, actionType),
    moveFilesToDir: (files: Array<string>, baseDir: string, folder: string) =>
      ipcRenderer.invoke('moveFilesToDir', files, baseDir, folder),
    undoRecentMoves: (moves: Array<Object>) =>
      ipcRenderer.invoke('undoRecentMoves', moves),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
