import { useState, useEffect, useRef } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Upload, Button, Space, Switch, Select } from 'antd';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import {
  MoreOutlined,
  EditOutlined,
  UploadOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SettingOutlined,
  RollbackOutlined,
  MenuOutlined,
  FileImageOutlined,
  HeartOutlined,
  DeleteOutlined,
  HomeOutlined,
  PlayCircleOutlined,
  PauseOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  UndoOutlined,
  LikeOutlined,
  DislikeOutlined,
  LoadingOutlined,
  OrderedListOutlined,
  FolderOutlined,
} from '@ant-design/icons';

import Images from './images';

function MenuButton({ icon, selected, onClick, darkMode }) {
  return (
    <button
      className={`text-xl midmid p-2 border-black hover:bg-blue-500 hover:text-white hover:border-blue-500 ${
        selected ? 'bg-black text-white' : ''
      } ${
        darkMode ? 'text-white' : 'text-black'
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

function GroupButton({ icon, text, onClick, darkMode }) {
  return (
    <button
      className={`border midmid rounded px-2 py-1 my-2 mr-2 ${
        darkMode
          ? 'bg-black border-white text-white hover:bg-blue-500 hover:text-white hover:border-blue-500'
          : 'bg-white border-black text-black hover:bg-blue-500 hover:text-white hover:border-blue-500'
      }`}
      onClick={onClick}
    >
      <span className="text-sm">{text}</span>
    </button>
  );
}

function RightMenu({
  isVisible,
  showLeft,
  setShowLeft,
  showFiles,
  setShowFiles,
  darkMode,
  setDarkMode,
  editing,
  setEditing,
  pausedPlayHelpClicked,
  setPausedPlayHelpClicked,
  timeoutId,
  handleFilesListToggle,
  handlePlayPause,
  handlePrev,
  handleNext,
  handleUndo,
  handleEditToggle,
}) {


  return (
    <div className={`z-50 hover:z-50 absolute top-1/4 left-2 hover:opacity-100 mx-2 mb-2 border-0 z-40 rounded justify-center items-center ${
      isVisible ? 'opacity-80 visible' : 'opacity-0 invisible'
    } ${
      darkMode ? 'bg-black' : 'bg-white'
    }`}>

      {!showLeft && (
        <MenuButton icon={<MenuOutlined />} onClick={() => setShowLeft(true)} darkMode={darkMode}/>
      )}

      <MenuButton
        icon={<OrderedListOutlined />}
        selected={showFiles}
        onClick={handleFilesListToggle}
 darkMode={darkMode}
      />

      <div className="relative">
        <MenuButton
          icon={timeoutId ? <PauseOutlined /> : <PlayCircleOutlined />}
          onClick={() => {
            handlePlayPause();
            setPausedPlayHelpClicked(true);
          }}
          darkMode={darkMode}
        />
        {!pausedPlayHelpClicked && (
          <div className="absolute inline left-12 top-0 transform -translate-y-10 bg-gray-500 text-white p-2 rounded-md opacity-90 flex items-center">
  Click PLAY to exit pause
</div>

        )}
      </div>

      <MenuButton
        icon={<StepBackwardOutlined />}
        onClick={() => handlePrev()}
 darkMode={darkMode}
      />
      <MenuButton icon={<StepForwardOutlined />} onClick={() => handleNext()} darkMode={darkMode} />
      <MenuButton icon={<UndoOutlined />} onClick={() => handleUndo()} darkMode={darkMode} />
      <MenuButton icon={<EditOutlined />} onClick={handleEditToggle} darkMode={darkMode} />

    </div>
  );
}

function EditOptionButton({
  editing,
  index,
  folderName,
  folders,
  setFolders,
  onClick,
  openDirectory,
}) {
  const [start, setStart] = useState(false);
  const [removing, setRemoving] = useState(false);
  const inputRef = useRef(null);


  const handleChange = () => {
    const newName = inputRef.current.value;

    if (newName === '') {
      enqueueSnackbar(`Folder name cannot be empty.`, {
        variant: 'warning',
      });
      return;
    }

    if (folders.includes(newName)) {
      enqueueSnackbar(`There is already a ${newName} folder.`, {
        variant: 'warning',
      });
      return;
    }

    setFolders((prev) => {
      const items = [...prev];
      items[index] = newName;

      return items;
    });

    enqueueSnackbar(`Changed ${folderName} to ${newName}.`, {
      variant: 'success',
    });
  };

  const handleDelete = () => {
    setFolders((prev) => {
      const items = [...prev];
      items.splice(index, 1);

      inputRef.current.value = '';

      return items;
    });

    const items = document.querySelectorAll('.edit-folder-input');

    items.forEach((i) => {
      i.value = '';
    });

    enqueueSnackbar(`Removed the folder ${folderName} from the folder list.`, {
      variant: 'success',
    });
  };

  const shiftLeft = () => {
    if (folders.length <= 1 || index === 0) {
      return;
    }

    setFolders((prev) => {
      const items = [...prev];

      const temp = items[index];

      items[index] = items[index - 1];
      items[index - 1] = temp;

      return items;
    });

    enqueueSnackbar(`Moved ${folderName} position up.`, {
      variant: 'success',
    });
  };

  const shiftRight = () => {
    if (folders.length <= 1 || index === folders.length - 1) {
      return;
    }

    setFolders((prev) => {
      const items = [...prev];

      const temp = items[index];

      items[index] = items[index + 1];
      items[index + 1] = temp;

      return items;
    });

    enqueueSnackbar(`Moved ${folderName} position down.`, {
      variant: 'success',
    });
  };

  return (
    <div className="flex flex-col mt-2">
      <div className={`ease my-1 mr-1 p-2 rounded font-medium hover:bg-blue-500 text-white ${
        start ? 'bg-blue-500' : ''
      }`}>
        <button
          className="midmid text-lg mt-1 h-full w-full"
          onClick={() => setStart(!start)}
        >
          <span className="font-semibold mr-3 p-2 bg-white text-gray-700 rounded">
            {index + 1}
          </span>
          <FolderOutlined className="mr-2" />
          {folderName}
        </button>
     </div>
        {start && (
          <div className="">
            <div className="">
              <input
                className="edit-folder-input border-b-2 border-gray-700 bg-black my-1 p-2"
                ref={inputRef}
                type="text"
                defaultValue=""
                placeholder="change folder name to"
              />
            </div>
            <div className="flex flex-wrap mt-2 mb-1 text-sm">
              <button
                className="mr-2 py-1 px-2 midmid border border-white text-white rounded hover:border-blue-500 hover:text-blue-500"
                onClick={handleChange}
              >
                save
              </button>

              <button
                className="mr-2 py-1 px-2 midmid border border-white text-white rounded hover:border-blue-500 hover:text-blue-500"
                onClick={shiftLeft}
              >
                <ArrowLeftOutlined />
              </button>
              <button
                className="mr-2 py-1 px-2 midmid border border-white text-white rounded hover:border-blue-500 hover:text-blue-500"
                onClick={shiftRight}
              >
                <ArrowRightOutlined />
              </button>
              <button
                className={`mr-2 py-1 px-2 midmid border border-white text-white rounded hover:border-red-500 hover:text-red-500 ${
                  removing ? 'hidden' : ''
                }`}
                onClick={() => setRemoving(true)}
              >
                <DeleteOutlined />
              </button>
            </div>
            <div
              className={`${
                removing ? 'text-white mt-3 pb-2 border-b border-gray-300' : 'hidden'
              }`}
            >
              Are you sure you want to remove this folder?
              <button
                className="ml-2 m-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded"
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className="m-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded"
                onClick={() => setRemoving(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

    </div>
  );
}

export default function Right({
  isVisible,
  showLeft,
  setShowLeft,
  showFiles,
  setShowFiles,
  editing,
  setEditing,
  darkMode,
  setDarkMode,
  pausedDetailsHelpClicked,
  setPausedDetailsHelpClicked,
  pausedPlayHelpClicked,
  setPausedPlayHelpClicked,
  folders,
  setFolders,
  chosenFiles,
  timeoutId,
  images,
  columns,
  rows,
  stopTimeout,
  selectedImages,
  handleSelectedImagesToggle,
  paused,
  handleFilesListToggle,
  handlePlayPause,
  handlePrev,
  handleNext,
  handleUndo,
  handleEditToggle,
  handleImagesShiftLeft,
  handleImagesShiftRight,
  handleImagesShiftUp,
  handleImagesShiftDown,
  moveFilesToDir,
}) {

 const addInputRef = useRef(null);

  const handleAdd = () => {
    const { value } = addInputRef.current;

    if (value === '') {
      enqueueSnackbar(`Folder name must not be empty`, {
        variant: 'warning',
      });

      return;
    }

    setFolders((prev) => [...prev, value]);

    enqueueSnackbar(`Added ${value} to folder options`, {
      variant: 'success',
    });

    addInputRef.current.value = '';
  };

  function openDirectory(folderName) {
    console.log('opening directory...');

    electron.eAPI
      .openDirectory(state.fpath, folderName)
      .then(() => {
        console.log('should have opened dir');

        enqueueSnackbar(`Opening folder: ${folderName || state.fpath}`, {
          variant: 'success',
        });
      })
      .catch((err) => {
        const emsg = `
          Error : API : openDirectory

          Failed to open the directory ${state.fpath} : ${folderName}

          ${err}
          `;
      });
  }

  return (
    <div
      className={`w-full relative overflow-y-scroll oveflow-x-hidden lh h-screen ${
        darkMode ? 'bg-black' : 'bg-white'
      }`}
    >
      {!showLeft && (
        <RightMenu
          isVisible={isVisible}
          timeoutId={timeoutId}
          showLeft={showLeft}
          setShowLeft={setShowLeft}
          showFiles={showFiles}
          setShowFiles={setShowFiles}
          editing={editing}
          setEditing={setEditing}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          pausedPlayHelpClicked={pausedPlayHelpClicked}
          setPausedPlayHelpClicked={setPausedPlayHelpClicked}
          handleFilesListToggle={handleFilesListToggle}
          handlePlayPause={handlePlayPause}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleUndo={handleUndo}
          handleEditToggle={handleEditToggle}
        />
      )}

      {timeoutId === null && chosenFiles.length > 0 && (
        <div className="midmid justify-center items-center flex-wrap py-1 px-2 m-3 opacity-80 hover:opacity-100">

          <span
            className={`mr-2 text-sm ${darkMode ? 'text-white' : 'text-black'}`}
          >
            MOVE{' '}
            {!chosenFiles.some((f) => f.selected) ? (
              <span className="font-bold text-blue-500">
                ALL {chosenFiles.filter((f) => f.basename !== '').length}
              </span>
            ) : (
              <span className="font-bold text-green-500">
                {chosenFiles.filter((f) => f.selected).length} SELECTED
              </span>
            )}{' '}
            TO
          </span>
          {folders.map((f) => {
            return (
              <GroupButton
                key={f}
                text={f}
                darkMode={darkMode}
                onClick={() => moveFilesToDir(f)}
              />
            );
          })}
          <button
            className={`ease group text-gray-100 midmid rounded p-2 hover:bg-blue-500 ${
              editing ? 'bg-black' : 'bg-gray-700'
            }`}
            onClick={() => setEditing(!editing)}
          >
            <EditOutlined className="mr-1" />
            {editing ? (
              <span className="text-xs">Cancel</span>
            ) : (
              <div className="text-xs">Edit</div>
            )}
          </button>

        </div>

      )}

      {editing && (
        <div
          id="editing"
          className="bg-black rounded-md p-3 mx-20 mb-20 overflow-y-scroll z-50"
        >
          <div className="text-md text-white grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <p className="font-semibold py-3 px-2 bg-gradient-to-r from-blue-800 to-purple-800 rounded flex items-center text-center">
              These folders are found in the same folder as the images being
              processed.
            </p>
            <p className="font-semibold py-3 px-2 bg-gradient-to-br from-pink-500 to-red-800 rounded flex items-center text-center">
              Images are sent to the different folders, the aim to end up with a folder you know you love.
            </p>
            <p className="font-semibold py-3 px-2 bg-gradient-to-br from-blue-500 to-blue-800 rounded flex items-center text-center">
              It is easy to add and create a custom set of folders for
              whatever use case you have in mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            {folders.map((f, i) => {
              return (
                <div key={f}>
                  <EditOptionButton
                    openDirectory={openDirectory}
                    editing
                    index={i}
                    folderName={f}
                    onClick={openDirectory}
                    folders={folders}
                    setFolders={setFolders}
                    onClick={openDirectory}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-2 py-2 flex flex-col border-t">
            <p className="text-sm text-white">
              Add a new folder
            </p>
            <div className="flex">
            <input
              className="border-b-2 border-white bg-black p-1 text-white"
              type="text"
              placeholder="new folder name..."
              ref={addInputRef}
            />
            <button
              className="my-1 ml-2 p-1 px-2 bg-white text-black hover:bg-blue-500 hover:text-white rounded"
              onClick={handleAdd}
            >
              Add
            </button>
            </div>
          </div>
        </div>
      )}

      {images.length > 0 ? (
        <Images
          isVisible={isVisible}
          darkMode={darkMode}
          editing={editing}
          images={images}
          columns={columns}
          rows={rows}
          stopTimeout={stopTimeout}
          selectedImages={selectedImages}
          handleSelectedImagesToggle={handleSelectedImagesToggle}
          paused={timeoutId === null}
          handlePlayPause={handlePlayPause}
          handleImagesShiftLeft={handleImagesShiftLeft}
          handleImagesShiftRight={handleImagesShiftRight}
          handleImagesShiftUp={handleImagesShiftUp}
          handleImagesShiftDown={handleImagesShiftDown}
        />
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <LoadingOutlined
            style={{ fontSize: '70px' }}
            className="p-3 w-1/2 text-lg"
          />
          <div className="w-1/2 text-gray-700">
            if this is taking too long.. double check the folder you selected
            actually has files
          </div>
        </div>
      )}
    </div>
  );
}
