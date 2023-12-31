

import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { Menu, Button } from 'antd';
import { HomeOutlined, HeartOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import ReactPlayer from "react-player";

import E from '../common/errors.js';
import ProgressBar from '../common/progressBar.js';
import Recent from './components/recent.js';

import './home.css';

const TextLoop = () => {

  const [index, setIndex] = useState(0);

  const words = ["LOVE", "LIKE", "DISLIKE", "HATE"];

  useEffect(() => {

    const intervalId = setInterval(() => {
      setIndex((index + 1) % words.length);
    }, 1000);

    return () => clearInterval(intervalId);

  }, [index])

  return (
    <div className="flex relative flex-col justify-center items-center overflow-hidden">
      {words.map((w,i) =>{
        return (
          <div key={`text-${i}`} className={`ml-2 ease font-bold text-xl ${
            index === i ? `visible -translate-y-${0}` : 'invisible translate-y-40'
          }`}>
            {w}
          </div>
        )
      })}
    </div>
  );
};

function Logo() {
  return (
    <div className="flex w-40 logo mx-1 mb-2 justify-between items-center rounded-t font-bold p-5">
        <div className="group flex flex-col rounded ease">
          <div className="midmid">
            <span className="bg-black text-white">Lovo</span>
            <span className="midmid group-hover:animate-bounce duration-300 ease-in-out infinite">
              <HeartOutlined className="text-pink-500 ml-1" />
            </span>
          </div>
          <div className="midmid">
            <span>Hato</span>
            <span className="midmid group-hover:animate-bounce duration-300 ease-in-out infinite">
              <DeleteOutlined className="text-green-700 ml-1" />
            </span>
          </div>
        </div>
    </div>
  );
}

const FullAbout = () => {

  return (
  <div id="about" className="opacity-90 w-full hover:w-full ease md:w-1/2 min-h-80 md:h-screen flex justify-center items-center flex-col sm:flex-row overflow-hidden pb-5">
    <Logo />
    <div className="flex flex-col">
    <div className="text-xl midmid px-5">
      <span className="w-48 bg-black text-white">Separate content<br/>into what you</span> <TextLoop />
    </div>
    <div className="text-xl px-5"><b className="bg-black text-white">FAST.</b> <span className="bg-blue-500 text-white">End with collections you <u>know</u> you love.</span></div>
    </div>
  </div>);

}

export default function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [progressBackground, setProgressBackground] = useState("#ffff00");
  const [recentPaths, setRecentPaths] = useState([]);

  const navigate = useNavigate();

  const runProgressBar = (n, bgc) => {

    console.log(`running progress bar with n: ${n}, bgc: ${bgc}`)

    setIsLoading(true);
    setLoadingProgress(0);
    setProgressBackground(bgc);

    const interval = setInterval(() => {
      setLoadingProgress(progress => progress + n/2);
    }, 30);

    // 10000/n
    // when n = 50 => 10000/50 = 200, so 300 in total
    setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
    }, (10000/n) + 300);

  };

  /* useEffect related funcs */

  useEffect(() => {
    if (isLoading && loadingProgress > 100) {
      // Perform loading logic here, e.g. fetch data from an API

      // Once loading is complete, hide the progress bar
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {

    getRecent();

  }, []);

  function getRecent() {

    electron.eAPI.getRecentPaths()
        .then((result) => {

          console.log("result of getRecentPaths", result)

          setRecentPaths(result);

        }).catch((err) => {

          const emsg = `
          Error: API : getRecentPaths

          Failed to get recent paths,

          ${err}

          `
          console.log(E(emsg));

        });

  }

  /* generic funcs */

  function updateRecentPaths(pathData) {

    console.log("updating recent paths");

    setRecentPaths(oldArray => {

      let new_recent = [];

      if (oldArray === [] || oldArray.filter(e => e.fpath === pathData.fpath) === 0) {

        new_recent = [pathData, ...oldArray].slice(0,4);

        console.log("newArray1", new_recent);
        //console.log("fps", path);
        //console.log("oldArray", oldArray);
        //console.log("newArray", new_recent);


      } else {

        console.log("already in recent paths");
        //console.log("fps", path);
        //console.log("oldArray", oldArray);

        oldArray = oldArray.filter((item) => item.fpath !== pathData.fpath);

        new_recent = [pathData, ...oldArray].slice(0,4);

        console.log("newArray2", new_recent);

      }

      //console.log("setting", new_recent);
      electron.eAPI.setStoreValue("recent_paths", new_recent);

      console.log("set recent paths", oldArray, new_recent)

      return new_recent;

    });

  }

  function removeRecentPaths(fpath) {

    runProgressBar(50, "#ff0000");

    console.log("deleting data from recent paths")

    setRecentPaths(oldArray => {

      const new_recent = oldArray.filter((item) => item.fpath !== fpath);

      electron.eAPI.setStoreValue("recent_paths", new_recent);

      console.log("set recent paths", oldArray, new_recent)

      return new_recent;

    });

    enqueueSnackbar(`Removed ${fpath} from recently filtered folders list.`, {
      variant: 'success',
    });

  }

  function selectDirectory() {

    electron.eAPI.openFileBrowser()
        .then((result) => {

          if (result === undefined) {

            console.log("canceled opening file directory via filebrowser")

          } else {

            console.log("directory input", result);

            updateRecentPaths(result)

            console.log("navigating", result);

            navigate("/folder", { state : result });

          }

        }).catch((err) => {

          const emsg = `
          Error: API : openFileBrowser

          Failed to choose a directory in the file browser.

          ${err}

          `
          console.log(E(emsg));

        });

  }

  return (<>

    <SnackbarProvider autoHideDuration={2000} />

    { isLoading && <ProgressBar progress={loadingProgress} background={progressBackground} />}

    <div id="main" className="flex flex-col md:flex-row md:overflow-hidden md:h-screen">

        <FullAbout />

<div className="h-screen md:overflow-y-scroll w-full md:w-1/2 ease hover:w-full">
<center>
          <Button
            id="selectDirectory"
            variant="primary"
            className="my-4 rounded"
            size="large"
            onClick={selectDirectory}
          >
            SELECT NEW FOLDER
          </Button>
        </center>

        <h2 className="w-full m-4 text-xl text-gray-800 font-bold text-left midmid">
            <FolderOutlined className="mr-2" /> Recent folders
        </h2>

        <Recent
          recentPaths={recentPaths}
          removeRecentPaths={removeRecentPaths}
          runProgressBar={runProgressBar}
         />

    </div>
</div>
  </>);
}

