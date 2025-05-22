import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SortableTypes } from 'pages/PunchHistory/types';
import styles from '../Header.module.scss';

/* eslint-disable no-unused-vars */
interface SortableIconButtonProps {
    label: string,
    onSorted: (param: SortableTypes) => void;
    isSorted: boolean,
    type:SortableTypes
}

function SortableIconButton({
  label, onSorted, isSorted, type,
}: SortableIconButtonProps) {
  return (
    <div className={styles.sortAbleIcon}>
      <IconButton className={styles.LabelItem} onClick={() => onSorted(type)}>
        {label}
        {isSorted ? (
          <ArrowDropUpIcon className={styles.icon} />
        ) : (
          <ArrowDropDownIcon className={styles.icon} />
        )}
      </IconButton>
    </div>
  );
}

export default SortableIconButton;
