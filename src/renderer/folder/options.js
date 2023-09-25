import { useState, useEffect, useRef } from 'react';

import { Button, Space, Switch, Select } from 'antd';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  UpOutlined,
  DownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SettingOutlined,
  RollbackOutlined,
  QuestionOutlined,
  FolderOutlined,
  DesktopOutlined,
  MoreOutlined,
} from '@ant-design/icons';

function SpeedOption({ speed, speedInputRef, handleSpeedChange }) {
  const [focus, setFocus] = useState(false);

  const handleClick = () => {

      console.log('hello')

      handleSpeedChange();

      setTimeout(()=>{
        setFocus(false);
      }, 500);

  }

  return (
    <div className="my-2 flex flex-col">
      <div className="text-sm text-gray-400 group-hover:text-gray-700 py-1">
        switch every
      </div>
      <input
        className="rounded w-20 border border-gray-300 hover:border-blue-500 w-4/5 px-1 text-lg text-gray-700"
        type="text"
        defaultValue={speed}
        type="number"
        ref={speedInputRef}
        min={3}
        onFocus={() => setFocus(true)}
      />
      <div className="text-sm text-gray-400 group-hover:text-gray-700">
        seconds
      </div>
      {focus && (<>
        <button
          className="mt-2 w-28 bg-green-500 text-white hover:bg-blue-500 px-2 rounded"
          onClick={handleClick}
        >Apply</button>
        <button
          className="mt-2 w-28 bg-gray-500 text-white hover:bg-blue-500 px-2 rounded"
          onClick={() => setFocus(false)}
        >Cancel</button></>
      )}
    </div>
  );
}

function SelectionMethodOption({
  selectionMethod,
  handleSelectionMethodChange,
}) {
  return (
    <div className="my-2 flex flex-col">
      <div className="flex text-sm py-2 text-gray-400 group-hover:text-gray-700 mr-2">
        selection method
      </div>
      <Select
        defaultValue={selectionMethod}
        style={{ width: 120 }}
        onChange={handleSelectionMethodChange}
        options={[
          { value: 'Randomized', label: 'Randomized' },
          { value: 'Ordered', label: 'Ordered' },
        ]}
      />
    </div>
  );
}

function RowColOption({
  dimension,
  defaultValue,
  handleChange,
}) {

  return (
          <div className="my-2 flex flex-col">
            <div className="text-sm text-gray-400 group-hover:text-gray-700 py-1">
              show
            </div>
     <Select
        defaultValue={defaultValue}
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: 1, label: `1 ${dimension}` },
          { value: 2, label: `2 ${dimension}` },
          { value: 3, label: `3 ${dimension}` },
          { value: 4, label: `4 ${dimension}` },
          { value: 5, label: `5 ${dimension}` },
        ]}
      />
          </div>
  );
}


function ToggleHeader({ title, text, selected, onClick }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div>
      <div className="group p-2 midmid">
        <button
          className={`flex ml-2 ${
            selected ? 'text-black' : 'text-gray-400'
          }`}
          onClick={() => onClick(!selected)}
        >
          {title}
        </button>
        <button
          className="flex group-2 ml-2"
          onClick={() => setShowHelp(!showHelp)}
        >
          <QuestionOutlined className="group-hover:animate-bounce duration-300 ease-in-out infinite bg-blue-500 [.group-2:hover_&]:bg-green-500 ml-1 text-white p-1 rounded-50" />
        </button>
      </div>
      {showHelp && (
        <div className="py-1 mx-4 text-gray-700 text-sm">{text}</div>
      )}
    </div>
  );
}

function OptionButton({
  index,
  folderName,
  folders,
  setFolders,
  onClick,
  openDirectory,
}) {

  return (
    <button
      className='p-1 px-2 midmid border-white ease hover:border-black my-1 mr-1 font-medium border rounded'
      onClick={() => openDirectory(folderName)}
    >
      <FolderOutlined className="mr-1" />
      {folderName}
    </button>
  );
}

function EditOptionButton({
  editing,
  index,
  folderName,
  folders,
  setFolders,
  onClick,
  openDirectory,
}) {
  const [start, setStart] = useState(false);
  const [removing, setRemoving] = useState(false);
  const inputRef = useRef(null);

  const handleDefaultClick = () => {
    if (editing) {
      return;
    }

    openDirectory(folderName);
  };

  const handleChange = () => {
    const newName = inputRef.current.value;

    if (newName === '') {
      enqueueSnackbar(`Folder name cannot be empty.`, {
        variant: 'warning',
      });
      return;
    }

    if (folders.includes(newName)) {
      enqueueSnackbar(`There is already a ${newName} folder.`, {
        variant: 'warning',
      });
      return;
    }

    setFolders((prev) => {
      const items = [...prev];
      items[index] = newName;

      return items;
    });

    enqueueSnackbar(`Changed ${folderName} to ${newName}.`, {
      variant: 'success',
    });
  };

  const handleDelete = () => {
    setFolders((prev) => {
      const items = [...prev];
      items.splice(index, 1);

      inputRef.current.value = '';

      return items;
    });

    const items = document.querySelectorAll('.edit-folder-input');

    items.forEach((i) => {
      i.value = '';
    });

    enqueueSnackbar(`Removed the folder ${folderName} from the folder list.`, {
      variant: 'success',
    });
  };

  const shiftLeft = () => {
    if (folders.length <= 1 || index === 0) {
      return;
    }

    setFolders((prev) => {
      const items = [...prev];

      const temp = items[index];

      items[index] = items[index - 1];
      items[index - 1] = temp;

      return items;
    });

    enqueueSnackbar(`Moved ${folderName} position up.`, {
      variant: 'success',
    });
  };

  const shiftRight = () => {
    if (folders.length <= 1 || index === folders.length - 1) {
      return;
    }

    setFolders((prev) => {
      const items = [...prev];

      const temp = items[index];

      items[index] = items[index + 1];
      items[index + 1] = temp;

      return items;
    });

    enqueueSnackbar(`Moved ${folderName} position down.`, {
      variant: 'success',
    });
  };

  return (
    <div className={`flex flex-col border border-gray-400 p-2 mb-2 rounded`}>
      <div
        className="ease my-1 mr-1 font-medium"
        onClick={handleDefaultClick}
      >
        <div
          className='text-gray-700 midmid text-lg mt-1'
        >
          <span className="font-semibold mr-2 p-2 bg-black text-white rounded">{index + 1}</span>
          <FolderOutlined className="mr-1" />
          {folderName}
        </div>
        <div className="">
          <div className="">
            <input
              className="edit-folder-input w-1/2 border-b-2 border-gray-700 my-1 p-2"
              ref={inputRef}
              type="text"
              defaultValue=""
              placeholder="change name to"
            />
          </div>
          <div className="flex flex-wrap mt-2 mb-1 text-sm">
            <button
              className="mr-2 py-1 px-2 midmid border border-blue-500 text-blue-500 rounded hover:border-black hover:text-black"
              onClick={handleChange}
            >
              save
            </button>

            <button
              className="mr-2 py-1 px-2 midmid border border-blue-500 text-blue-500 rounded hover:border-black hover:text-black"
              onClick={shiftLeft}
            >
              <ArrowUpOutlined />
            </button>
            <button
              className="mr-2 py-1 px-2 midmid border border-blue-500 text-blue-500 rounded hover:border-black hover:text-black"
              onClick={shiftRight}
            >
              <ArrowDownOutlined />
            </button>
            <button
              className={`mr-2 py-1 px-2 midmid border border-blue-500 text-blue-500 rounded hover:border-red-500 hover:text-red-500 ${
                removing ? 'hidden' : ''
              }`}
              onClick={() => setRemoving(true)}
            >
              <DeleteOutlined />
            </button>
         </div>
            <div className={`${removing ? 'mt-3 pb-2 border-b border-gray-300' : 'hidden'}`}>
              Are you sure you want to remove this folder?
              <button
                className="m-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded"
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className="m-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded"
                onClick={() => setRemoving(false)}
              >
                Cancel
              </button>
            </div>

        </div>
      </div>
    </div>
  );
}

function OptionFolders({ folders, setFolders, openDirectory }) {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showFolderOptions, setShowFolderOptions] = useState(false);

  const addInputRef = useRef(null);

  const handleAdd = () => {
    const { value } = addInputRef.current;

    if (value === '') {
      enqueueSnackbar(`Folder name must not be empty`, {
        variant: 'warning',
      });

      return;
    }

    setFolders((prev) => [...prev, value]);

    enqueueSnackbar(`Added ${value} to folder options`, {
      variant: 'success',
    });

    addInputRef.current.value = '';
  };
  return (
    <div className="mb-2">
      <ToggleHeader
        title="Folder settings"
        text={
          <>
            <p className="py-1">
              These are the folders you can{' '}
              <b className="text-black">move files to</b>.
            </p>
            <p className="py-1">
              For simplicity these folders are{' '}
              <b className="text-black">located</b> in the directory of the{' '}
              <b className="text-black">currently opened folder</b>.
            </p>
          </>
        }
        selected={showFolderOptions}
        onClick={setShowFolderOptions}
      />
      {showFolderOptions && (
        <div className="ml-2">
          <div className="group mt-2 mx-2 flex flex-col flex-wrap">
            <div className="text-gray-400 group-hover:text-gray-700 text-xs flex">
              preview folders
            </div>
            {folders.map((f, i) => {
              return (
                <div key={f}>
                  <OptionButton
                    openDirectory={openDirectory}
                    editing={editing}
                    index={i}
                    folderName={f}
                    onClick={openDirectory}
                    folders={folders}
                    setFolders={setFolders}
                    onClick={openDirectory}
                  />
                </div>
              );
            })}
          </div>
          <div className="m-2">
            <button
              className={`ease group text-gray-100 midmid rounded p-2 hover:bg-blue-500 ${
                editing ? 'bg-black' : 'bg-gray-700'
              }`}
              onClick={() => setEditing(!editing)}
            >
                <EditOutlined className="mr-1" />
                {editing ? (
                    <span className="text-xs">Cancel</span>
                ) : (
                <div className="text-xs">
                  Edit
                </div>
                )}
            </button>
          </div>

        </div>
      )}

      {editing && (
        <div
          id="editing"
          className="fixed bg-white pb-8 max-w-1/2 h-screen overflow-y-scroll z-50 top-0 left-48 px-3"
        >
          <div className="my-2 text-gray-500 w-80 hover:text-gray-700">
            <p className="py-1">These folders are found in the same folder as the images being processed.</p>
            <p className="py-1">Images you view can be quickly sent to the different folders, the aim to end up with a folder you know you love.</p>
            <p className="py-1">Default folders are <b>loved</b>, <b>liked</b>, <b>disliked</b> and <b>hated</b>.</p>
            <p className="py-1">However, it is very easy to add and create a custom set of folders for whatever use case you have in mind.</p>
          </div>

            <div className="w-1/2 py-2 flex flex-col ">
              <input
                className="border-b-2 border-black p-1 text-gray-700"
                type="text"
                placeholder="new folder name..."
                ref={addInputRef}
              />
              <button
                className="my-1 p-1 bg-black hover:bg-green-500 text-white rounded"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>

          {folders.map((f, i) => {
            return (
              <div key={f}>
                <EditOptionButton
                  openDirectory={openDirectory}
                  editing
                  index={i}
                  folderName={f}
                  onClick={openDirectory}
                  folders={folders}
                  setFolders={setFolders}
                  onClick={openDirectory}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SettingsSection({
  selectionMethod,
  handleSelectionMethodChange,
  speed,
  handleSpeedChange,
  speedInputRef,
  columns,
  handleColumnChange,
  rows,
  handleRowChange,
}) {

  return (
    <>
        <div className="group ml-4 flex flex-col">
          <SelectionMethodOption
            selectionMethod={selectionMethod}
            handleSelectionMethodChange={handleSelectionMethodChange}
          />
          <SpeedOption
            speed={speed}
            handleSpeedChange={handleSpeedChange}
            speedInputRef={speedInputRef}
          />

          <RowColOption
            dimension={'columns'}
            defaultValue={columns}
            handleChange={handleColumnChange}/>

          <RowColOption
            dimension={'rows'}
            defaultValue={rows}
            handleChange={handleRowChange}/>


        </div>
    </>
  );
}

export default function Options({
  openDirectory,
  state,
  timeouts,
  selectionMethod,
  columns,
  rows,
  speed,
  speedInputRef,
  selectionInputRef,
  columnsInputRef,
  rowsInputRef,
  folders,
  setFolders,
  handleSelectionMethodChange,
  handleColumnChange,
  handleRowChange,
  handleNumberChange,
  handleSpeedChange,
}) {
  return (
    <div className="w-full">

      <SettingsSection
        selectionMethod={selectionMethod}
        handleSelectionMethodChange={handleSelectionMethodChange}
        speed={speed}
        handleSpeedChange={handleSpeedChange}
        speedInputRef={speedInputRef}
        selectionInputRef={selectionInputRef}
        columnsInputRef={columnsInputRef}
        rowsInputRef={rowsInputRef}
        columns={columns}
        handleColumnChange={handleColumnChange}
        rows={rows}
        handleRowChange={handleRowChange}
      />
    </div>
  );
}
