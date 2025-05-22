import { MouseEventHandler } from 'react';
import IconButton from '@mui/material/IconButton';
import { Nullable } from 'types/common';
import { ClockWidgetItem, TimePunch } from '../types';
import styles from './Item.module.scss';

interface Props {
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    imageSource: string;
    punch: Nullable<ClockWidgetItem>;
    type: TimePunch;
    nextPunch: Nullable<TimePunch>;
    backgroundColor: string;
    label: string;
  }

export default function Item({
  onClick,
  imageSource,
  punch,
  type,
  nextPunch,
  backgroundColor,
  label,
}: Props) {
  if (punch && type === nextPunch) {
    const { functionName } = punch;
    return (

      <div className={styles.container}>
        <IconButton
          onClick={onClick}
          className={styles.iconButton}
        >
          <div className={styles.buttonContainer} style={{ backgroundColor }}>
            <img
              src={imageSource}
              alt={functionName}
            />
          </div>
        </IconButton>
        <div className={styles.label}>
          {label}
        </div>
      </div>
    );
  }
  return null;
}
