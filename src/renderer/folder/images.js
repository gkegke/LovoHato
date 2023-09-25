import { useState, useEffect, useRef } from 'react';

import { Button, Space, Switch, Select } from 'antd';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import ReactPlayer from 'react-player';

import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  SelectOutlined,
  RollbackOutlined,
  SettingOutlined,
  PauseOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlaySquareOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  UndoOutlined,
  HeartOutlined,
  LikeOutlined,
  DislikeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

function Video({
  isVisible,
  darkMode,
  showDetails,
  rows,
  columns,
  index,
  file,
  paused,
  handlePlayPause,
  selectedImages,
  handleImagesShiftLeft,
  handleImagesShiftRight,
  handleImagesShiftUp,
  handleImagesShiftDown,
  handleSelectedImagesToggle,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (!paused) {
      handlePlayPause();
    }

    if (expanded) {
      setExpanded(false);
      return
    }

    handleSelectedImagesToggle(file.fpath);

  };

  return (
    <div className="group relative h-full w-full overflow-hidden">

        <div
          className={`${
            expanded
              ? 'fixed top-0 left-0 z-50 bg-black overflow-y-scroll overflow-x-hidden bg-black'
              : ' overflow-hidden'
          } h-full w-full flex justify-center items-center ${
            file.selected && (darkMode ? 'bg-gray-800 rounded' : 'bg-gray-100 rounded')
          }`}
        >
        <ReactPlayer
          url={`atom://${file.fpath}`}
          playing
          muted
          loop
          onClick={(e) => e.stopPropagation()}
          controls
          width={"100%"}
          height={"100%"}
        />
      </div>

      <div
        className={`${
          isVisible ? 'opacity-80 visible' : 'opacity-0 invisible'
        } ${
          expanded ? 'fixed' : 'absolute'
        } flex z-50 top-2 left-0 invisible group-hover:visible`}
      >

      <div className='flex'>
      <button
       className={`${
        expanded ? 'hidden' : ''
       } ${
        file.selected ? 'bg-green-500' : 'bg-gray-800 hover:bg-blue-500'
       } midmid h-8 y-1 px-2 ml-2 text-white rounded`}
       onClick={handleClick}
      >
        <SelectOutlined />
      </button>

      <button
       className={`midmid h-8 py-1 px-2 ml-2 bg-gray-800 hover:bg-blue-500 text-white rounded`}
        onClick={() => setExpanded(!expanded)}
      >
        <FullscreenExitOutlined />
      </button>
</div>

      <span
        className={`${
        expanded ? 'hidden' : ''
        } break-all text-xs ease hover:text-base p-1`}
      >{file.basename}</span>


</div>

      {paused && (
        <>
          <button
            className={`absolute p-1 px-2 rounded left-4 top-1/2 opacity-70 hover:opacity-100 hover:bg-blue-500 hover:text-white ${
              darkMode ? 'bg-black text-white' : 'bg-white text-gray-700'
            } invisible group-hover:visible`}
            onClick={() => handleImagesShiftLeft(index)}
          >
            <ArrowLeftOutlined />
          </button>
          <button
            className={`absolute p-1 px-2 rounded right-4 top-1/2 opacity-70 hover:opacity-100 hover:bg-blue-500 hover:text-white ${
              darkMode ? 'bg-black text-white' : 'bg-white text-gray-700'
            } invisible group-hover:visible`}
            onClick={() => handleImagesShiftRight(index)}
          >
            <ArrowRightOutlined />
          </button>
          <button
            className={`absolute p-1 px-2 rounded left-1/2 top-1/4 opacity-70 hover:opacity-100 hover:bg-blue-500 hover:text-white ${
              darkMode ? 'bg-black text-white' : 'bg-white text-gray-700'
            } invisible group-hover:visible`}
            onClick={() => handleImagesShiftUp(index)}
          >
            <ArrowUpOutlined />
          </button>
          <button
            className={`absolute p-1 px-2 rounded left-1/2 bottom-1/4 opacity-70 hover:opacity-100 hover:bg-blue-500 hover:text-white ${
              darkMode ? 'bg-black text-white' : 'bg-white text-gray-700'
            } invisible group-hover:visible`}
            onClick={() => handleImagesShiftDown(index)}
          >
            <ArrowDownOutlined />
          </button>
        </>
      )}

</div>
  );
}

function Image({
  isVisible,
  darkMode,
  showDetails,
  index,
  file,
  paused,
  handlePlayPause,
  handleImagesShiftLeft,
  handleImagesShiftRight,
  handleImagesShiftUp,
  handleImagesShiftDown,
  handleSelectedImagesToggle,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (!paused) {
      handlePlayPause();
    }

    if (expanded) {
      setExpanded(false);
      return
    }

    handleSelectedImagesToggle(file.fpath);

  };


  return (
    <div className="group relative h-full w-full overflow-hidden">

        <div
          className={`${
            expanded
              ? 'fixed top-0 left-0 z-50 bg-black overflow-y-scroll overflow-x-hidden bg-black'
              : ' overflow-hidden'
          } h-full w-full flex justify-center items-center ${
            file.selected && (darkMode ? 'bg-gray-800 rounded' : 'bg-gray-100 rounded')
          }`}
          onClick={handleClick}
        >
          <img
            className={`${
              expanded
                ? ''
                : 'group-hover:rotate-3 group-hover:scale-125 max-h-full max-w-full'
            } p-1 transition duration-300 ease-in-out`}
            src={`atom://${file.fpath}`}
          />
        </div>

      <div
        className={`${
          isVisible ? 'opacity-80 visible' : 'opacity-0 invisible'
        } ${
          expanded ? 'fixed' : 'absolute'
        } flex z-50 top-2 left-0 invisible group-hover:visible`}
      >

      <div className='flex'>
      <button
       className={`${
        expanded ? 'hidden' : ''
       } ${
        file.selected ? 'bg-green-500' : 'bg-gray-800 hover:bg-blue-500'
       } midmid h-8 y-1 px-2 ml-2 text-white rounded`}
       onClick={handleClick}
      >
        <SelectOutlined />
      </button>

      <button
       className={`midmid h-8 py-1 px-2 ml-2 bg-gray-800 hover:bg-blue-500 text-white rounded`}
        onClick={() => setExpanded(!expanded)}
      >
        <FullscreenExitOutlined />
      </button>
</div>

      <span
        className={`${
        expanded ? 'hidden' : ''
        } break-all text-xs ease hover:text-base p-1`}
      >{file.basename}</span>

</div>

        {paused && (
          <>
            <button
              className={`midmid absolute p-2 rounded left-4 top-1/2 opacity-70 hover:opacity-100 hover:bg-blue-500 hover:text-white ${
                darkMode ? 'bg-black text-white' : 'bg-white text-gray-700'
              } invisible group-hover:visible`}
              onClick={() => handleImagesShiftLeft(index)}
            >
              <ArrowLeftOutlined />
            </button>
            <button
              className={`midmid absolute p-2 rounded right-4 top-1/2 opacity-70 hover:opacity-100 hover:bg-blue-500 hover:text-white ${
                darkMode ? 'bg-black text-white' : 'bg-white text-gray-700'
              } invisible group-hover:visible`}
              onClick={() => handleImagesShiftRight(index)}
            >
              <ArrowRightOutlined />
            </button>
            <button
              className={`midmid absolute p-2 rounded left-1/2 top-4 opacity-70 hover:opacity-100 hover:bg-blue-500 hover:text-white ${
                darkMode ? 'bg-black text-white' : 'bg-white text-gray-700'
              } invisible group-hover:visible`}
              onClick={() => handleImagesShiftUp(index)}
            >
              <ArrowUpOutlined />
            </button>
            <button
              className={`midmid absolute p-2 rounded left-1/2 bottom-8 opacity-70 hover:opacity-100 hover:bg-blue-500 hover:text-white ${
                darkMode ? 'bg-black text-white' : 'bg-white text-gray-700'
              } invisible group-hover:visible`}
              onClick={() => handleImagesShiftDown(index)}
            >
              <ArrowDownOutlined />
            </button>
          </>
        )}
    </div>
  );
}

export default function Images({
  isVisible,
  darkMode,
  showDetails,
  images,
  columns,
  rows,
  paused,
  handlePlayPause,
  selectedImages,
  handleSelectedImagesToggle,
  handleImagesShiftLeft,
  handleImagesShiftRight,
  handleImagesShiftUp,
  handleImagesShiftDown,
}) {
  const gridStyle = paused
    ? showDetails
      ? {
          gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
        }
      : {
          gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
          gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`,
        }
    : {
        gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
        gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`,
      };

  const videoExtensions = [
    '.mp4',
    '.webm',
    '.mov',
    '.ogg',
    '.mkv',
    '.flv',
    '.wmv',
  ];

  return (
    <div style={gridStyle} className="grid h-screen">
      {images.map((f, index) => {
        if (f.basename === '') {
          return '';
        }

        // check if the file extension is a video format
        const isVideo = videoExtensions.includes(f.ext);
        // return an img or a ReactPlayer component depending on the file type

        return (
          <div key={index} className="midmid">
            {isVideo ? (
              <Video
                isVisible={isVisible}
                darkMode={darkMode}
                showDetails={showDetails}
                rows={rows}
                columns={columns}
                index={index}
                file={f}
                paused={paused}
                handlePlayPause={handlePlayPause}
                selectedImages={selectedImages}
                handleSelectedImagesToggle={handleSelectedImagesToggle}
                handleImagesShiftLeft={handleImagesShiftLeft}
                handleImagesShiftRight={handleImagesShiftRight}
                handleImagesShiftUp={handleImagesShiftUp}
                handleImagesShiftDown={handleImagesShiftDown}
              />
            ) : (
              <Image
                isVisible={isVisible}
                darkMode={darkMode}
                showDetails={showDetails}
                rows={rows}
                columns={columns}
                index={index}
                file={f}
                paused={paused}
                handlePlayPause={handlePlayPause}
                selectedImages={selectedImages}
                handleSelectedImagesToggle={handleSelectedImagesToggle}
                handleImagesShiftLeft={handleImagesShiftLeft}
                handleImagesShiftRight={handleImagesShiftRight}
                handleImagesShiftUp={handleImagesShiftUp}
                handleImagesShiftDown={handleImagesShiftDown}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
