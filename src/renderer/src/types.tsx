
import { ReactNode } from "react";


export interface RecentFolder {
    fpath: string;
    basename: string;
    num_of_files: number;
    some_files: string[];
}

export interface File {
  fpath: string;
  basename: string;
  ext: string;
  selected: boolean;
  locked: boolean;
}

export interface UndoHistoryItem {
  basename: string;
  baseDir: string;
  folder: string;
}

export interface FolderContextValue {
  messageApi: any; // Type it accordingly
  messageContextHolder: any; // Type it accordingly

  selectedFolder: string | null;
  setSelectedFolder: React.Dispatch<React.SetStateAction<string | null>>;
  exitFolder: () => void;

  selectedFile: File | null; // Type it accordingly
  setSelectedFile: React.Dispatch<React.SetStateAction<any>>;

  selectDirectory: () => void;
  openDirectory: (fpath: string | null) => void;

  showLeft: boolean;
  setShowLeft: React.Dispatch<React.SetStateAction<boolean>>;

  showProgressBar: boolean;
  setShowProgressBar: React.Dispatch<React.SetStateAction<boolean>>;

  showFilesList: boolean;
  setShowFilesList: React.Dispatch<React.SetStateAction<boolean>>;

  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;

  timeoutId: number | null;
  setTimeoutId: React.Dispatch<React.SetStateAction<number | null>>;

  currentFiles: File[];
  setCurrentFiles: React.Dispatch<React.SetStateAction<File[]>>;

  chosenFiles: File[];
  setChosenFiles: React.Dispatch<React.SetStateAction<File[]>>;

  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;

  mouseInactiveThreshold: number;

  timeoutIdRef: React.MutableRefObject<number | null>;
  chosenFilesRef: React.MutableRefObject<File[]>;

  history: File[];
  setHistory: React.Dispatch<React.SetStateAction<File[]>>;

  undoHistory: UndoHistoryItem[][];
  setUndoHistory: React.Dispatch<React.SetStateAction<UndoHistoryItem[][]>>;

  speed: number;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;

  selectionMethod: string;
  setSelectionMethod: React.Dispatch<React.SetStateAction<string>>;

  columns: number;
  setColumns: React.Dispatch<React.SetStateAction<number>>;

  rows: number;
  setRows: React.Dispatch<React.SetStateAction<number>>;

  folders: string[];
  setFolders: React.Dispatch<React.SetStateAction<string[]>>;

  // eslint-disable-next-line @typescript-eslint/ban-types
  Throttle: (func: Function, delay: number) => (...args: any[]) => void;
  updateHistory: (files: File[]) => void;

  startTimeout: (speed: number, numberOfItems: number, selectionMethod: string, stopper?: boolean) => void;
  stopTimeout: () => void;
  handlePlayPause: () => void;
  handleFileClick: (fdata: File) => void;
  handleNext: () => void;
  handlePrev: () => void;

  handleFileSwap: (index: number, target: number) => void;

  handleSpeedChange: (value: number) => void;
  handleColumnChange: (value: number) => void;
  handleRowChange: (value: number) => void;
  handleSelectionMethodChange: (value: string) => void;
  handleLockedImagesToggle: (filePath: string) => void;
  updateRecentPaths: (fPath: string) => void;
  getFilePathsFromDirectory: (path: string) => void;
  handleSelectedImagesToggle: (filePath: string) => void;

  handleUndoHistory: () => void;
  moveFilesToDir: (folder: string) => void;
  handleEditToggle: () => void;
  refreshFiles: (cfiles?: File[]) => void;
}

export interface FolderProviderProps {
  children: ReactNode;
}
