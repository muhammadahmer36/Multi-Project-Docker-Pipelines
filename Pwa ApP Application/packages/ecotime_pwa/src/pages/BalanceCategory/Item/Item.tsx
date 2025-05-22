import Grid from '@mui/material/Grid';
import { IItemProps } from '../types';
import styles from './Item.module.scss';

export default function Item({ value }: IItemProps) {
  return (

    <Grid
      item
      xs={4}
      md={4}
      className={styles.item}
      justifyContent="flex-start"
    >
      {value}
    </Grid>
  );
}
