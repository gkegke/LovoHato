import { Tooltip } from 'antd';

import {
  EditOutlined,
  MenuOutlined,
  PlayCircleOutlined,
  PauseOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  UndoOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import { FolderContextValue } from '../types';
import ProgressBar from '../common/progressBar';
import Images from './images';
import Recent from './recent';

import { useFolderContext } from './folderContext';

function MenuButton({ icon, text, selected, onClick }: {
  icon: React.ReactNode;
  text: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip title={text} color="geekblue">
      <button
        className={`flex justify-center items-center rounded text-xl midmid px-2 py-2 border-black hover:bg-blue-500 hover:text-white hover:border-blue-500 ${
          selected ? 'bg-black text-white' : ''
        } text-white`}
        onClick={onClick}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

function GroupButton({ text, onClick }: {
  text: string;
  onClick: () => void;
}) {

  return (
    <button
      className="border flex justify-center items-center rounded px-2 py-1 my-2 mr-2 bg-white border-black text-black hover:bg-blue-500 hover:text-white hover:border-blue-500"
      onClick={onClick}
    >
      <span className="text-sm">{text}</span>
    </button>
  );
}

function RightMenu(): JSX.Element {
  const {
    isVisible,
    showLeft,
    setShowLeft,

    timeoutId,
    handlePlayPause,
    handlePrev,
    handleNext,
    handleUndoHistory,
    handleEditToggle,
  } = useFolderContext() as FolderContextValue;

  // handleFilesListToggle,
  /*
          <MenuButton
            icon={<OrderedListOutlined />}
            selected={showFilesList}
            onClick={handleFilesListToggle}
            text={`${showFilesList ? 'hide' : 'show'} files list`}
          />
          */

  return (
    <div
      className={`z-50 hover:z-50 absolute bottom-5 left-5 hover:opacity-100 mx-2 mb-2 border-0 flex rounded justify-center items-center ${
        isVisible ? 'opacity-80 visible' : 'opacity-0 invisible'
      } bg-black`}
    >
      {!showLeft && (
        <MenuButton
          icon={<MenuOutlined />}
          onClick={() => setShowLeft(true)}
          text="Show menu"
          selected={false}
        />
      )}

      <MenuButton
        icon={timeoutId ? <PauseOutlined /> : <PlayCircleOutlined />}
        onClick={() => {
          handlePlayPause();
        }}
        selected={false}
        text={timeoutId ? 'Pause' : 'Play'}
      />

      <MenuButton
        icon={<StepBackwardOutlined />}
        onClick={() => handlePrev()}
        text="Previous"
        selected={false}
      />
      <MenuButton
        icon={<StepForwardOutlined />}
        onClick={() => handleNext()}
        text="Next"
        selected={false}
      />

      <MenuButton
        icon={<UndoOutlined />}
        onClick={() => handleUndoHistory()}
        text="Undo last"
        selected={false}
      />
      <MenuButton
        icon={<EditOutlined />}
        onClick={handleEditToggle}
        text="Start Edit Mode"
        selected={false}
      />
    </div>
  );
}

function RightContent() {
  const {
    showProgressBar,
    folders,
    chosenFiles,
    timeoutId,
    selectedFile,
    moveFilesToDir,
  } = useFolderContext() as FolderContextValue;

  return (
    <>
      {showProgressBar && timeoutId !== null && <ProgressBar />}

      <div
        className={`flex flex-col w-full relative overflow-y-scroll overflow-x-hidden min-h-screen bg-black ${
          selectedFile && 'hidden'
        }`}
      >
        <RightMenu />

        {timeoutId === null && chosenFiles.length > 0 && (
          <div className="flex justify-center items-center py-1 px-2 m-3 opacity-80 hover:opacity-100 z-50 bg-black rounded">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">paused</span>
              <div className="mr-2 text-sm text-gray-400">
                MOVE{' '}
                {!chosenFiles.some((f) => f.selected) ? (
                  <span className="font-bold text-blue-500">
                    {chosenFiles.some((f) => f.locked) ? 'UNLOCKED' : 'ALL'}
                    {' '}
                    {chosenFiles.filter((f) => f.basename !== '' && f.locked === false).length}
                  </span>
                ) : (
                  <span className="font-bold text-green-500">
                    {chosenFiles.filter((f) => f.selected).length} SELECTED
                  </span>
                )}{' '}
                TO
              </div>
            </div>

            {folders.map((f) => {
  return (
    <GroupButton
      key={f}
      text={f}
      onClick={() => moveFilesToDir(f)}
    />
  );
})}
          </div>
        )}

        {chosenFiles.length > 0 ? (
          <Images />
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
    </>
  );
}

export default function Right(): JSX.Element {
  const { selectedFolder } = useFolderContext() as FolderContextValue;

  return <>{selectedFolder !== null ? <RightContent /> : <Recent />}</>;
}
