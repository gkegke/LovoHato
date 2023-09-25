const { ipcMain, shell, dialog } = require('electron');

const fs = require('fs');
const path = require('path');
const Store = require('electron-store');
const os = require('os');

function copyFolderToHome(sourceFolderName, LS) {
  // Use __dirname to get the path of the assets folder
  const assetsPath = path.join(process.resourcesPath, 'assets');

  const sourceFolderPath = path.join(assetsPath, sourceFolderName);

  const userHomeFolder = os.homedir(); // Get the user's home folder

  const destinationFolderPath = path.join(userHomeFolder, 'lovo hato examples', sourceFolderName);

  console.log(`copying example folder assets/${sourceFolderName} to ${destinationFolderPath}`);

  try {
    // Create the destination folder if it does not exist
    if (!fs.existsSync(destinationFolderPath)) {
      fs.mkdirSync(destinationFolderPath, { recursive: true });
    }

    // Get all the files in the source folder
    const files = fs.readdirSync(sourceFolderPath);

    // Loop through each file and copy it to the destination folder
    for (const file of files) {
      const sourceFilePath = path.join(sourceFolderPath, file);
      const destinationFilePath = path.join(destinationFolderPath, file);

      // Copy the file synchronously
      fs.copyFileSync(sourceFilePath, destinationFilePath);
    }

    // Update the recent_paths in local storage
    let rpaths = LS.get('recent_paths');

    LS.set('recent_paths', [...rpaths, {
      fpath: destinationFolderPath,
      basename: path.basename(destinationFolderPath)
    }]);

    console.log(`Folder "${sourceFolderName}" copied to user's home folder.`);
  } catch (err) {
    console.error(`Error copying folder: ${err.message}`);

    dialog.showErrorBox(`copy failure`, `
    source: ${sourceFolderName}
    dest: ${destinationFolderPath}
    Copy Folder Error: ${err.message}
    `);
  }
}

function InitLS() {
  /*

      Simple kv store intilization, comparable to what would be localStorage
      typically on the browser.

    */

  console.log('initializing store');

  const LS = new Store();

  const defaults = {
    recent_paths: [],
  };

  if (!LS.has('recent_paths')) {
    LS.set('recent_paths', []);
    copyFolderToHome('beautiful earth', LS);
    copyFolderToHome('one piece memes', LS);
  }

  // set keys to default if store is new and empty
  for (let key in defaults) {
    if (!LS.has(key)) {
      LS.set(key, defaults[key]);
    }
  }


  return LS;
}

// LS => localStorage alternative since localStorage isn't supported well (i forget)
// by electron
const LS = InitLS();

/* ------------------------ ------------------------------------*/

ipcMain.handle('openFileBrowser', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  console.log(canceled, filePaths);

  if (canceled) {
    return;
  }

  const pathFiles = await fs.promises.readdir(filePaths[0]);

  return {
    fpath: filePaths[0],
    basename: path.basename(filePaths[0]),
    num_of_files: pathFiles.length,
    some_files: pathFiles
      .slice(0, 5)
      .map((fname) => path.join(filePaths[0], fname)),
  };
});

ipcMain.handle('getStoreValue', (event, key) => {
  return LS.get(key);
});

ipcMain.handle('setStoreValue', (event, key, value) => {
  return LS.set(key, value);
});

function naturalSort(a, b) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return collator.compare(a, b);
}

ipcMain.handle('getDirFilePaths', async (event, dpath) => {

  // Define an array of valid file extensions
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi', '.webm', '.mov', '.ogg', '.mkv', '.flv', 'wmv'];

  const sub_paths = await fs.promises.readdir(dpath, { withFileTypes: true });

  // Filter the sub_paths by checking if they are files and have a valid extension
  const dpaths = sub_paths
    .filter((dirent) => dirent.isFile() && validExtensions.includes(path.extname(dirent.name)))
    .map((dirent) => {
      return {
      fpath : path.join(dpath, dirent.name),
      basename : dirent.name,
      ext : path.extname(dirent.name),
      selected : false, // used to manage selected images feature
}})
    .sort(naturalSort)

  return dpaths
});

// get details of folder
// i.e. number of images, number of videos etc etc
ipcMain.handle('getRecentPaths', async (event) => {
  const rpaths = LS.get('recent_paths');

  //console.log('get recent paths', rpaths);

  const result = await Promise.all(
    rpaths.map(async (rpath) => {
      // note rpath: { fpath: ..., basename: ... }

      //console.log('rp', rpath);

      const sub_paths = await fs.promises.readdir(rpath.fpath, {
        withFileTypes: true,
      });

      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi', '.webm'];

      const rpath_files = sub_paths.filter((dirent) => {
        return (
          dirent.isFile() && validExtensions.includes(path.extname(dirent.name))
        );
      });

      //console.log('rp length', rpath_files.length);
      //console.log(rpath_files[0]);

      return {
        fpath: rpath.fpath,
        basename: rpath.basename,
        num_of_files: rpath_files.length,
        some_files: rpath_files
          .slice(0, 5)
          .map((dirent) => path.join(rpath.fpath, dirent.name)),
      };
    })
  );

  //console.log(result);

  return result;
});


// Add this IPC handle after the existing code
ipcMain.handle('addToRecentPaths', (event, filePath) => {
  const rpaths = LS.get('recent_paths');

  // Make sure the filePath is not already in recent_paths
  if (!rpaths.some((rpath) => rpath.fpath === filePath)) {
    rpaths.unshift({
      fpath: filePath,
      basename: path.basename(filePath)
    });

    // Keep only the last 10 recent paths
    if (rpaths.length > 10) {
      rpaths.pop();
    }

    LS.set('recent_paths', rpaths);
  }

});

ipcMain.handle('openDirectory', async (event, dpath, folderName) => {
  console.log(`Opening directory on path: ${dpath}`);

  if (folderName) {
    const fullPath = path.join(dpath, folderName);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
    }

    console.log(`Opening folder: ${fullPath}`);

    shell.openPath(fullPath)
      .then(() => {
        console.log('Folder opened successfully.');
      })
      .catch(err => {
        console.error('Error opening folder:', err);
      });
  } else {
    shell.openPath(dpath)
      .then(() => {
        console.log('Directory opened successfully.');
      })
      .catch(err => {
        console.error('Error opening directory:', err);
      });
  }
});

ipcMain.handle(
  'moveFileToDir',
  async (event, sourcePath, destinationDir, actionType) => {
    const dirname = path.dirname(sourcePath);
    const basename = path.basename(sourcePath);
    const targetDir = path.join(dirname, destinationDir);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    const destinationPath = path.join(targetDir, basename);

    console.log(
      `trying to ${actionType} file ${sourcePath} to ${destinationPath}`
    );

    try {
      if (actionType === 'move') {
        await fs.promises.rename(sourcePath, destinationPath);
        console.log('File moved successfully');
      } else if (actionType === 'copy') {
        await fs.promises.copyFile(sourcePath, destinationPath);
        console.log('File copied successfully');
      }
    } catch (error) {
      console.error(`
      Failed to move file [${sourcePath}] to [${destinationPath}]

      ${error.message}
      `);
    }
  }
);

ipcMain.handle(
  'moveFilesToDir',
  async (event, files, baseDir, folder) => {

    const destinationDir = path.join(baseDir, folder);

    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir);
    }

    for (let i=0; i < files.length; i++) {

      const basename = files[i];
      const sourcePath = path.join(baseDir, basename);
      const destinationPath = path.join(destinationDir, basename);

      await fs.promises.rename(sourcePath, destinationPath);

      console.log(`File moved: ${sourcePath} => ${destinationPath}`);

    }


});

ipcMain.handle(
  'undoRecentMoves',
  async (event, moves) => {

    console.log(`
    UNDOING RECENT MOVE
    `);

    for (const file of moves) {

      const sourcePath = path.join(file.baseDir, file.folder, file.basename);
      const destinationPath = path.join(file.baseDir, file.basename);

      //console.log(`attempting ${sourcePath} => ${destinationPath}`);

      try {
        // Check if the sourcePath exists
        await fs.promises.access(sourcePath);
        // If it exists, perform the rename operation
        await fs.promises.rename(sourcePath, destinationPath);
        console.log(`File moved: ${sourcePath} => ${destinationPath}`);
      } catch (error) {
        console.error(`File not found or unable to move: ${sourcePath}`);
      }

    }
  }
);


