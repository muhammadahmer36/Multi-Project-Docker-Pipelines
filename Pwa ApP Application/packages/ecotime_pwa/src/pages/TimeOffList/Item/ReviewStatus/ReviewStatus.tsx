import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  reviewStatus as reviewStatusEnum, SearchConfiguration,
} from 'pages/TimeOffCalendar/types';
import { Chip } from 'components';
import { getSearchConfigurationForTimeOffRequestColor } from 'pages/TimeOffCalendar/selectors';
import { removeFirsLetterFromString } from 'utilities';
import styles from './ReviewStatus.module.scss';

interface ReviewStatusProps {
  reviewStatus: string;
  reviewStatusTitle: string;
  reviewStatusDisplayTitle: string;
  reviewStatusColor: string;
  reviewStatusCode: number;
  onRowClick: () => void;
}
export default function ReviewStatus(props: ReviewStatusProps) {
  const {
    reviewStatus, reviewStatusTitle, reviewStatusDisplayTitle, reviewStatusCode,
    reviewStatusColor, onRowClick,
  } = props;
  const { pending } = reviewStatusEnum;
  const getReviewStatusConfiguration = useSelector(getSearchConfigurationForTimeOffRequestColor);
  const color = getReviewStatusConfiguration
    .find((eachStatusConfiguration: SearchConfiguration):
      boolean => eachStatusConfiguration.displayColor === reviewStatusColor)
    ?.displayColor;

  return (
    <Grid
      container
      onClick={onRowClick}
      className={styles.mainContainer}
    >
      <Grid
        item
        xs={5}
        md={5}
        lg={5}
        className={styles.reviewStatusKey}
      >
        <Typography
          mt={0.5}
          className={styles.typographyHeading}
        >
          {reviewStatus}
        </Typography>
      </Grid>
      <Grid
        item
        xs={3.5}
        md={3.5}
        lg={3.5}
        className={styles.marginBetweenItem}
      >
        <Chip
          label={reviewStatusTitle}
          styleClass={styles.approved}
          sx={{
            backgroundColor: color,
          }}
        />
      </Grid>
      <Grid
        item
        xs={5}
        md={5}
        lg={5}
        className={styles.reviewStatusKey}
      />
      {reviewStatusCode !== pending && (
        <Grid
          item
          xs={7}
          md={7}
          lg={7}
          className={styles.reviewStatusValue}
        >
          <Typography
            className={styles.typographyValue}
          >
            {removeFirsLetterFromString(reviewStatusDisplayTitle)}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
