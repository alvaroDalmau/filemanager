import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import FileIcon from '../assets/images/file.svg';
import FolderIcon from '../assets/images/folder.svg';

import { useDispatch, useSelector, useStore } from 'react-redux';

import styles from './FileExplorer.module.css';
import { selectFile } from '../store/filemanager/filemanager-actions';

//these two functions find children of each element and create a final ordered array based on them
const calcChildrenArr = (element, data) => {
  return [...data]
    .filter(e => element.id === e.parentId)
    .map(element =>
      element ? [element, calcChildrenArr(element, [...data])] : []
    );
};
const sortedArr = data => {
  return [...data]
    .filter(element => !element.parentId)
    .map(element => [element, calcChildrenArr(element, [...data])]);
};

//define class item based on its level
const classLevelItem = level => {
  switch (level) {
    case 1:
      return styles.level1;
      break;
    case 2:
      return styles.level2;
      break;
    case 3:
      return styles.level3;
      break;
    case 4:
      return styles.level4;
      break;
  }
};

function FileExplorer({ files = [] }) {
  const [selectedFile, setFile] = useState({});
  const [finalFile, setSortedArr] = useState([]);
  useEffect(() => {
    setSortedArr(sortedArr(files));
  }, []);

  const dispatch = useDispatch();
  function fileSelected(file) {
    dispatch({ type: 'filemanager/selectFile', file });
    setFile(file);
  }

  //these two functions manage how data must be printed
  const printItem = (element, level) => {
    return (
      //define if it is selected and its padding-left
      <div
        className={
          element.id === selectedFile.id
            ? `${styles.SelectedFile} ${classLevelItem(level)}`
            : `${styles.FileExplorerItem} ${classLevelItem(level)}`
        }
        onClick={() => {
          fileSelected(element);
        }}
        key={element._id}
      >
        <div className={styles.AlignCenter}>
          {/* define the icon printed based on its kind */}
          {element.kid === 'folder' ? (
            <FolderIcon className={styles.FileExplorerIcon} />
          ) : (
            <FileIcon className={styles.FileExplorerIcon} />
          )}
          {element.name}
        </div>
        <div className={styles.FileExplorerSize}>{element.size} Kb</div>
      </div>
    );
  };
  const handlePrint = (data, level = 0) => {
    return data.map(element => {
      if (element.hasOwnProperty('id')) {
        level++;
        return printItem(element, level);
      }
      if (element.length > 0) {
        return handlePrint(element, level);
      }
    });
  };

  return (
    <div className={styles.FileExplorer}>
      {finalFile.length === 0 && (
        <div className={styles.FileExplorerEmpty}>
          The root folder is empty.
        </div>
      )}
      {handlePrint(finalFile)}
    </div>
  );
}

FileExplorer.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
};

export default FileExplorer;
