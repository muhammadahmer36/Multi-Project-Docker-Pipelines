import { IItemProps } from '../types';
import styles from './Item.module.scss';

export default function Item({ value }: IItemProps) {
  return (
    <div className={styles.item}>{value}</div>
  );
}
