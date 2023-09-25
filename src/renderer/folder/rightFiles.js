import { useState, useEffect, useRef } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Button, Space, Switch, Select } from 'antd';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import ReactPlayer from 'react-player';

import {
  EditOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SettingOutlined,
  RollbackOutlined,
  MenuOutlined,
  FileImageOutlined,
  HeartOutlined,
  DeleteOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { PlayArrowOutlined } from '@mui/icons-material';

function File({
  chosen,
  selected,
  index,
  fdata,
  basename,
  handleFileClick,
  setCurrentHoverPath,
}) {
  const [clicked, setClicked] = useState(false);

  const fileRef = useRef(null); // Create a ref for the File component

  useEffect(() => {
    if (clicked) {
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
    <button
      ref={fileRef}
      className={`my-1 group hover:bg-blue-500 rounded hover:text-white w-full flex justify-start items-center px-1 py-2 opacity-80 ${
        selected
          ? 'bg-black text-white' : chosen ? 'bg-black text-white' : 'text-gray-800'
        }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter} // Add the mouse enter event handler
      onMouseLeave={handleMouseLeave} // Add the mouse leave event handler
    >
      <div className={`px-1 mr-2 text-xs ${
        chosen ? '' : ''
      }`}>{index}</div>
      <div className="break-all text-sm text-left">{fdata.basename}</div>

    </button>
  )

}



export default function RightFiles({
  isVisible,
  currentFiles,
  chosenFiles,
  handleFileClick,
}) {

  const [currentHoverPath, setCurrentHoverPath] = useState(null);
  const fileNameInput = useRef(null);
  const [filteredFiles, setFilteredFiles] = useState(currentFiles);

  const handleFileClickRefresh = (fpath) => {

    handleFileClick(fpath);
    fileNameInput.current.value = "";
    setFilteredFiles([...currentFiles]);

  }

  const handleFilter = () => {

    const value = fileNameInput.current.value;

    setFilteredFiles((prev) => currentFiles.filter((f) => f.basename.startsWith(value)));

  }

  useEffect(() => {

    setFilteredFiles([...currentFiles]);

  }, [currentFiles]);

  const videoExtensions = [
            '.mp4',
            '.webm',
            '.mov',
            '.ogg',
            '.mkv',
            '.flv',
            '.wmv',
  ];

  return (<>
      <div className={`drop-shadow shadow fixed z-40 top-0 right-0 scale-75 rounded-l-md hover:scale-100 hover:rounded-none translate-x-60 hover:translate-x-0 hover:opacity-100 ease p-2 w-80 h-screen bg-white opacity-80 border-0 border-gray-300 overflow-y-scroll overflow-x-hidden ${
        isVisible ? 'opacity-80' : 'opacity-0 invisible'
      }`}>

        <div className="w-full ml-1 midmid">
          <div className="flex flex-col justify-center items-center text-gray-400">
            <SearchOutlined className="" />
            <div className="text-xs">{currentFiles.length}/{filteredFiles.length}</div>
          </div>
          <input
          className="border-b-2 border-gray-400 m-2 px-2 py-1 w-4/5 text-gray-800"
            type="text"
            ref={fileNameInput}
            placeholder="quick search.."
            onChange={handleFilter}
          />
        </div>
        {filteredFiles.map((f, i) => {
        return (<File
          key={f.fpath}
          chosen={chosenFiles.some((cf) => cf.basename === f.basename)}
          selected={chosenFiles.some((cf) => cf.basename === f.basename && cf.selected === true)}
          index={i + 1}
          fdata={f}
          handleFileClick={handleFileClickRefresh}
          setCurrentHoverPath={setCurrentHoverPath}
        />)
        })}
        <div className="h-80"></div>
        <div className="h-20"></div>

      </div>
      <div className="fixed bottom-48 right-8 w-48 rounded-l z-50">
      {currentHoverPath !== null &&  !videoExtensions.includes(currentHoverPath.ext) && (
        <img src={`atom://${currentHoverPath.fpath}`} className="" />
      )}
    </div>

    </>
  );
}
