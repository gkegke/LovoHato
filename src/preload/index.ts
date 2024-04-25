import { UndoHistoryItem } from '../renderer/src/types'

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getStoreValue: (key: string) => ipcRenderer.invoke('getStoreValue', key),
  setStoreValue: (key: string, value: string) => ipcRenderer.invoke('setStoreValue', key, value),
  openFileBrowser: () => ipcRenderer.invoke('openFileBrowser'),
  openDirectory: (dPath: string, folderName: string) =>
    ipcRenderer.invoke('openDirectory', dPath, folderName),
  getRecentPaths: () => ipcRenderer.invoke('getRecentPaths'),
  addToRecentPaths: (filePath: string) => ipcRenderer.invoke('addToRecentPaths', filePath),
  removeRecentPath: (filePath: string) => ipcRenderer.invoke('removeRecentPath', filePath),
  getDirFilePaths: (filePath: string) => ipcRenderer.invoke('getDirFilePaths', filePath),
  moveFileToDir: (filePath: string, dir: string, actionType: string) =>
    ipcRenderer.invoke('moveFileToDir', filePath, dir, actionType),
  moveFilesToDir: (files: string[], baseDir: string, folder: string) =>
    ipcRenderer.invoke('moveFilesToDir', files, baseDir, folder),
  undoRecentMoves: (moves: UndoHistoryItem[]) => ipcRenderer.invoke('undoRecentMoves', moves)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('eAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

export type api = typeof api;
