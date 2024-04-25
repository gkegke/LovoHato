import { useState, useEffect } from 'react';

import { Tooltip } from 'antd';

import {
  FolderOpenOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import ReactPlayer from 'react-player';

import { FolderContextValue, RecentFolder } from '../types';
import { useFolderContext } from './folderContext';

function RecentPathImages({ ipaths }: { ipaths: string[] }): JSX.Element {
  return (<>
  {ipaths.map((fname: string, index: number): JSX.Element => {
    // get the file extension from the fname
    const parts = fname.split('.');
    const ext: string = parts.length > 1 ? parts.pop()!.toLowerCase() : ''; // Handle case when fname has no extension
    // check if the file extension is a video format
    const isVideo: boolean = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext);
    // return an img or a ReactPlayer component depending on the file type
    if (isVideo) {
      return (
        <ReactPlayer
          key={index}
          className="mb-2 rounded"
          url={fname}
          playing={false}
          muted
        />
      );
    }
    return <img key={index} className="mb-2" src={fname} />;
  })}
  </>);
}

export default function Recent(): JSX.Element {
  const [recentPaths, setRecentPaths] = useState<RecentFolder[]>(
    Array(10).fill(null)
  );

  const { messageApi, openDirectory, setSelectedFolder, selectDirectory } =
    useFolderContext() as FolderContextValue;

  useEffect(() => {
    getRecent();
  }, []);

  const getRecent = async () => {
    try {
      const result = await window.eAPI.getRecentPaths();
      setRecentPaths((_: RecentFolder[]): RecentFolder[] => {
        // Copy the result array (up to the first 10 elements)
        const newRP = result.slice(0, 8);

        // Fill any remaining slots with null
        newRP.push(...Array(8 - newRP.length).fill(null));

        return newRP;
      });
    } catch (error) {
      console.error('Error fetching recent paths:', error);
      const message = `
        Error: API : getRecentPaths
        Failed to get recent paths,
        ${error}
      `;
      console.error(message);
    }
  };

  const removeRecentPath = async (fpath: string) => {
    console.log('fpath', fpath);
    try {
      await window.eAPI.removeRecentPath(fpath);

      const updatedPaths = recentPaths.filter((item) => {
        if (item !== null && item.fpath === fpath) {
          return false;
        }
        return true;
      });

      setRecentPaths(updatedPaths);

      messageApi.open({
        type: 'warning',
        content: `${fpath} has been removed from recent history`,
        duration: 4,
      });
    } catch (error) {
      console.error('Error removing recent path:', error);
    }
  };

  return (
    <div className="flex overflow-hidden justify-center items-center">
      <div className="relative flex overflow-hidden justify-center items-center">
        <div className="my-4 flex flex-row-reverse scroll black-scrollbar overflow-x-scroll overflow-y-hidden justify-start items-start">
          {recentPaths.map((recent, index) => {
            if (index % 2 === 0) {
              if (recent !== null) {
                return (
                  <RecentRow
                    recent={recent}
                    key={index}
                    openDirectory={openDirectory}
                    removeRecentPath={removeRecentPath}
                    setSelectedFolder={setSelectedFolder}
                  />
                );
              }

              return (
                <RecentNull key={index} selectDirectory={selectDirectory} />
              );
            }
            return null;
          })}
        </div>

        <div className="hidden py-3 px-1 bg-black rounded-xl opacity-80 absolute left-5 bottom-10 z-50 text-gray-300 vertical-text">
          recently viewed folders
        </div>
      </div>

      <div className="min-w-80 flex flex-col h-full justify-center items-center mr-2 overflow-hidden">
        <FullAbout />

        {/* <RotatingList /> */}
      </div>

      <div className="relative flex overflow-hidden justify-center items-center">
        <div className="my-4 flex fex-row-reverse scroll black-scrollbar overflow-x-scroll overflow-y-hidden justify-start items-start">
          {recentPaths.map((recent, index) => {
            if (index % 2 === 1) {
              if (recent !== null) {
                return (
                  <RecentRow
                    recent={recent}
                    key={index}
                    openDirectory={openDirectory}
                    removeRecentPath={removeRecentPath}
                    setSelectedFolder={setSelectedFolder}
                  />
                );
              }

              return (
                <RecentNull key={index} selectDirectory={selectDirectory} />
              );
            }
            return null;
          })}
        </div>

        <div className="hidden py-3 px-1 bg-black rounded-xl opacity-80 absolute right-5 bottom-10 z-50 text-gray-300 vertical-text">
          recently viewed folders
        </div>
      </div>
    </div>
  );
}

function RecentRow({
  recent,
  openDirectory,
  removeRecentPath,
  setSelectedFolder,
}: {
  recent: RecentFolder;
  openDirectory: (fpath: string | null) => void;
  removeRecentPath: (fpath: string) => void;
  setSelectedFolder: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <div className="group pb-8 recent_row relative scroll black-scrollbar ease h-screen overflow-y-scroll overflow-x-hidden">
      <button
        className="w-full p-2 pt-1 hover:bg-gray-800"
        onClick={() => setSelectedFolder(recent.fpath)}
      >
        <div className="mx-2 absolute top-5 left-5 bg-blue-500 opacity-70 rounded text-lg font-semibold text-white p-1">
          {recent.basename}
        </div>
        <div className="flex w-full flex-col items-center">
          <RecentPathImages ipaths={recent.some_files} />
        </div>
      </button>
      <div className="group-hover:visible invisible flex p-2 my-4 justify-start items-center">
        <Tooltip
          color="green"
          title={`open folder: ${recent.fpath} (${recent.num_of_files})`}
        >
          <button
            className="bg-white border-gray-300 rounded text-gray-400 hover:text-white hover:border-green-500 hover:bg-green-500 flex items-center justify-center mr-2"
            onClick={() => openDirectory(recent.fpath)}
          >
            <FolderOpenOutlined className="text-xl p-2 px-3 rounded" />
          </button>
        </Tooltip>
        <Tooltip color="red" title="remove from recent">
          <button
            className="bg-white border-gray-300 rounded text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-500 flex items-center justify-center"
            onClick={() => removeRecentPath(recent.fpath)}
          >
            <CloseOutlined className="text-xl p-2 px-3 rounded" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

function RecentNull({ selectDirectory }: {
  selectDirectory: () => void;
}) {
  return (
    <button
      className="group mx-2 pb-8 recent_row relative ease h-screen bg-black hover:bg-gray-700 flex justify-center items-center"
      onClick={selectDirectory}
    >
      <PlusOutlined className="group-hover:text-white text-black" />
    </button>
  );
}

function FullAbout(): JSX.Element {
  const { selectDirectory } = useFolderContext() as FolderContextValue;

  return (
    <div className="ml-2 my-4 pt-8 w-full shadow drop-shadow flex flex-col justify-center items-center scroll bg-wite rounded-xl ease">
      <div className="flex ml-2">
        <span className="text-gray-100 m-3 w-1/2">
          Speed up organizing endless content into what you
        </span>{' '}
        <TextLoop />
      </div>

      <button
        className="flex justify-center items-center px-2 pt-2 pb-1 mt-4 rounded border-none bg-blue-500 hover:bg-white text-white hover:text-gray-800"
        onClick={selectDirectory}
      >
        SELECT FOLDER
      </button>

      <div className="text-xs p-2 mt-4">
        <span className="text-gray-400">
          Version <b className="text-gray-300">0.7.0</b>
        </span>
      </div>
    </div>
  );
}

function TextLoop() {
  const [index, setIndex] = useState(0);

  const words = ['LOVE', 'LIKE', 'DISLIKE', 'HATE'];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((index + 1) % words.length);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [index]);

  return (
    <span className="text-white flex relative flex-col justify-center items-center overflow-hidden">
      {words.map((w, i) => {
        return (
          <div
            key={`text-${i}`}
            className={`ml-2 ease font-bold text-xl ${
              index === i
                ? `visible -translate-y-${0}`
                : 'invisible translate-y-40'
            }`}
          >
            {w}
          </div>
        );
      })}
    </span>
  );
}

/*
const examples = [
  'View all your holiday pictures many at a time to find the best of the best. ❤️❤️',
  'Find the songs in your music collection that have a certain je ne sais quoi 👌👨‍🍳.',
  'Create a set of high quality images, to use with generative AI. 🤔'
  // 'Watch through many videos at once to find one that has a certain scene.',
]

function NeonBox({ text }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-2 items-center text-white w-full">{text}</div>
  )
}

function RotatingList() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {examples.map((example, index) => (
        <NeonBox key={index} text={example} />
      ))}
    </div>
  )
}

*/
