import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { getListOfReviewStatus } from 'pages/TimeOffCalendar/selectors';
import { setListOfReviewStatus } from 'pages/TimeOffCalendar/slice';
import { reviewStatus } from 'pages/TimeOffCalendar/types';
import styles from './Tags.module.scss';

export default function Tags() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const reviewStatuses = useSelector(getListOfReviewStatus);
  const { pending, denied, approved } = reviewStatus;

  const tags = [
    { status: pending, label: t('pending') },
    { status: approved, label: t('approved') },
    { status: denied, label: t('denied') },
  ];

  const handleChipClick = (reviewStatus: number) => () => {
    const updatedList = reviewStatuses.includes(reviewStatus)
      ? reviewStatuses.filter((item: number) => item !== reviewStatus)
      : [...reviewStatuses, reviewStatus];

    dispatch(setListOfReviewStatus(updatedList));
  };

  const getChipStyleClass = (status: number) => (reviewStatuses.includes(status) ? styles.filledChip : styles.unfilledChip);

  const renderTags = tags.map(({ status, label }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      key={status}
      className={getChipStyleClass(status)}
      onClick={handleChipClick(status)}
    >
      {label}
    </div>
  ));

  return (
    <div className={styles.tags}>
      <Typography
        mt={1}
        mb={0.5}
        className={styles.heading}
      >
        {t('tags')}
      </Typography>
      <div
        className={styles.tagContainer}
      >
        {renderTags}
      </div>
    </div>
  );
}
