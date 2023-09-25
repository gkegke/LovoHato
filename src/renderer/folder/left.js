import { useState, useEffect, useRef } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Button, Space, Switch, Select } from 'antd';

import {
  EditOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SettingOutlined,
  RollbackOutlined,
  MenuOutlined,
  FileImageOutlined,
  FolderOutlined,
  HeartOutlined,
  DeleteOutlined,
  HomeOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  OrderedListOutlined,
  PlayCircleOutlined,
  PauseOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  UndoOutlined,
} from '@ant-design/icons';

import { enqueueSnackbar } from 'notistack';
import Options from './options.js';
import LeftFiles from './rightFiles.js';

function Logo({ showLeft, setShowLeft, stopTimeout }) {
  return (
    <div className="flex w-40 text-lg mx-1 mb-2 justify-between items-center rounded-t font-bold">
      <button
        className="midmid hover:bg-black hover:text-white rounded"
        onClick={() => setShowLeft(false)}
      >
        <MenuOutlined className="text-lg px-2 py-1" />
      </button>
      <Link id="home" to="/" onClick={stopTimeout}>
        <div className="group flex flex-col rounded ease">
          <div className="midmid group">
            <span className="text-blue-500">Lovo</span>
            <span className="midmid group-hover:animate-bounce duration-300 ease-in-out infinite">
              <HeartOutlined className="text-pink-500" />
            </span>
            <span>Hato</span>
            <span className="midmid group-hover:animate-bounce duration-300 ease-in-out infinite">
              <DeleteOutlined className="text-green-700" />
            </span>
          </div>
          <div className="text-white group-hover:text-gray-700 text-xs font-light flex justify-end">
            <RollbackOutlined className="mr-1" />
            home
          </div>
        </div>
      </Link>
    </div>
  );
}

function MenuButton({ icon, text, selected, onClick }) {
  return (
    <button
      className={`rounded ease group text-lg midmid p-2 border-black hover:bg-blue-500 hover:text-white hover:border-blue-500 ${
        selected ? 'bg-black text-white' : ''
      }`}
      onClick={onClick}
    >
      <span className="group-hover:animate-bounce mr-2 justify-center items-center flex">
        {icon}
      </span>
      <span className="text-sm">{text}</span>
    </button>
  );
}

function RightMenu({
  showLeft,
  setShowLeft,
  showFiles,
  setShowFiles,
  darkMode,
  setDarkMode,
  editing,
  setEditing,
  timeoutId,
  handleFilesListToggle,
  handlePlayPause,
  handlePrev,
  handleNext,
  handleUndo,
  handleEditToggle,
}) {
  return (
    <div className="mx-2 mb-2 border-0 z-40 rounded justify-center items-center overflow-hidden">
      {showLeft && (
        <>
          <MenuButton
            icon={timeoutId ? <PauseOutlined /> : <PlayCircleOutlined />}
            text={timeoutId ? 'Pause' : 'Play'}
            onClick={() => handlePlayPause()}
          />
          <MenuButton
            icon={<StepBackwardOutlined />}
            text={"Previous"}
            onClick={() => handlePrev()}
          />
          <MenuButton
            icon={<StepForwardOutlined />}
            text={"Next"}
            onClick={() => handleNext()}
          />
          <MenuButton
            icon={<UndoOutlined />}
            text={"Undo Last Move"}
            onClick={() => handleUndo()}
          />
          <MenuButton
            icon={<EditOutlined />}
            text={"Start Edit Mode"}
            onClick={handleEditToggle}
          />
          <MenuButton
            icon={            <div className="midmid">
            <div className="w-3 h-6 bg-black border border-black" />
            <div className="w-3 h-6 bg-white border border-black" />
            </div>}
            text={darkMode ? 'Light Mode' : 'Dark Mode'}
            onClick={() => setDarkMode(!darkMode)}
          />
       </>
      )}
    </div>
  );
}

export default function Left({
  isVisible,
  timeoutId,
  state,
  showLeft,
  setShowLeft,
  showFiles,
  setShowFiles,
  editing,
  setEditing,
  darkMode,
  setDarkMode,
  showProgressBar,
  setShowProgressBar,
  currentFiles,
  chosenFiles,
  speedInputRef,
  selectionInputRef,
  selectionMethod,
  columns,
  rows,
  speed,
  folders,
  setFolders,
  refreshFiles,
  handleFilesListToggle,
  handlePlayPause,
  handlePrev,
  handleNext,
  handleUndo,
  handleEditToggle,
  handleSelectionMethodChange,
  handleRowChange,
  handleColumnChange,
  handleSpeedChange,
  stopTimeout,
}) {
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
    <div className={`shadow drop-shadow bg-white w-48 shrink-0 scale-75 rounded-r hover:scale-100 hover:rounded-none -translate-x-28 hover:translate-x-0 ease overflow-y-hidden hover:overflow-y-scroll overflow-x-hidden h-screen fixed left-0 top-0 z-50 hover:opacity-100 ${
      isVisible ? 'opacity-80 visible' : 'opacity-0 invisible'
    }`}>
      <div className="mt-4">
        <Logo
          showLeft={showLeft}
          setShowLeft={setShowLeft}
          stopTimeout={stopTimeout}
        />
      </div>

      <button
        className="w-11/12 text-gray-700 hover:bg-blue-500 hover:text-white group p-2 flex flex-col mx-2 mb-2 rounded ease"
        onClick={() => openDirectory()}
      >
        <div className="group-hover:animate-bounce w-full text-white text-xs font-semibold text-right">
          open folder
        </div>
        <div className="midmid justify-between w-full">
          <div className="text-xs flex items-center ">
            {currentFiles.length} files in <FolderOutlined className="ml-1" />
          </div>
        </div>
        <div className="font-semibold break-all text-left">
          {state.basename}
        </div>
      </button>

      <button
        className="group midmid w-11/12 text-gray-700 hover:bg-blue-500 hover:text-white group p-2 flex  mx-2 mb-2 rounded ease"
        onClick={() => refreshFiles()}
      >
        <SyncOutlined className="mr-2 group-hover:animate-spin" />
        <div className="flex flex-col">
          <span>Refresh</span>
          <span className="text-xs text-left">folder</span>
        </div>
      </button>

      <button
        className="group midmid w-11/12 text-gray-700 hover:bg-blue-500 hover:text-white group p-2 flex  mx-2 mb-2 rounded ease"
        onClick={() => setShowProgressBar(!showProgressBar)}
      >
        <ClockCircleOutlined className="mr-2 group-hover:animate-spin" />
        <div className="flex flex-col">
          <span className="text-xs text-left">
            {showProgressBar ? 'Hide' : 'Show'}
          </span>
          <span>Progress Bar</span>
        </div>
      </button>

      <button
        className="group midmid w-11/12 text-gray-700 hover:bg-blue-500 hover:text-white group p-2 flex  mx-2 mb-2 rounded ease"
        onClick={handleFilesListToggle}
      >
        <OrderedListOutlined className="mr-2 group-hover:animate-spin" />
        <div className="flex flex-col">
          <span className="text-xs text-left">
            {showFiles ? 'Hide' : 'Show'}
          </span>
          <span>File List</span>
        </div>
      </button>

      <RightMenu
        timeoutId={timeoutId}
        showLeft={showLeft}
        setShowLeft={setShowLeft}
        showFiles={showFiles}
        setShowFiles={setShowFiles}
        editing={editing}
        setEditing={setEditing}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        handleFilesListToggle={handleFilesListToggle}
        handlePlayPause={handlePlayPause}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleUndo={handleUndo}
        handleEditToggle={handleEditToggle}
      />

      <Options
        openDirectory={openDirectory}
        state={state}
        speedInputRef={speedInputRef}
        selectionInputRef={selectionInputRef}
        selectionMethod={selectionMethod}
        columns={columns}
        rows={rows}
        speed={speed}
        folders={folders}
        setFolders={setFolders}
        handleSelectionMethodChange={handleSelectionMethodChange}
        handleRowChange={handleRowChange}
        handleColumnChange={handleColumnChange}
        handleSpeedChange={handleSpeedChange}
      />
    </div>
  );
}
