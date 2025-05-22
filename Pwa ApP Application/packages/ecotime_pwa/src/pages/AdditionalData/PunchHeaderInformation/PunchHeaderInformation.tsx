import React from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { getPunchInformation } from './selectors';
import styles from './PunchHeaderInformation.module.scss';

export default function PunchHeaderInformation() {
  const punchInformation = useSelector(getPunchInformation);
  return (
    <Typography className={styles.headerInformation}>{punchInformation}</Typography>
  );
}
