import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react'

import { message } from 'antd'

import E from '../common/errors'

import { File, UndoHistoryItem, FolderContextValue, FolderProviderProps } from '../types'

import { randomChoice, nextN, nextNFromIndex } from '../common/utils'

import { Throttle } from '../common/simple'

const funcToUse = {
  Randomized: randomChoice,
  Ordered: nextN
}

const FolderContext = createContext<FolderContextValue | undefined>(undefined)

// eslint-disable-next-line no-undef
export function FolderProvider({ children }: FolderProviderProps): JSX.Element {
  //
  const [messageApi, messageContextHolder] = message.useMessage()

  // Initial values
  const initialSelectedFolder: string | null = null
  const initialShowLeft: boolean = true
  const initialShowProgressBar: boolean = true
  const initialShowFilesList: boolean = true
  const initialEditing: boolean = false
  const initialTimeoutId: number | null = null
  const initialCurrentFiles: File[] = []
  const initialChosenFiles: File[] = []
  const initialSelectedFile: File | null = null
  const initialIsVisible: boolean = true
  const initialFolders: string[] = ['loved', 'liked', 'mid', 'disliked', 'hated']

  const initialSpeed: number = 5
  const initialColumns: number = 3
  const initialRow: number = 1
  const initialSelectionMethod: string = 'Ordered'

  // States
  const [selectedFolder, setSelectedFolder] = useState<string | null>(initialSelectedFolder)
  const [showLeft, setShowLeft] = useState<boolean>(initialShowLeft)
  const [showProgressBar, setShowProgressBar] = useState<boolean>(initialShowProgressBar)
  const [showFilesList, setShowFilesList] = useState<boolean>(initialShowFilesList)
  const [editing, setEditing] = useState<boolean>(initialEditing)
  const [timeoutId, setTimeoutId] = useState<number | null>(initialTimeoutId)
  const [currentFiles, setCurrentFiles] = useState<File[]>(initialCurrentFiles)
  const [chosenFiles, setChosenFiles] = useState<File[]>(initialChosenFiles)
  const [selectedFile, setSelectedFile] = useState<File | null>(initialSelectedFile)
  const [folders, setFolders] = useState<string[]>(initialFolders)
  const [undoHistory, setUndoHistory] = useState<UndoHistoryItem[][]>([])
  const [isVisible, setIsVisible] = useState<boolean>(initialIsVisible)
  const [history, setHistory] = useState<File[]>([])
  const [speed, setSpeed] = useState<number>(initialSpeed)
  const [columns, setColumns] = useState<number>(initialColumns)
  const [rows, setRows] = useState<number>(initialRow)
  const [selectionMethod, setSelectionMethod] = useState<string>(initialSelectionMethod)

  // Refs
  const timeoutIdRef = useRef<number | null>(timeoutId)
  timeoutIdRef.current = timeoutId
  const chosenFilesRef = useRef<File[]>(chosenFiles)
  chosenFilesRef.current = chosenFiles

  // constants
  const mouseInactiveThreshold: number = 5

  const updateHistory = useCallback((files: Array<File>): void => {
    setHistory((prev: Array<File>) => {
      const safeFiles = files.filter((f) => f.basename !== '')
      const newHistory = [...prev, ...safeFiles].slice(-100)

      return newHistory
    })
  }, [])

  const startTimeout = useCallback(
    (
      newSpeed: number,
      newNumberOfItems: number,
      newSelectionMethod: string,
      stopper = false
    ): void => {
      if (chosenFilesRef.current.length === 0) {
        //console.log('2', chosenFilesRef.current);
        //console.log('numberOfItems', newNumberOfItems);
        setChosenFiles(() => {
          let result: File[]

          // base case
          if (newNumberOfItems < currentFiles.length) {
            result = [...currentFiles.slice(0, newNumberOfItems)]
            console.log('base', result)
            // complex case
          } else {
            console.log('complex')
            const vs = [...currentFiles.slice(0, newNumberOfItems)]
            const padding = Array(newNumberOfItems - currentFiles.length).fill({
              fpath: '',
              basename: '',
              ext: '',
              selected: false,
              locked: false
            })

            result = [...vs, ...padding]
          }

          console.log('result', result)

          return result
        })
      } else {
        const items = (funcToUse as { [key: string]: Function })[selectionMethod](
          currentFiles,
          chosenFilesRef.current,
          newNumberOfItems
        )

        // console.log('items', items);

        const addToHistory: Array<File> = []

        setChosenFiles((prevChosenFiles: Array<File>) => {
          let nonLockedIndex = 0
          const newCF = prevChosenFiles.map((file) => {
            if (!file.locked) {
              const v = items[nonLockedIndex]
              nonLockedIndex += 1

              if (v !== undefined) {
                file.selected = false
                addToHistory.push(file)
                return v
              }
              return {
                fpath: '',
                basename: '',
                ext: '',
                selected: false,
                locked: false
              }
            }
            return file
          })

          // Add leftover items to newCF
          while (nonLockedIndex < items.length) {
            newCF.push(items[nonLockedIndex])
            nonLockedIndex += 1
          }

          return newCF.slice(0, newNumberOfItems)
        })

        updateHistory(addToHistory)
      }

      if (stopper === true) {
        if (timeoutId !== null) {
          clearTimeout(timeoutId as number)
        }
        setTimeoutId(null)
        return
      }

      // create a new timeout that calls itself recursively
      const id = setTimeout(() => {
        startTimeout(newSpeed, newNumberOfItems, newSelectionMethod)
      }, newSpeed * 1000) as unknown as number

      if (timeoutId !== null) {
        clearTimeout(timeoutId as number)
      }
      setTimeoutId(id)
    },
    [currentFiles, selectionMethod, timeoutId, updateHistory]
  )

  const stopTimeout = useCallback((): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId as number)
    }
    setTimeoutId(null)
  }, [timeoutId])

  const handlePlayPause = useCallback((): void => {
    let action = true

    if (timeoutId !== null) {
      stopTimeout()
      // setShowLeft(false);

      action = false
    } else {
      startTimeout(speed, columns * rows, selectionMethod)
    }

    messageApi.open({
      type: 'info',
      content: action ? 'Playing..' : 'Pausing..',
      duration: 2
    })
  }, [columns, messageApi, rows, selectionMethod, speed, startTimeout, stopTimeout, timeoutId])

  const handleFileClick = useCallback(
    (fdata: File): void => {
      const numberOfItems = columns * rows

      // if paused
      const items = nextNFromIndex(currentFiles, chosenFiles, numberOfItems, fdata.fpath)

      const addToHistory: Array<File> = []

      setChosenFiles((prevChosenFiles: Array<File>) => {
        let nonLockedIndex = 0
        const newCF = prevChosenFiles.map((file) => {
          if (!file.locked) {
            const v = items[nonLockedIndex]
            nonLockedIndex += 1

            if (v !== undefined) {
              file.selected = false
              addToHistory.push(file)
              return v
            }
            return {
              fpath: '',
              basename: '',
              ext: '',
              selected: false,
              locked: false
            }
          }
          return file
        })

        // Add leftover items to newCF
        while (nonLockedIndex < items.length) {
          newCF.push(items[nonLockedIndex])
          nonLockedIndex += 1
        }

        return newCF.slice(0, numberOfItems)
      })

      updateHistory(addToHistory)
    },

    [chosenFiles, columns, currentFiles, messageApi, rows, updateHistory]
  )

  const handleNext = Throttle(() => {
    console.log('handleNext')

    startTimeout(speed, columns * rows, selectionMethod, timeoutId === null)

    messageApi.open({
      type: 'success',
      content: 'Next',
      duration: 2
    })
  }, 500)

  const handlePrev = Throttle(() => {
    console.log('handlePrev')

    if (history.length === 0) {
      messageApi.open({
        type: 'warning',
        content: 'No more previous items',
        duration: 2
      })

      return
    }

    setChosenFiles((prevChosenFiles) => {
      const nonLockedFiles = chosenFiles.filter((file) => !file.locked)
      const nonLockedCount = nonLockedFiles.length

      const newFiles = history.slice(-nonLockedCount)

      setHistory((prev) => {
        const newHistory = prev.slice(0, -nonLockedCount)
        // console.log(
        //  'newHistory after prev:',
        //  newHistory.map((f) => f.basename)
        // );
        return newHistory
      })

      let nonLockedIndex = 0
      return prevChosenFiles.map((file) => {
        if (!file.locked) {
          if (nonLockedIndex === newFiles.length) {
            return {
              fpath: '',
              basename: '',
              ext: 'jpg',
              locked: false,
              selected: false
            }
          }

          const newFile = newFiles[nonLockedIndex]
          nonLockedIndex += 1

          // console.log(`
          // switching ${file.basename} to ${newFile.basename}
          // `);

          return newFile
        }
        return file
      })
    })

    messageApi.open({
      type: 'success',
      content: 'Prev',
      duration: 2
    })
  }, 500)

  const handleFileSwap = useCallback((index: number, target: number): void => {
    setChosenFiles((prev) => {
      const newArray = [...prev]

      newArray[index] = prev[target]
      newArray[target] = prev[index]

      return newArray
    })
  }, [])

  const handleSpeedChange = useCallback(
    (value: number): void => {
      if (Number.isNaN(value) || value < 3) {
        messageApi.open({
          type: 'error',
          content: `${value} is not a number greater than 3.`,
          duration: 3
        })

        return
      }

      console.log(`
    hadling speed change: new speed is ${value}
    `)

      setSpeed(() => value)
      startTimeout(value, columns * rows, selectionMethod)

      messageApi.open({
        type: 'success',
        content: `Transition speed changed to ${value} seconds.`,
        duration: 3
      })
    },
    [columns, messageApi, rows, selectionMethod, startTimeout]
  )

  const handleColumnChange = useCallback(
    (value: number) => {
      stopTimeout()
      setColumns(() => value)
      startTimeout(speed, value * rows, selectionMethod)

      messageApi.open({
        type: 'success',
        content: `Number of columns changed to ${value}.`,
        duration: 3
      })
    },
    [messageApi, rows, selectionMethod, speed, startTimeout, stopTimeout]
  )

  const handleRowChange = useCallback(
    (value: number) => {
      stopTimeout()
      setRows(() => value)
      startTimeout(speed, columns * value, selectionMethod)

      messageApi.open({
        type: 'success',
        content: `Number of rows changed to ${value}.`,
        duration: 3
      })
    },
    [columns, messageApi, selectionMethod, speed, startTimeout, stopTimeout]
  )

  const handleSelectionMethodChange = useCallback(
    (value: string) => {
      console.log(`
    handling selection Method change: new selection method is ${value}
    `)
      stopTimeout()
      setSelectionMethod(() => value)
      startTimeout(speed, columns * rows, value)

      messageApi.open({
        type: 'success',
        content: `Selection method changed to ${value}. Press play to continue.`,
        duration: 3
      })
    },
    [columns, messageApi, rows, speed, startTimeout, stopTimeout]
  )

  /* useEffect related funcs */
  const updateRecentPaths = useCallback((fPath: string) => {
    window.eAPI.addToRecentPaths(fPath).catch((err) => {
      const emsg = `
            Error: API : updating recent paths

            Failed to update recent paths when viewing a folder.

            ${err}

            `

      console.log(E(emsg))
    })
  }, [])

  const getFilePathsFromDirectory = useCallback((path: string) => {
    window.eAPI
      .getDirFilePaths(path)
      .then((result: File[]) => {
        setCurrentFiles(() => result)
        return result // Return the result
      })
      .catch((err) => {
        const emsg = `
        Error : API : getFilePathsFromDirectory

        Failed to read files in the directory path ${path}.

        ${err}

        `

        console.log(E(emsg))
      })
  }, [])

  const handleSelectedImagesToggle = (filePath: string) => {
    const index = chosenFiles.findIndex((f) => f.fpath === filePath)

    chosenFiles[index].selected = !chosenFiles[index].selected

    setChosenFiles([...chosenFiles])

    console.log('new chosen files after selection toggle:', chosenFiles)
  }

  const handleLockedImagesToggle = (filePath: string) => {
    const index = chosenFiles.findIndex((f) => f.fpath === filePath)

    chosenFiles[index].locked = !chosenFiles[index].locked

    setChosenFiles([...chosenFiles])

    console.log('new chosen files after locked toggle:', chosenFiles)
  }

  const refreshFiles = (cfiles: File[] | undefined) => {
    if (selectedFolder !== null) {
      getFilePathsFromDirectory(selectedFolder)

      if (cfiles !== undefined) {
        setChosenFiles(cfiles)
      } else {
        setChosenFiles([])
      }
    }

    messageApi.open({
      type: 'success',
      content: 'Refreshed files',
      duration: 4
    })
  }

  const handleUndoHistory = () => {
    console.log('handle undo')

    if (undoHistory.length === 0) {
      messageApi.open({
        type: 'warning',
        content: `Nothing found to undo.`,
        duration: 3
      })

      return
    }

    const lastUndo = undoHistory[0]

    window.eAPI
      .undoRecentMoves(lastUndo)
      .then(() => {
        let undos: UndoHistoryItem[] = []

        setUndoHistory((prev: UndoHistoryItem[][]) => {
          let result: UndoHistoryItem[][]
          ;[undos, ...result] = prev

          return result
        })

        undos.forEach((undo) => {
          messageApi.open({
            type: 'success',
            content: `Moved ${undo.basename} back from ${undo.folder} to the current folder.`,
            duration: 3
          })
        })

        refreshFiles([...chosenFiles])

        return null // Return null if there's no meaningful value to return
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const moveFilesToDir = Throttle((folder: string) => {
    let baseDir: string

    if (selectedFolder !== null) {
      baseDir = selectedFolder
    } else {
      return
    }

    const unlockedFiles = chosenFiles.filter((f) => !f.locked)

    const selectedFiles = unlockedFiles.filter((f) => f.selected).map((f) => f.basename)

    const finalFiles =
      selectedFiles.length > 0
        ? selectedFiles
        : unlockedFiles.filter((f) => f.basename !== '').map((f) => f.basename)

    setUndoHistory((prev: UndoHistoryItem[][]): UndoHistoryItem[][] => {
      const newUndoHistory: UndoHistoryItem[] = finalFiles.map((f) => {
        return {
          basename: f,
          baseDir: baseDir || '',
          folder
        }
      })

      const result: UndoHistoryItem[][] = [newUndoHistory, ...prev].slice(0, 100)

      console.log('final undoHistory', result)

      return result
    })

    window.eAPI
      .moveFilesToDir(finalFiles, baseDir, folder)
      .then(() => {
        finalFiles.forEach((f) => {
          messageApi.open({
            type: 'success',
            content: `Moved ${f} to ${folder}.`,
            duration: 3
          })
        })

        const newCurrentFiles = currentFiles.filter((f) => !finalFiles.includes(f.basename))
        setCurrentFiles(newCurrentFiles)

        const items: File[] = (funcToUse as { [key: string]: Function })[selectionMethod](
          newCurrentFiles,
          chosenFiles,
          columns * rows
        )

        let newChosenFiles: File[] = []

        let nonSelectedIndex = 0 // Initialize index outside map function

        if (selectedFiles.length > 0) {
          newChosenFiles = chosenFiles.map((file: File) => {
            if (file.selected) {
              nonSelectedIndex += 1
              const v = items[nonSelectedIndex]
              if (v !== undefined) {
                return v
              }
              return {
                fpath: '',
                basename: '',
                ext: 'jpg',
                selected: false,
                locked: false
              }
            }
            return file
          })
        } else {
          newChosenFiles = chosenFiles.map((file: File) => {
            if (file.locked) {
              return file
            }
            nonSelectedIndex += 1
            const v = items[nonSelectedIndex]
            if (v !== undefined) {
              return v
            }
            return {
              fpath: '',
              basename: '',
              ext: 'jpg',
              selected: false,
              locked: false
            }
          })
        }

        setChosenFiles(newChosenFiles)

        return null
      })
      .catch((error) => {
        console.log(`
      ERROR:

      ${error}
    `)
        // Throw the error to propagate it further
        throw error
      })
  }, 500)

  const handleEditToggle = () => {
    messageApi.open({
      type: 'warning',
      content: `This feature is currently not enabled.`,
      duration: 3
    })
  }

  function selectDirectory() {
    window.eAPI
      .openFileBrowser()
      .then((result) => {
        if (result === undefined) {
          console.log('canceled opening file directory via filebrowser')
        } else {
          console.log('directory input', result)

          updateRecentPaths(result.fpath)

          setSelectedFolder(result.fpath)
        }
        return null
      })
      .catch((err) => {
        const emsg = `
          Error: API : openFileBrowser

          Failed to choose a directory in the file browser.

          ${err}

          `
        console.log(E(emsg))
      })
  }

  async function openDirectory(fpath: string | null) {
    if (fpath === null) {
      return
    }

    try {
      window.eAPI.openDirectory(fpath, '')

      console.log('Directory opened:', fpath)

      messageApi.open({
        type: 'success',
        content: `opening folder...`,
        duration: 2
      })
    } catch (error) {
      console.error('Error opening directory:', error)
      const msg = `
        Error : API : openDirectory
        Failed to open the directory ${fpath}
        ${error}
      `
      console.error(msg)
    }
  }

  /* useEffects */

  useEffect(() => {
    if (selectedFolder !== null) {
      updateRecentPaths(selectedFolder)
      getFilePathsFromDirectory(selectedFolder)
    }
  }, [selectedFolder])

  useEffect(() => {
    if (currentFiles === null || currentFiles.length === 0 || chosenFiles.length > 0) {
      // Early return
      return
    }

    startTimeout(speed, columns * rows, selectionMethod)

    // Return a function for cleanup
    // eslint-disable-next-line consistent-return
    return () => {
      stopTimeout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFiles])

  useEffect(() => {
    let mouseTimeoutId: ReturnType<typeof setTimeout> | undefined

    const handleMouseActivity = () => {
      setIsVisible(true)

      if (mouseTimeoutId) {
        clearTimeout(mouseTimeoutId)
      }

      mouseTimeoutId = setTimeout(() => {
        setIsVisible(false)
      }, mouseInactiveThreshold * 1000)
    }

    document.addEventListener('mousemove', handleMouseActivity)

    return () => {
      document.removeEventListener('mousemove', handleMouseActivity)
      if (mouseTimeoutId) {
        clearTimeout(mouseTimeoutId)
      }
    }
  }, [])

  // useEffect(() => {
  //  function handleKeyPress(event) {
  //    if (event.key === 'ArrowRight') {
  //      handleNext();
  //    } else if (event.key === 'ArrowLeft') {
  //      handlePrev();
  //    }
  //  }

  //  document.addEventListener('keydown', handleKeyPress);

  //  return () => {
  //    document.removeEventListener('keydown', handleKeyPress);
  //  };
  // }, []);

  const exitFolder = (): void => {
    setSelectedFolder(null)

    setShowLeft(true)
    setShowProgressBar(true)
    setShowFilesList(true)
    setEditing(false)

    stopTimeout() // important to call clearTimeout
    setCurrentFiles([])
    setChosenFiles([])

    setHistory([])
    setUndoHistory([])

    setSpeed(5)

    setColumns(3)
    setRows(1)

    setFolders(['loved', 'liked', 'mid', 'disliked', 'hated'])
  }

  const contextValue = useMemo(
    () => ({
      messageApi,
      messageContextHolder,

      selectedFolder,
      setSelectedFolder,
      exitFolder,

      selectedFile,
      setSelectedFile,

      selectDirectory,
      openDirectory,

      showLeft,
      setShowLeft,

      showProgressBar,
      setShowProgressBar,

      showFilesList,
      setShowFilesList,

      editing,
      setEditing,

      timeoutId,
      setTimeoutId,

      currentFiles,
      setCurrentFiles,

      chosenFiles,
      setChosenFiles,

      isVisible,
      setIsVisible,

      mouseInactiveThreshold,

      timeoutIdRef,
      chosenFilesRef,

      history,
      setHistory,

      undoHistory,
      setUndoHistory,

      speed,
      setSpeed,

      selectionMethod,
      setSelectionMethod,

      columns,
      setColumns,

      rows,
      setRows,

      folders,
      setFolders,

      Throttle,
      updateHistory,

      startTimeout,
      stopTimeout,
      handlePlayPause,
      handleFileClick,
      handleNext,
      handlePrev,

      handleFileSwap,

      handleSpeedChange,
      handleColumnChange,
      handleRowChange,
      handleSelectionMethodChange,
      handleLockedImagesToggle,
      updateRecentPaths,
      getFilePathsFromDirectory,
      handleSelectedImagesToggle,

      handleUndoHistory,
      moveFilesToDir,
      handleEditToggle,
      refreshFiles
    }),
    [
      messageApi,
      messageContextHolder,

      selectedFolder,
      setSelectedFolder,
      exitFolder,

      selectedFile,
      setSelectedFile,

      selectDirectory,
      openDirectory,

      showLeft,
      setShowLeft,

      showProgressBar,
      setShowProgressBar,

      showFilesList,
      setShowFilesList,

      editing,
      setEditing,

      timeoutId,
      setTimeoutId,

      currentFiles,
      setCurrentFiles,

      chosenFiles,
      setChosenFiles,

      isVisible,
      setIsVisible,

      mouseInactiveThreshold,

      timeoutIdRef,
      chosenFilesRef,

      history,
      setHistory,

      undoHistory,
      setUndoHistory,

      speed,
      setSpeed,

      selectionMethod,
      setSelectionMethod,

      columns,
      setColumns,

      rows,
      setRows,

      folders,
      setFolders,

      updateHistory,

      startTimeout,
      stopTimeout,
      handlePlayPause,
      handleFileClick,
      handleNext,
      handlePrev,

      handleFileSwap,

      handleSpeedChange,
      handleColumnChange,
      handleRowChange,
      handleSelectionMethodChange,
      handleLockedImagesToggle,
      updateRecentPaths,
      getFilePathsFromDirectory,
      handleSelectedImagesToggle,

      handleUndoHistory,
      moveFilesToDir,
      handleEditToggle,
      refreshFiles
    ]
  )

  return <FolderContext.Provider value={contextValue}>{children}</FolderContext.Provider>
}

export const useFolderContext = () => {
  return useContext(FolderContext)
}
