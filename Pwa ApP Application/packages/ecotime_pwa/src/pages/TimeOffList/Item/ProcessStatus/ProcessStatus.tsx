import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  reviewStatus as reviewStatusEnum, processStatus as processStatusEnum,
} from 'pages/TimeOffCalendar/types';
import { removeFirsLetterFromString } from 'utilities';
import styles from './ProcessStatus.module.scss';

interface ProcessStatusProps {
  processStatus: string;
  reviewStatusTitle: string;
  reviewStatusDisplayTitle: string;
  reviewStatusCode: number;
  onRowClick: () => void;
}
export default function ProcessStatus(props: ProcessStatusProps) {
  const {
    processStatus, reviewStatusTitle, reviewStatusDisplayTitle, reviewStatusCode, onRowClick,
  } = props;
  const { pending } = reviewStatusEnum;
  const { notProcessed } = processStatusEnum;

  return (
    reviewStatusCode !== pending ? (
      <Grid
        container
        onClick={onRowClick}
        className={`${styles.marginAtLastGrid} ${styles.marginBetweenGrids} ${styles.mainContainer}`}
      >
        <Grid
          item
          xs={5}
          md={5}
          lg={5}
          className={styles.processStatusKey}
        >
          <Typography
            className={styles.typographyHeading}
          >
            {processStatus}
          </Typography>
        </Grid>
        <Grid
          item
          xs={7}
          md={7}
          lg={7}
          className={styles.processStatusValue}
        >
          <Typography
            className={styles.typographyValue}
          >
            {reviewStatusTitle}
          </Typography>
        </Grid>

        <Grid
          item
          xs={5}
          md={5}
          lg={5}
          className={styles.reviewStatusKey}
        />
        {reviewStatusDisplayTitle !== notProcessed && (
          <Grid
            item
            xs={7}
            md={7}
            lg={7}
            className={styles.processStatusValue}
          >
            <Typography
              sx={{
                marginTop: '-8px',
              }}
              className={styles.typographyValue}
            >
              {removeFirsLetterFromString(reviewStatusDisplayTitle)}
            </Typography>
          </Grid>
        )}
      </Grid>
    ) : null
  );
}
