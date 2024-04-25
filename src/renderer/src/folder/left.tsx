import { Tooltip } from 'antd';

import {
  CloseOutlined,
  MenuOutlined,
  FolderOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';

import { FolderContextValue } from '../types';
import { useFolderContext } from './folderContext';
import Options from './options';

export default function Left(): JSX.Element {
  const { selectedFolder, showLeft, selectedFile } =
    useFolderContext() as FolderContextValue;

  return (
    <>
      {showLeft && selectedFolder !== null && selectedFile === null && (
        <LeftContent />
      )}
    </>
  );
}

function LeftContent() {
  const {
    isVisible,

    setShowLeft,
    exitFolder,
    openDirectory,
    refreshFiles,

    selectedFolder,

    showProgressBar,
    setShowProgressBar,
    showFilesList,
    setShowFilesList,
  } = useFolderContext() as FolderContextValue;

  return (
    <div
      className={`scroll bg-black w-48 hover:w-60 rounded-r hover:rounded-none ease overflow-y-hidden hover:overflow-y-scroll overflow-x-hidden h-screen z-50 hover:opacity-100 ${
        isVisible ? 'opacity-80 visible' : 'opacity-0 invisible w-0 hidden'
      }`}
    >
      <div className="text-white grid grid-cols-3 gap-2 w-40 mt-4 ml-2 mr-2 justify-center items-center font-bold">
        <Tooltip title="hide settings menu" color="geekblue">
          <button
            className="flex justify-center items-center hover:bg-blue-500 hover:text-white rounded mr-2"
            onClick={() => setShowLeft(false)}
          >
            <MenuOutlined className="text-lg p-2" />
          </button>
        </Tooltip>
        <Tooltip title="close folder" color="geekblue">
          <button
            className="flex justify-center items-center hover:bg-blue-500 hover:text-white rounded mr-2"
            onClick={() => exitFolder()}
          >
            <CloseOutlined className="text-lg p-2" />
          </button>
        </Tooltip>

        <Tooltip title="open folder" color="geekblue">
          <button
            className="flex justify-center items-center hover:bg-blue-500 hover:text-white rounded mr-2"
            onClick={() => openDirectory(selectedFolder)}
          >
            <FolderOutlined className="text-lg p-2" />
          </button>
        </Tooltip>

        <Tooltip title="refresh files" color="geekblue">
          <button
            className="flex justify-center items-center hover:bg-blue-500 hover:text-white rounded mr-2"
            onClick={() => refreshFiles(undefined)}
          >
            <SyncOutlined className="text-lg p-2" />
          </button>
        </Tooltip>

        <Tooltip
          title={`${showProgressBar ? 'hide' : 'show'} progress bar`}
          color="geekblue"
        >
          <button
            className="flex justify-center items-center hover:bg-blue-500 hover:text-white rounded mr-2"
            onClick={() => setShowProgressBar(!showProgressBar)}
          >
            <ClockCircleOutlined className="text-lg p-2" />
          </button>
        </Tooltip>

        <Tooltip
          title={`${showFilesList ? 'hide' : 'show'} files list`}
          color="geekblue"
        >
          <button
            className="flex justify-center items-center hover:bg-blue-500 hover:text-white rounded mr-2"
            onClick={() => setShowFilesList(!showFilesList)}
          >
            <OrderedListOutlined className="text-lg p-2" />
          </button>
        </Tooltip>
      </div>

      <Options />
    </div>
  );
}
