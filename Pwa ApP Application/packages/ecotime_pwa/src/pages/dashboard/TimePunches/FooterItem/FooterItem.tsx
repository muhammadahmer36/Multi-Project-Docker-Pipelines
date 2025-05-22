import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { getLastPunch } from '../selector';
import styles from './FooterItem.module.scss';

export default function FooterItem() {
  const lastPunch = useSelector(getLastPunch);

  return (
    <Typography sx={{ fontSize: '14px' }} className={styles.label}>{lastPunch}</Typography>
  );
}
