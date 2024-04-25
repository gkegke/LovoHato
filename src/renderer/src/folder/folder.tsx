import Left from './left'
import RightFiles from './rightFiles'
import Right from './right'
import Fullscreen from './fullscreen'

import { FolderContextValue } from '../types'
import { FolderProvider, useFolderContext } from './folderContext'

export default function Folder() {
  return (
    <FolderProvider>
      <FolderContent />
    </FolderProvider>
  )
}

export function FolderContent() {
  const { messageContextHolder } = useFolderContext() as FolderContextValue

  return (
    <div className="flex w-full h-screen overflow-hidden bg-black">
      {messageContextHolder}

      <Fullscreen />

      <Left />

      <Right />

      <RightFiles />
    </div>
  )
}
