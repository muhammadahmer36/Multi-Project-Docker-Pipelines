import * as React from 'react';
import Chip from '@mui/material/Chip';
import styles from './Chip.module.scss';

interface Props {
  label: string;
  styleClass?: string;
  sx?: React.CSSProperties;
  variant?: 'filled' | 'outlined';
  handleClick?: () => void;
}

export default function BasicChips({
  label,
  styleClass,
  sx,
  variant = 'filled',
  handleClick,
}: Props) {
  return (
    <Chip
      sx={sx}
      className={`${styleClass} ${styles.styledChip}`}
      label={label}
      onClick={handleClick}
      variant={variant}
    />
  );
}
