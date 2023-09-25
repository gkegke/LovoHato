import { useState, useEffect, useRef } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Button, Space, Switch, Select } from 'antd';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import {
  MenuOutlined,
  RollbackOutlined,
  SettingOutlined,
  PauseOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlaySquareOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  UndoOutlined,
} from '@ant-design/icons';

import E from '../common/errors.js';
import ProgressBar from 'renderer/common/progressBar.js';

import Left from './left.js';
import RightFiles from './rightFiles.js';
import Right from './right.js';


import { randomChoice, nextN, nextNFromIndex } from '../common/utils.js';

import './folder.css';

const funcToUse = {
  Randomized: randomChoice,
  Ordered: nextN,
};

export default function Folder() {
  const [showLeft, setShowLeft] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const [editing, setEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [chosenFiles, setChosenFiles] = useState([]);

  const [isVisible, setIsVisible] = useState(true);
  const mouseInactiveThreshold = 5;

  const timeoutIdRef = useRef(timeoutId);
  timeoutIdRef.current = timeoutId;
  const chosenFilesRef = useRef(chosenFiles);
  chosenFilesRef.current = chosenFiles;

  const [history, setHistory] = useState([]);
  const [undoHistory, setUndoHistory] = useState([]);

  const [speed, setSpeed] = useState(3);
  const [selectionMethod, setSelectionMethod] = useState('Ordered');
  // const [selectionMethod, setSelectionMethod] = useState('Randomized');
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(1);
  const speedInputRef = useRef(null);

  const [pausedDetailsHelpClicked, setPausedDetailsHelpClicked] = useState(false);
  const [pausedPlayHelpClicked, setPausedPlayHelpClicked] = useState(false);

  const [folders, setFolders] = useState([
    'loved',
    'liked',
    'mid',
    'disliked',
    'hated',
  ]);

  const { state } = useLocation();

  const throttle = (func, delay) => {
    let timeout;
    return (...args) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          func(...args);
          timeout = null;
        }, delay);
      }
    };
  };

  const updateHistory = (files) => {
    setHistory((prev) => {
      const safeFiles = files.filter((f) => f.basename !== '');
      const newHistory = [...prev, ...safeFiles].slice(-100);

      //console.log(
      //  'newHistory',
      //  newHistory.map((f) => f.basename)
      //);

      return newHistory;
    });
  };

  const startTimeout = (
    speed,
    numberOfItems,
    selectionMethod,
    stopper = false
  ) => {
    console.log('staringTimeout');

    // first call
    if (chosenFilesRef.current.length === 0) {
      //console.log(
      //  'first time',
      //  currentFiles.map((f) => f.basename)
      //);
      setChosenFiles(() => {
        let result;

        if (numberOfItems < currentFiles.length) {
          // console.log(`${numberOfItems} < ${currentFiles.length}`);

          result = [...currentFiles.slice(0, numberOfItems)];
        } else {
          // console.log(1234)

          const vs = [...currentFiles.slice(0, numberOfItems)];
          const padding = Array(numberOfItems - currentFiles.length).fill({
            fpath: '',
            basename: '',
            ext: '',
            selected: false,
          });

          result = [...vs, ...padding];
        }

        //console.log(
        //  'chosenFiles',
        //  result.map((f) => f.basename)
        //);

        return result;
      });
    } else {
      //console.log(
      //  'nth time',
      //  selectionMethod,
      //  currentFiles.map((f) => f.basename)
      //);

      const items = funcToUse[selectionMethod](
        currentFiles,
        chosenFilesRef.current,
        numberOfItems
      );

      //console.log(
      //  'items',
      //  items.map((f) => f.basename)
      //);

      const addToHistory = [];

      setChosenFiles((prevChosenFiles) => {
        let nonSelectedIndex = 0;
        const newCF = prevChosenFiles.map((file) => {
          if (!file.selected) {
            const v = items[nonSelectedIndex];
            nonSelectedIndex++;

            if (v !== undefined) {
              addToHistory.push(file);
              return v;
            }
            return {
              fpath: '',
              basename: '',
              ext: '',
              selected: false,
            };
          }
          return file;
        });

        //console.log(
        //  'newChosenFiles',
        //  newCF.map((f) => f.basename)
        //);

        // Add leftover items to newCF
        while (nonSelectedIndex < items.length) {
          newCF.push(items[nonSelectedIndex]);
          nonSelectedIndex++;
        }

        //console.log(
        //  'newChosenFiles2',
        //  newCF.map((f) => f.basename)
        //);
        //console.log(`need ${numberOfItems}, have ${newCF.length}`);

        return newCF.slice(0, numberOfItems);
      });

      updateHistory(addToHistory);
    }

    if (stopper === true) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
      return;
    }
    // create a new timeout that calls itself recursively
    const id = setTimeout(() => {
      startTimeout(speed, numberOfItems, selectionMethod);
    }, speed * 1000);

    clearTimeout(timeoutId);
    setTimeoutId(id);
  };

  const stopTimeout = () => {
    clearTimeout(timeoutId);
    setTimeoutId(null);
  };

  const handlePlayPause = () => {
    if (timeoutId !== null) {
      stopTimeout();
      setShowLeft(false);
      enqueueSnackbar(`Pausing.`, {
        variant: 'success',
      });
    } else {
      startTimeout(speed, columns * rows, selectionMethod);

      enqueueSnackbar(`Playing.`, {
        variant: 'success',
      });
    }
  };

  const handleFileClick = (fdata) => {
    const numberOfItems = columns * rows;

    // if paused
    const items = nextNFromIndex(
      currentFiles,
      chosenFiles,
      numberOfItems,
      fdata.fpath
    );

    const addToHistory = [];

    setChosenFiles((prevChosenFiles) => {
      console.log(
        'prevChosenFiles',
        prevChosenFiles.map((f) => f.basename)
      );
      console.log(
        'items',
        items.map((f) => f.basename)
      );
      let nonSelectedIndex = 0;
      const newCF = prevChosenFiles.map((file) => {
        if (!file.selected) {
          const v = items[nonSelectedIndex];
          console.log('v', items[nonSelectedIndex]);
          nonSelectedIndex++;

          if (v !== undefined) {
            addToHistory.push(file);
            return v;
          }
          return {
            fpath: '',
            basename: '',
            ext: '',
            selected: false,
          };
        }
        console.log('file not selected');
        return file;
      });

      console.log(
        'newChosenFiles',
        newCF.map((f) => f.basename)
      );

      return newCF.slice(0, numberOfItems);
    });

    updateHistory(addToHistory);

    enqueueSnackbar(`Starting from chosen file. Method: ${selectionMethod}`, {
      variant: 'success',
    });
  };

  const handleNext = throttle(() => {
    console.log('handleNext');

    startTimeout(speed, columns * rows, selectionMethod, timeoutId === null);

    enqueueSnackbar(`Next`, {
      variant: 'success',
    });
  }, 500);

  const handlePrev = throttle(() => {
    console.log('handlePrev');

    if (history.length === 0) {
      enqueueSnackbar(`No more previous items`, {
        variant: 'warning',
      });
      return;
    }

    setChosenFiles((prevChosenFiles) => {
      const nonSelectedFiles = chosenFiles.filter((file) => !file.selected);
      const nonSelectedCount = nonSelectedFiles.length;

      const newFiles = history.slice(-nonSelectedCount);

      setHistory((prev) => {
        const newHistory = prev.slice(0, -nonSelectedCount);
        //console.log(
        //  'newHistory after prev:',
        //  newHistory.map((f) => f.basename)
        //);
        return newHistory;
      });

      let nonSelectedIndex = 0;
      return prevChosenFiles.map((file) => {
        if (!file.selected) {
          if (nonSelectedIndex === newFiles.length) {
            return {
              fpath: '',
              basename: '',
              ext: 'jpg',
              selected: false,
            };
          }

          const newFile = newFiles[nonSelectedIndex];
          nonSelectedIndex++;

          //console.log(`
          //switching ${file.basename} to ${newFile.basename}
          //`);

          return newFile;
        }
        return file;
      });
    });

    enqueueSnackbar(`Previous`, {
      variant: 'success',
    });
  }, 500);

const handleImagesShiftLeft = (index) => {
  setChosenFiles((prev) => {
    const newArray = [...prev]; // Create a copy of the original array
    if (index > 0 && index < newArray.length) {
      const itemToShift = newArray[index];
      newArray.splice(index, 1); // Remove the item at the given index
      newArray.splice(index - 1, 0, itemToShift); // Insert the item one position to the left
    }
    return newArray; // Return the modified array
  });
};

const handleImagesShiftRight = (index) => {
  setChosenFiles((prev) => {
    const newArray = [...prev]; // Create a copy of the original array
    if (index >= 0 && index < newArray.length - 1) {
      const itemToShift = newArray[index];
      newArray.splice(index, 1); // Remove the item at the given index
      newArray.splice(index + 1, 0, itemToShift); // Insert the item one position to the right
    }
    return newArray; // Return the modified array
  });
};

const handleImagesShiftUp = (index) => {
  setChosenFiles((prev) => {
    const newArray = [...prev]; // Create a copy of the original array
    if (index >= rows) {
      const itemToShift = newArray[index];
      newArray.splice(index, 1); // Remove the item at the given index
      newArray.splice(index - columns, 0, itemToShift); // Insert the item up by 'rows' positions
    }
    return newArray; // Return the modified array
  });
};

const handleImagesShiftDown = (index) => {
  setChosenFiles((prev) => {
    const newArray = [...prev]; // Create a copy of the original array
    if (index < newArray.length - rows) {
      const itemToShift = newArray[index];
      newArray.splice(index, 1); // Remove the item at the given index
      newArray.splice(index + columns, 0, itemToShift); // Insert the item down by 'rows' positions
    }
    return newArray; // Return the modified array
  });
};


  const handleSpeedChange = () => {
    const value = parseInt(speedInputRef.current.value);

    if (Number.isNaN(value) || value < 3) {
      enqueueSnackbar(
        `${speedInputRef.current.value} is not a number greater than 3.`,
        {
          variant: 'warning',
        }
      );
      return;
    }

    console.log(`
    hadling speed change: new speed is ${value}
    `);

    setSpeed(() => value);
    startTimeout(value, columns * rows, selectionMethod);

    enqueueSnackbar(`Transition speed changed to ${value} seconds.`, {
      variant: 'success',
    });
  };

  const handleColumnChange = (value) => {
    stopTimeout();
    setColumns(() => value);
    startTimeout(speed, value * rows, selectionMethod);

    enqueueSnackbar(`Number of columns changed to ${value}.`, {
      variant: 'success',
    });
  };

  const handleRowChange = (value) => {
    stopTimeout();
    setRows(() => value);
    startTimeout(speed, columns * value, selectionMethod);

    enqueueSnackbar(`Number of rows changed to ${value}.`, {
      variant: 'success',
    });
  };

  const handleSelectionMethodChange = (value) => {
    console.log(`
    handling selection Method change: new selection method is ${value}
    `);
    stopTimeout();
    setSelectionMethod(() => value);
    startTimeout(speed, columns * rows, value);

    enqueueSnackbar(`Selection method changed to ${value}.`, {
      variant: 'success',
    });
  };

  const handleFilesListToggle = () => {
    enqueueSnackbar(`${showFiles ? 'Hiding' : 'Showing'} file list.`, {
      variant: 'success',
    });

    setShowFiles(!showFiles);
  };

  /* useEffect related funcs */
  function updateRecentPaths(pathData) {
    electron.eAPI.addToRecentPaths(pathData.fpath).catch((err) => {
      const emsg = `
            Error: API : updating recent paths

            Failed to update recent paths when viewing a folder.

            ${err}

            `;

      console.log(E(emsg));
    });
  }

  function getFilePathsFromDirectory(path) {
    console.log('getting files', path);

    electron.eAPI
      .getDirFilePaths(path)
      .then((result) => {
        console.log('getDirFilePaths', result.length);

        setCurrentFiles(() => result);
      })
      .catch((err) => {
        const emsg = `
          Error : API : getFilePathsFromDirectory

          Failed to read files in the directory path ${path}.

          ${err}

          `;

        console.log(E(emsg));
      });
  }

  const handleSelectedImagesToggle = (filePath) => {
    const index = chosenFiles.findIndex((f) => f.fpath === filePath);

    chosenFiles[index].selected = !chosenFiles[index].selected;

    setChosenFiles([...chosenFiles]);
  };

  const handleUndoHistory = () => {
    console.log('handle undo');

    if (undoHistory.length === 0) {
      enqueueSnackbar(`Nothing found to undo.`, {
        variant: 'warning',
      });

      return;
    }

    const lastUndo = undoHistory[0];

    electron.eAPI
      .undoRecentMoves(lastUndo)
      .then(() => {
        console.log('done undo');

        let undos = [];

        setUndoHistory((prev) => {
          console.log('prevUndoHistory', prev);

          undos = prev[0];

          const result = prev.slice(1)
          console.log('prevUndoHistory', result);
          return result;
        });

        for (let undo of undos) {
          enqueueSnackbar(`Moved ${undo.basename} back from ${undo.folder} to the current folder.`, {
            variant: 'success',
            autoHideDuration: 4000,
          });
        }

        refreshFiles([...chosenFiles]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const moveFilesToDir = throttle((folder) => {
    const baseDir = state.fpath;
    const selectedFiles = chosenFiles
      .filter((f) => f.selected)
      .map((f) => f.basename);
    const finalFiles =
      selectedFiles.length > 0
        ? selectedFiles
        : chosenFiles.filter((f) => f.basename !== '').map((f) => f.basename);

    setUndoHistory((prev) => {
      const newUndoHistory = finalFiles.map((f) => {
        return {
          basename: f,
          baseDir,
          folder,
        };
      });

      console.log('adding undoHistory', newUndoHistory.map((f) => f.basename));

      const result = [newUndoHistory, ...prev].slice(0, 100);

      console.log('final undoHistory', result);

      return result;
    });

    electron.eAPI
      .moveFilesToDir(finalFiles, baseDir, folder)
      .then((r) => {
        for (let f of finalFiles) {
          enqueueSnackbar(`Moved ${f} to ${folder}`, {
            variant: 'success',
          });
        }

        console.log(
          'currentFiles',
          currentFiles.map((f) => f.basename)
        );

        const newCurrentFiles = currentFiles.filter(
          (f) => !finalFiles.includes(f.basename)
        );
        setCurrentFiles(newCurrentFiles);

        console.log(
          'newCurrentFiles',
          newCurrentFiles.map((f) => f.basename)
        );

        console.log(`
      ${finalFiles.length} files successfully moved.
      `);

        const items = funcToUse[selectionMethod](
          newCurrentFiles,
          chosenFiles,
          columns * rows
        );

        let newChosenFiles = [];

        if (selectedFiles.length > 0) {
          let nonSelectedIndex = 0;

          newChosenFiles = chosenFiles.map((file) => {
            if (file.selected) {
              const v = items[nonSelectedIndex++];
              if (v !== undefined) {
                return v;
              }
              return {
                fpath: '',
                basename: '',
                ext: 'jpg',
                selected: false,
              };
            }
            return file;
          });
        } else {
          let nonSelectedIndex = 0;

          newChosenFiles = chosenFiles.map((file) => {
            const v = items[nonSelectedIndex++];
            if (v !== undefined) {
              return v;
            }
            return {
              fpath: '',
              basename: '',
              ext: 'jpg',
              selected: false,
            };
          });
        }

        console.log(
          'items',
          items.map((f) => f.basename)
        );
        console.log(
          'chosenFiles',
          chosenFiles.map((f) => f.basename)
        );
        console.log(
          'newChosenFiles',
          newChosenFiles.map((f) => f.basename)
        );

        setChosenFiles(newChosenFiles);

      })
      .catch((error) => {
        console.log(`
        ERROR:

        ${error}
        `);
      });
  });

  const handleEditToggle = () => {
    enqueueSnackbar(`This feature is currently not enabled.`, {
      variant: 'warning',
    });
  };

  const refreshFiles = (cfiles) => {
    getFilePathsFromDirectory(state.fpath);

    console.log('cfiles', cfiles);

    if (cfiles !== undefined) {
      console.log(
        'cfiles',
        cfiles.map((f) => f.basename)
      );
      setChosenFiles(cfiles);
    } else {
      console.log('cfiles', []);
      setChosenFiles([]);
    }

    enqueueSnackbar(`Refreshed files.`, {
      variant: 'success',
    });
  };

  useEffect(() => {
    updateRecentPaths(state);
    getFilePathsFromDirectory(state.fpath);
  }, [state]);

  useEffect(() => {
    if (
      currentFiles === null ||
      currentFiles.length === 0 ||
      chosenFiles.length > 0
    ) {
      return;
    }

    startTimeout(speed, columns * rows, selectionMethod);
    return stopTimeout;
  }, [currentFiles]);

  useEffect(() => {
    let mouseTimeoutId;

    const handleMouseActivity = () => {
      setIsVisible(true);

      if (mouseTimeoutId) {
        clearTimeout(mouseTimeoutId);
      }

      mouseTimeoutId = setTimeout(() => {
        setIsVisible(false);
      }, mouseInactiveThreshold * 1000);
    };

    document.addEventListener('mousemove', handleMouseActivity);

    return () => {
      document.removeEventListener('mousemove', handleMouseActivity);
      if (mouseTimeoutId) {
        clearTimeout(mouseTimeoutId);
      }
    };
  }, []);

  return (
    <>
      <SnackbarProvider autoHideDuration={2000} />
      {
        showProgressBar && <ProgressBar timeoutId={timeoutId} speed={speed} />
      }
      <div className="flex overflow-hidden">
        {showLeft && (
          <Left
            isVisible={isVisible}
            timeoutId={timeoutId}
            state={state}
            showLeft={showLeft}
            setShowLeft={setShowLeft}
            showFiles={showFiles}
            setShowFiles={setShowFiles}
          editing={editing}
          setEditing={setEditing}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
            showProgressBar={showProgressBar}
            setShowProgressBar={setShowProgressBar}
            currentFiles={currentFiles}
            chosenFiles={chosenFiles}
            speedInputRef={speedInputRef}
            selectionMethod={selectionMethod}
            columns={columns}
            rows={rows}
            speed={speed}
            folders={folders}
            setFolders={setFolders}
            refreshFiles={refreshFiles}
            handleFilesListToggle={handleFilesListToggle}
          handlePlayPause={handlePlayPause}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleUndo={handleUndoHistory}
          handleEditToggle={handleEditToggle}
            handleSelectionMethodChange={handleSelectionMethodChange}
            handleRowChange={handleRowChange}
            handleColumnChange={handleColumnChange}
            handleSpeedChange={handleSpeedChange}
            handleFileClick={handleFileClick}
            stopTimeout={stopTimeout}
          />
        )}

        <Right
          isVisible={isVisible}
          showLeft={showLeft}
          setShowLeft={setShowLeft}
          showFiles={showFiles}
          setShowFiles={setShowFiles}
          editing={editing}
          setEditing={setEditing}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          pausedDetailsHelpClicked={pausedDetailsHelpClicked}
          setPausedDetailsHelpClicked={setPausedDetailsHelpClicked}
          pausedPlayHelpClicked={pausedPlayHelpClicked}
          setPausedPlayHelpClicked={setPausedPlayHelpClicked}
            folders={folders}
            setFolders={setFolders}
          chosenFiles={chosenFiles}
          timeoutId={timeoutId}
          images={chosenFiles}
          columns={columns}
          rows={rows}
          stopTimeout={stopTimeout}
          paused={timeoutId === null}
          handleFilesListToggle={handleFilesListToggle}
          handlePlayPause={handlePlayPause}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleUndo={handleUndoHistory}
          handleEditToggle={handleEditToggle}
          handleImagesShiftLeft={handleImagesShiftLeft}
          handleImagesShiftRight={handleImagesShiftRight}
          handleImagesShiftUp={handleImagesShiftUp}
          handleImagesShiftDown={handleImagesShiftDown}
          handleSelectedImagesToggle={handleSelectedImagesToggle}
          moveFilesToDir={moveFilesToDir}
        />

        {showFiles && (
          <RightFiles
            isVisible={isVisible}
            currentFiles={currentFiles}
            chosenFiles={chosenFiles}
            handleFileClick={handleFileClick}
          />
        )}
      </div>


    </>
  );
}
