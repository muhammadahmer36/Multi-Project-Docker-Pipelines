import React from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import Item from 'pages/Balances/Item';
import { BalanceSummary } from 'pages/Balances/types';
import styles from '../List.module.scss';

interface Props {
  index: number;
  balances: BalanceSummary[];
  // eslint-disable-next-line no-unused-vars
  handleKeyDown: (event: React.KeyboardEvent, balanceGroupId: number,
    // eslint-disable-next-line no-unused-vars
    category: string, empNum: string, sectionName: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleItemClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    // eslint-disable-next-line no-unused-vars
    balanceGroupId: number, category: string, empNum: string, sectionName: string) => void;
  sectionName: string;
}

export default function Row(props: Props) {
  const {
    index, balances, handleKeyDown, handleItemClick, sectionName,
  } = props;
  const option = balances[index];
  return (
    <ButtonBase
      tabIndex={0}
      onKeyDown={(event) => handleKeyDown(event, option.balanceGroupId, option.category, option.empNum, sectionName)}
      onClick={(event) => handleItemClick(event, option.balanceGroupId, option.category, option.empNum, sectionName)}
      key={option.balanceGroupId}
      className={styles.content}
    >
      <Item value={option.category} />
      <Item value={option.hours} />
    </ButtonBase>
  );
}
