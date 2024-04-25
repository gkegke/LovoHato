import { useState } from 'react'

import ReactPlayer from 'react-player'

import { FullscreenOutlined, SelectOutlined, LockOutlined, TableOutlined } from '@ant-design/icons'

import { FolderContextValue } from '../types'
import { useFolderContext } from './folderContext'

import { File } from '../types';

function Image({ file, isVideo, paused, index, chosenFiles, showNumbers, setShowNumbers }: {
  file: File;
  isVideo: boolean;
  paused: boolean;
  index: number;
  chosenFiles: File[]
  showNumbers: boolean;
  setShowNumbers: (show: boolean) => void;
}) {
  const {
    isVisible,

    columns,
    setSelectedFile,

    handlePlayPause,
    handleLockedImagesToggle,
    handleSelectedImagesToggle,
    handleFileSwap
  } = useFolderContext() as FolderContextValue

  const [swapping, setSwapping] = useState(false)

  const handleClick = () => {
    if (!paused) {
      handlePlayPause()
    }

    handleSelectedImagesToggle(file.fpath)
  }

  const handleSwapClick = () => {
    setSwapping(!swapping)
    setShowNumbers(!showNumbers)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className={`bg-gray-500 text-white opacity-70 rounded px-2 ${
          showNumbers ? 'block' : 'hidden'
        }`}
      >
        {index + 1}
      </div>
      {swapping && (
        <div className=" p-1 w-full">
          <div className="p-1 text-gray-300">
            swap <span className="bg-gray-500 text-white opacity-70 rounded px-2">{index + 1}</span>{' '}
            with
          </div>
          <div className={`grid grid-cols-${columns} gap-1`}>
            {chosenFiles.map((_, cIndex) => {
              return index !== cIndex ? (
                <button
                  className="rounded bg-black text-white border border-gray-700 hover:bg-blue-500 hover:border-blue-600"
                  key={cIndex}
                  onClick={() => handleFileSwap(index, cIndex)}
                >
                  {cIndex + 1}
                </button>
              ) : null
            })}
          </div>
          <button
            onClick={handleSwapClick}
            className="flex justify-center items-center p-1 bg-blue-500 text-white my-1 rounded"
          >
            Cancel
          </button>
        </div>
      )}
      <div className="group relative h-full w-full overflow-hidden">
        <div
          className={`h-full overflow-hidden w-full flex justify-center items-center ${
            file.locked && 'bg-gray-800 rounded'
          } ${file.selected && 'border border-blue-500'} bg-black border border-black`}
          onClick={handleClick}
        >
          {isVideo ? (
            <ReactPlayer
              url={file.fpath}
              playing
              muted
              loop
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              controls
              width="100%"
              height="100%"
            />
          ) : (
            <img
              className="group-hover:rotate-3 group-hover:scale-125 max-h-full max-w-full p-1 transition duration-300 ease-in-out"
              src={file.fpath}
            />
          )}
        </div>

        <div
          className={`${
            isVisible ? 'opacity-80 visible' : 'opacity-0 invisible'
          } absolute z-50 top-2 left-0 invisible group-hover:visible`}
        >
          <div className="flex">
            <div className="flex">
              <button
                className={`flex justify-center items-center p-2 ml-2 hover:bg-blue-500 text-white rounded ${
                  file.locked ? 'bg-gray-300' : 'bg-gray-800'
                }`}
                onClick={() => handleLockedImagesToggle(file.fpath)}
              >
                <LockOutlined />
              </button>

              <button
                className={`${
                  file.selected ? 'bg-green-500' : 'bg-gray-800 hover:bg-blue-500'
                } flex justify-center items-center p-2 ml-2 text-white rounded`}
                onClick={handleClick}
              >
                <SelectOutlined />
              </button>

              <button
                className="flex justify-center items-center p-2 ml-2 bg-gray-800 hover:bg-blue-500 text-white rounded"
                onClick={() => setSelectedFile(file.fpath)}
              >
                <FullscreenOutlined />
              </button>

              <button
                className={`flex justify-center items-center p-2 ml-2 text-white rounded ${
                  !swapping ? 'bg-gray-800 hover:bg-blue-500' : 'bg-blue-500 hover:bg-gray-500'
                }`}
                onClick={handleSwapClick}
              >
                <TableOutlined />
              </button>
            </div>
          </div>

          <div className="text-white bg-black break-all text-xs p-1 mt-2 mx-2 opacity-80 rounded">
            {file.basename}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Images() {
  const {
    timeoutId,
    chosenFiles,
    columns,
    rows,

    selectedFile
  } = useFolderContext() as FolderContextValue

  const [showNumbers, setShowNumbers] = useState(false)

  const gridStyle =
    timeoutId === null
      ? {
          gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
          gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`
        }
      : {
          gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
          gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`
        }

  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.mkv', '.flv', '.wmv']

  return (
    <div style={gridStyle} className={`grid h-screen ${selectedFile && 'invisible'}`}>
      {chosenFiles.map((f, index) => {
        if (f.basename === '') {
          return ''
        }

        // check if the file extension is a video format
        const isVideo = videoExtensions.includes(f.ext)
        // return an img or a ReactPlayer component depending on the file type

        return (
          <Image
            key={index}
            file={f}
            isVideo={isVideo}
            paused={timeoutId === null}
            index={index}
            chosenFiles={chosenFiles}
            showNumbers={showNumbers}
            setShowNumbers={setShowNumbers}
          />
        )
      })}
    </div>
  )
}
