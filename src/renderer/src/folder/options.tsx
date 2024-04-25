import React, { useState, useRef } from 'react';

import { Tooltip, Select } from 'antd';

import {
  EditOutlined,
  DeleteOutlined,
  ShrinkOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';

import { FolderContextValue } from '../types';
import { useFolderContext } from './folderContext';

function SpeedOption({ speed, handleSpeedChange }: {
  speed: number;
  handleSpeedChange: (newValue: number) => void;
}) {
  const [focus, setFocus] = useState(false);

  const speedInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (speedInputRef.current !== null) {
      handleSpeedChange(speedInputRef.current.value as unknown as number);

      setTimeout(() => {
        setFocus(false);
      }, 500);
    }
  };

  return (
    <div className="mt-2 flex flex-col">
      <Tooltip title="switch every __ seconds" color="green">
        <input
          className="rounded border border-gray-300 hover:border-blue-500 px-1 text-lg text-gray-700"
          defaultValue={speed}
          type="number"
          ref={speedInputRef}
          min={3}
          onFocus={() => setFocus(true)}
        />
      </Tooltip>
      {focus && (
        <>
          <button
            className="mt-2 w-28 bg-green-500 text-white hover:bg-blue-500 px-2 rounded"
            onClick={handleClick}
          >
            Apply
          </button>
          <button
            className="mt-2 w-28 bg-gray-500 text-white hover:bg-blue-500 px-2 rounded"
            onClick={() => setFocus(false)}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

function SelectionMethodOption({
  selectionMethod,
  handleSelectionMethodChange,
}: {
  selectionMethod: string;
  handleSelectionMethodChange: (value: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-col">
      <Tooltip title="selection method" color="green">
        <Select
          defaultValue={selectionMethod}
          onChange={handleSelectionMethodChange}
          options={[
            { value: 'Randomized', label: 'Randomized' },
            { value: 'Ordered', label: 'Ordered' },
          ]}
        />
      </Tooltip>
    </div>
  );
}

function RowColOption({ dimension, defaultValue, handleChange }: {
  dimension: string;
  defaultValue: number;
  handleChange: (newValue: number) => void;
}) {
  return (
    <div className="mt-2 flex flex-col">
      <Tooltip title={`Number of ${dimension}`} color="green">
        <Select
          defaultValue={defaultValue}
          onChange={handleChange}
          options={[
            { value: 1, label: `1 ${dimension}` },
            { value: 2, label: `2 ${dimension}` },
            { value: 3, label: `3 ${dimension}` },
            { value: 4, label: `4 ${dimension}` },
            { value: 5, label: `5 ${dimension}` },
            { value: 6, label: `6 ${dimension}` },
          ]}
        />
      </Tooltip>
    </div>
  );
}

function ToggleHeader({ title, text }: {
  title: string;
  text: string | React.ReactNode;
}) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="group mx-2 text-white">
        <button
          className="flex justify-center items-center hover:text-blue-500"
          onClick={() => setShowHelp(!showHelp)}
        >
          {title}
        </button>
      </div>
      {showHelp && (
        <div className="py-1 mx-4 text-gray-700 text-sm">{text}</div>
      )}
    </>
  );
}

function CategoryEditButton({ title, icon, onClick }: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Tooltip title={title} color="geekblue">
      <button
        className="flex justify-center items-center bg-blue-500 text-white rounded mr-2 p-2"
        onClick={onClick}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

function EditOptionButton({ index, folderName, folders, setFolders }: {
  index: number;
  folderName: string;
  folders: string[];
  setFolders: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [focus, setFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { messageApi } = useFolderContext() as FolderContextValue;

  const handleChange = () => {
    let newName: string = '';

    if (inputRef.current !== null) {
      newName = inputRef.current.value;
    } else {
      return;
    }

    if (newName === '') {
      messageApi.open({
        type: 'warning',
        content: 'Category name cannot be empty',
      });
      return;
    }

    if (folders.includes(newName)) {
      messageApi.open({
        type: 'warning',
        content: `There is already a ${newName} folder.`,
      });

      return;
    }

setFolders((prev: string[]) => {
  const items = [...prev];
  items[index] = newName;
  return items;
});

    messageApi.open({
      type: 'success',
      content: `Changed ${folderName} to ${newName}.`,
    });
  };

  const handleDelete = () => {
    setFolders((prev: string[]) => {
      const items = [...prev];
      items.splice(index, 1);

      if (inputRef.current !== null) {
        inputRef.current.value = '';
      }

      return items;
    });

    messageApi.open({
      type: 'success',
      content: `Removed the folder ${folderName} from the folder list.`,
    });
  };

  /*
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
  */

  return (
    <div className="flex flex-col borer border-gray-400 mb-2 mx-2 rounded">
      <div className="flex justify-center items-center">
        <span className="font-semibold text-xs text-gray-400 mr-1">
          {index + 1}
        </span>
        <input
          className="bg-black text-white border-b-2 border-gray-800 my-1 p-1 w-full"
          ref={inputRef}
          type="text"
          defaultValue={folderName}
          onFocus={() => setFocus(true)}
        />
      </div>
      {focus && (
        <div className="flex mt-2 mb-1 text-sm justify-center items-center">
          <CategoryEditButton
            title="save changes"
            icon={<EditOutlined />}
            onClick={handleChange}
          />

          <CategoryEditButton
            title="remove category"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          />

          <CategoryEditButton
            title="Cancel"
            icon={<ShrinkOutlined />}
            onClick={() => setFocus(false)}
          />
        </div>
      )}
    </div>
  );
}

function OptionFolders() {
  const { folders, setFolders, messageApi } =
    useFolderContext() as FolderContextValue;

  const [adding, setAdding] = useState(false);

  const addInputRef = useRef<HTMLInputElement | null>(null);

  const handleAdd = () => {
    let value: string = '';

    if (addInputRef.current !== null) {
      value = addInputRef.current.value;
    } else {
      return;
    }

    if (value === '') {
      messageApi.open({
        type: 'warning',
        content: `New category must not be empty`,
      });

      return;
    }

    setFolders((prev: string[]) => [...prev, value]);

    messageApi.open({
      type: 'success',
      content: `Added ${value} to folder options`,
    });

    addInputRef.current.value = '';
  };
  return (
    <div className="mt-2">
      <ToggleHeader
        title="Categories"
        text={
          <>
            <p className="py-1 text-gray-300">
              These are the folders you can{' '}
              <b className="text-white">move files to</b>.
            </p>
            <p className="py-1 text-gray-300">
              For simplicity these folders are{' '}
              <b className="text-white">located</b> in the directory of the{' '}
              <b className="text-white">currently opened folder</b>.
            </p>
          </>
        }
      />
      <div className="text-white pb-8 ">
        {folders.map((f, i) => {
          return (
            <EditOptionButton
              key={f}
              index={i}
              folderName={f}
              folders={folders}
              setFolders={setFolders}
            />
          );
        })}

        <Tooltip title="add category" color="green">
          <button
            className="mt-2 flex justify-center items-center text-white w-full"
            onClick={() => setAdding(!adding)}
          >
            {!adding ? (
              <PlusOutlined className="text-xl font-bold" />
            ) : (
              <MinusOutlined className="text-xl font-bold" />
            )}
          </button>
        </Tooltip>

        {adding && (
          <div className="py-2 flex flex-col mx-2">
            <input
              className="border-b-2 p-1 text-white bg-black"
              type="text"
              placeholder="new category name..."
              ref={addInputRef}
            />
            <button
              className="my-1 p-1 bg-black hover:bg-green-500 text-white rounded"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsSection() {
  const {
    selectionMethod,
    handleSelectionMethodChange,
    speed,
    handleSpeedChange,
    columns,
    handleColumnChange,
    rows,
    handleRowChange,
  } = useFolderContext() as FolderContextValue;

  return (
    <div className="group mt-2 mx-2 flex flex-col">
      <SelectionMethodOption
        selectionMethod={selectionMethod}
        handleSelectionMethodChange={handleSelectionMethodChange}
      />
      <SpeedOption speed={speed} handleSpeedChange={handleSpeedChange} />

      <RowColOption
        dimension="columns"
        defaultValue={columns}
        handleChange={handleColumnChange}
      />

      <RowColOption
        dimension="rows"
        defaultValue={rows}
        handleChange={handleRowChange}
      />
    </div>
  );
}

export default function Options() {
  return (
    <>
      <SettingsSection />

      <hr className="mt-4 border-gray-600" />

      <OptionFolders />
    </>
  );
}
