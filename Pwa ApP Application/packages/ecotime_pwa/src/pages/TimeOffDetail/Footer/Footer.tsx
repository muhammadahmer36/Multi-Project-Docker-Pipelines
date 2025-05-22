import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { getActionsTimeOffDetail, getSummaryOfItemsDetail } from 'pages/TimeOffCalendar/selectors';
import { getTotalDaysAndHours } from 'utilities';
import IconButton from '@mui/material/IconButton';
import { timeOffAction, timeOffActionsButtons } from 'pages/TimeOffCalendar/types';
import styles from './Footer.module.scss';

interface FooterProps {
  handleOnNotesIconClick: () => void;
}

export default function Footer(props: FooterProps) {
  const { handleOnNotesIconClick } = props;
  const [t] = useTranslation();
  const summaryOfItemsDetail = useSelector(getSummaryOfItemsDetail);
  const { viewNotes } = timeOffActionsButtons;
  const actionTimeOffDetail = useSelector(getActionsTimeOffDetail) || [];
  /* eslint-disable camelcase */
  const { totalHours, totalDays_DisplayTitle } = summaryOfItemsDetail ?? {};

  const totalDaysAndHours = getTotalDaysAndHours(totalHours, t('hrs'), totalDays_DisplayTitle);

  const hasViewNotesAction = () => actionTimeOffDetail.some((eachAction: timeOffAction) => eachAction.actionId === viewNotes);

  return (
    <Grid
      container
      className={styles.mainContainer}
    >
      <Grid
        item
        xs={3}
        md={3}
        lg={3}
        className={styles.dateLabel}
      >
        {t('total')}
      </Grid>
      <Grid
        item
        xs={7}
        md={7}
        lg={7}
        className={styles.totalDays}
      >
        {totalDaysAndHours}
      </Grid>
      <Grid
        item
        xs={2}
        md={2}
        lg={2}
        sx={{
          paddingTop: '10px',
          paddingLeft: '13px',
        }}
      >
        {
          hasViewNotesAction()
          && (
          <IconButton
            sx={{
              padding: '0px',
            }}
            onClick={handleOnNotesIconClick}
          >
            <div className={styles.viewNoteIconBackGround}>
              <DescriptionOutlinedIcon
                className={styles.viewNoteIcon}
              />
            </div>
          </IconButton>
          )
        }
      </Grid>
    </Grid>
  );
}
