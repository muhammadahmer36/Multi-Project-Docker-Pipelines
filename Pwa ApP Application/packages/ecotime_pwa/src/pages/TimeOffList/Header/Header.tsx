import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StyledCheckBox } from 'components';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { setSummaryInformation } from 'pages/TimeOffCalendar/slice';
import { getCurrentMode, getSummaryInformation, getUserRole } from 'pages/TimeOffCalendar/selectors';
import { SummaryInformation, reviewStatus } from 'pages/TimeOffCalendar/types';
import { UserRole } from 'common/types/types';
import styles from './Header.module.scss';

export default function ListHeader() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const allTimeOffRequest = useSelector(getSummaryInformation);
  const currentUserMode = useSelector(getCurrentMode);
  const userRole = useSelector(getUserRole);
  const { pending } = reviewStatus;
  const gridHeading = userRole !== UserRole.Employee ? t('timeOffRequestsList') : t('timeOffRequests');

  const toggleDeleteStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (currentUserMode !== UserRole.Manager) {
      const updatedTimeOfRequests = allTimeOffRequest
        .map((eachRequest: SummaryInformation) => ({
          ...eachRequest,
          isDeleted: eachRequest
            .reviewStatus_Code === pending && event.target.checked,
        }));
      dispatch(setSummaryInformation(updatedTimeOfRequests));
    }
  };

  const checkAllTimeOfRequestDeleteStatus = () => {
    const filteredRequests = allTimeOffRequest.filter((eachItem: SummaryInformation) => eachItem.reviewStatus_Code === pending);
    const allTimeOffRequestChecked = filteredRequests
      .length > 0 ? filteredRequests.every((eachItem: SummaryInformation) => eachItem.isDeleted) : false;
    return allTimeOffRequestChecked;
  };

  const disabledCheckBox = allTimeOffRequest.every((eachItem: SummaryInformation) => eachItem.reviewStatus_Code !== pending);
  const checkTimeOffRequests = checkAllTimeOfRequestDeleteStatus();

  return (
    <Grid
      container
      className={styles.mainContainer}
    >
      <Grid
        item
        xs={12}
        md={12}
        lg={12}
        ml={1}
        className={styles.marginFromLeft}
        display="flex"
        alignItems="center"
      >
        <StyledCheckBox
          label=""
          disabled={disabledCheckBox}
          onChange={toggleDeleteStatus}
          checked={checkTimeOffRequests}
          className={styles.fillCheckBoxColor}
        />
        <Typography
          className={styles.heading}
        >
          {gridHeading}
        </Typography>
      </Grid>
    </Grid>
  );
}
