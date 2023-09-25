
import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { Button } from 'antd';
import ReactPlayer from "react-player";


function RecentPathImages({ipaths}) {
  return ipaths.map((fname, index) => {
      // get the file extension from the fname
      let ext = fname.split(".").pop().toLowerCase();
      // check if the file extension is a video format
      let isVideo = ["mp4", "webm", "ogg"].includes(ext);
      // return an img or a ReactPlayer component depending on the file type
      if (isVideo) {
        return (
          <ReactPlayer
            key={index}
            className="rvid"
            url={`atom://${fname}`}
            playing={true}
            muted={true}
            width={100}
            height={100}
          />
        );
      } else {
        return <img key={index} className="h-40 mr-2 rounded" src={`atom://${  fname}`} />
      }
    });
}

export default function Recent({
  recentPaths,
  removeRecentPaths,
  runProgressBar,
}) {

  function openDirectory(fpath) {

    runProgressBar(50, "#0080ff");

    console.log(`opening directory...
     fpath: ${fpath}
    `);

    electron.eAPI.openDirectory(fpath)
        .then(() => {

          console.log("should have opened dir")

        }).catch((err) => {

          const emsg = `
          Error : API : openDirectory

          Failed to open the directory ${fpath}

          ${err}
          `

        })


  }

  const rows = recentPaths.map((recent, index) => {

      if (recent.fpath !== "" || recent !== null || recent !== undefined) {

          return (
            <div
              className="w-11/12 mb-4 flex flex-wrap flex-col" key={index}>

                <Link
                    className="group rlink p-3 pt-1 hover:bg-blue-500 rounded"
                    to="/folder"
                    state={{...recent}}
                >

                  <div className="recent">

                    <div className="text-lg font-semibold text-black group-hover:text-white mt-2">{recent.basename}</div>
                    <span className="text-gray-400 group-hover:text-white">{recent.fpath}</span>


                  </div>

                  <div className="flex mt-2 overflow-x-scroll">
                    <RecentPathImages
                      ipaths={recent.some_files}
                    />
                  </div>
                </Link>
                <div className="justify-start mt-2">
                    <button
                      className="text-sm border-gray-300 rounded text-gray-400 hover:text-black hover:border-black m-1 border px-2 py-1"
                      data-fpath={recent.fpath}
                      onClick={() => openDirectory(recent.fpath)}
                      >open folder</button>
                    <button
                      className="text-sm border-gray-300 rounded text-gray-400 hover:text-black hover:border-black m-1 border px-2 py-1"
                      data-fpath={recent.fpath}
                      onClick={() => removeRecentPaths(recent.fpath)}
                      >remove from recent</button>
                    <button
                      className="text-sm border-gray-300 rounded text-gray-400 hover:text-black hover:border-black m-1 border px-2 py-1"
                      ><s>view stats</s></button>
                </div>
            </div>
          )

      }

  });

  return (<>
      <div className="midmid flex-col justify-start mb-8">{rows}</div>
  </>)

}
