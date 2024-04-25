import { useState, useEffect, useRef } from 'react';

import ReactPlayer from 'react-player';

import { FolderContextValue, File } from '../types';

import { useFolderContext } from './folderContext';

function CurrentlyHoveredItem(fname: string) {

  // get the file extension from the fname
  const ext = fname.split('.').pop()?.toLowerCase();

  if (ext === undefined) return null

  // check if the file extension is a video format
  const isVideo = [
    'mp4',
    'webm',
    'ogg',
    'mov',
    'avi',
    'mkv',
    'flv',
    'wmv',
  ].includes(ext);
  // return an img or a ReactPlayer component depending on the file type
  if (isVideo) {
    return (
      <ReactPlayer
        className="mb-2 rounded"
        url={fname}
        playing={false}
        muted
      />
    );
  }

  return <img className="mb-2" src={fname} />;
}

function RightFile({
  chosen,
  selected,
  index,
  fdata,
  handleFileClick,
  currentHoverPath,
  setCurrentHoverPath,
}: {
  chosen: boolean;
  selected: boolean;
  index: number;
  fdata: File;
  handleFileClick: (fdata: File) => void;
  currentHoverPath: (File | null);
  setCurrentHoverPath: React.Dispatch<React.SetStateAction<File | null>>
}) {
  const [clicked, setClicked] = useState(false);

  const fileRef = useRef<HTMLButtonElement | null>(null); // Create a ref for the File component

  useEffect(() => {
    if (fileRef.current !== null && clicked) {
      fileRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [clicked]);

  const handleClick = () => {
    handleFileClick(fdata);
    setClicked(true);
  };

  const handleMouseEnter = () => {
    setCurrentHoverPath(fdata);
  };

  const handleMouseLeave = () => {
    setCurrentHoverPath(null);
  };

  return (
    <>
      <button
        ref={fileRef}
        className={`my-1 group hover:bg-blue-500 rounded hover:text-white w-full flex justify-start items-center px-1 py-2 opacity-80 ${
          selected
            ? 'bg-white text-black'
            : chosen
            ? 'bg-white text-black'
            : 'text-white'
        }`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter} // Add the mouse enter event handler
        onMouseLeave={handleMouseLeave} // Add the mouse leave event handler
      >
        <div className={`px-1 mr-2 text-xs ${chosen ? '' : ''}`}>{index}</div>
        <div className="break-all text-sm text-left">{fdata.basename}</div>
      </button>

      {currentHoverPath && fdata && currentHoverPath.fpath === fdata.fpath && (
        <div className="w-80 flex justify-start items-start">
          {CurrentlyHoveredItem(currentHoverPath.fpath)}
        </div>
      )}
    </>
  );
}

export default function RightFiles() {
  const { selectedFolder, showFilesList } =
    useFolderContext() as FolderContextValue;

  return selectedFolder && showFilesList && <RightFilesContent />;
}

function RightFilesContent() {
  const {
    isVisible,
    currentFiles,
    chosenFiles,
    handleFileClick,

    selectedFile,
  } = useFolderContext() as FolderContextValue;

  const [currentHoverPath, setCurrentHoverPath] = useState<File | null>(null);
  const fileNameInput = useRef<HTMLInputElement | null>(null);
  const [filteredFiles, setFilteredFiles] = useState(currentFiles);

  const handleFileClickRefresh = (fdata: File) => {
    if (fileNameInput.current !== null) {
      handleFileClick(fdata);
      fileNameInput.current.value = '';
      setFilteredFiles([...currentFiles]);
    }
  };

  const handleFilter = () => {
    if (fileNameInput.current !== null) {
      const { value } = fileNameInput.current;

      setFilteredFiles((_) =>
        currentFiles.filter((f) => f.basename.includes(value))
      );
    }
  };

  useEffect(() => {
    setFilteredFiles([...currentFiles]);
  }, [currentFiles]);

  return (
    <div
      className={`flex scroll fixed z-50 top-0 right-0 rounded-l-lg scale-75 hover:scale-100 hover:rounded-none translate-x-60 hover:translate-x-0 hover:opacity-100 ease p-2 h-screen bg-black opacity-80 overflow-y-scroll overflow-x-hidden ${
        isVisible ? 'opacity-80' : 'opacity-0 invisible'
      } ${currentHoverPath ? 'w-80' : 'w-80'} ${selectedFile && 'hidden'}`}
    >
      <div className="">
        <div className="flex w-full ml-1 justify-center items-center">
          <input
            className="bg-black border-b-2 border-gray-200 mx-2 mb-2 px-2 py-1 w-4/5 text-gray-200"
            type="text"
            ref={fileNameInput}
            placeholder="🔍 ...."
            onChange={handleFilter}
          />
          <div className="text-xs text-gray-400">
            {currentFiles.length}/{filteredFiles.length}
          </div>
        </div>
        {filteredFiles.map((f, i) => {
          return (
            <RightFile
              key={f.fpath}
              chosen={chosenFiles.some((cf) => cf.basename === f.basename)}
              selected={chosenFiles.some(
                (cf) => cf.basename === f.basename && cf.selected === true
              )}
              index={i + 1}
              fdata={f}
              handleFileClick={handleFileClickRefresh}
              currentHoverPath={currentHoverPath}
              setCurrentHoverPath={setCurrentHoverPath}
            />
          );
        })}
        <div className="h-80" />
      </div>
    </div>
  );
}
