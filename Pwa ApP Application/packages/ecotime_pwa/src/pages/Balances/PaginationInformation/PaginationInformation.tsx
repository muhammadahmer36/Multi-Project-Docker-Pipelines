import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getBalanceParams } from 'pages/Balances/selectors';
import Typography from '@mui/material/Typography';
import styles from './PaginationInformation.module.scss';

interface Props {
    balancesForTimesheetGroup: boolean
}

export default function PaginationInformation(props: Props) {
  const { balancesForTimesheetGroup } = props;
  const [t] = useTranslation();
  const balanceParams = useSelector(getBalanceParams);

  return (
    <div className={styles.container}>
      {balancesForTimesheetGroup && (
        <Typography className={styles.employeeCount}>
          {`${t('emp')} ${balanceParams?.currentPageId} ${t('of')} ${balanceParams?.employeeCount}`}
        </Typography>
      )}
    </div>
  );
}
