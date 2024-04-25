import { FullscreenExitOutlined } from '@ant-design/icons';

import { FolderContextValue } from '../types';
import { useFolderContext } from './folderContext';

export default function Fullscreen() {
  const { selectedFile, setSelectedFile } =
    useFolderContext() as FolderContextValue;

  return (
    selectedFile && (
      <div className="relative overflow-y-scroll">
        <button
          className="absolute top-5 left-5 text-white px-2 pb-2 text-xl bg-black opacity-80 rounded hover:bg-blue-500"
          onClick={() => setSelectedFile(null)}
        >
          <FullscreenExitOutlined />
        </button>
        <img className="" src={`atom://${selectedFile}`} />
      </div>
    )
  );
}
