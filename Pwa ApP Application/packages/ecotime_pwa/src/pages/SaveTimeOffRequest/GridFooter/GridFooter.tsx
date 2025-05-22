import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import { getSummaryOfItemsDetail } from 'pages/TimeOffCalendar/selectors';
import { getTotalDaysAndHours } from 'utilities';
import styles from './GridFooter.module.scss';

export default function Footer() {
  const [t] = useTranslation();
  const summaryOfItemsDetail = useSelector(getSummaryOfItemsDetail);
  /* eslint-disable camelcase */
  const { totalHours, totalDays_DisplayTitle } = summaryOfItemsDetail;

  const totalDaysAndHours = getTotalDaysAndHours(totalHours, t('hrs'), totalDays_DisplayTitle);

  return (
    <Grid
      container
      className={styles.mainContainer}
    >
      <Grid
        item
        xs={5.5}
        md={5.5}
        lg={5.5}
        className={styles.dateLabel}
      >
        {t('total')}
      </Grid>
      <Grid
        item
        xs={6.5}
        md={6.5}
        lg={6.5}
        className={styles.totalDays}
      >
        {totalDaysAndHours}
      </Grid>
    </Grid>
  );
}
