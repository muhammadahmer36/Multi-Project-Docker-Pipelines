import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getUUID } from 'utilities';
import { UserRole } from 'common/types/types';
import { getCurrentMode, getSearchConfigurationForTimeOffRequestColor } from '../selectors';
import { ITimeOffRequest, SearchConfiguration, reviewStatus as reviewStatusEnum } from '../types';
import { getDetailOfTimeOffRequests } from '../slice';
import styles from './TimeOffRequest.module.scss';

export default function TimeOffRequest({
  processStatus, date, reason, reviewStatus,
  reviewStatusCode, requestId, startDate, endDate, employeeName,
}: ITimeOffRequest) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const currentRole = useSelector(getCurrentMode);
  const getReviewStatusConfiguration = useSelector(getSearchConfigurationForTimeOffRequestColor);
  const { pending } = reviewStatusEnum;

  const color = getReviewStatusConfiguration
    .find((eachStatusConfiguration: SearchConfiguration):
      boolean => eachStatusConfiguration.search_ReviewStatusCode === reviewStatusCode.toString())
    ?.displayColor;

  const handleItemClick = (
    date: string,
    startDate: string,
    endDate: string,
    requestId: number,
  ) => {
    const detailPayload = {
      requestId,
      date,
      startDate,
      endDate,
      listOfPayCodes: '',
    };
    dispatch(getDetailOfTimeOffRequests(detailPayload));
  };

  const displayProcessStatus = () => (
    reviewStatusCode !== pending && (
      <Box>
        <Typography className={styles.bottomValue}>
          {`${t('processStatus')} `}
          {processStatus}
        </Typography>
      </Box>
    )
  );

  const renderTextWithLineBreaks = (text: string) => text.split('<br>').map((part, index) => (
    <React.Fragment key={getUUID()}>
      {part}
      {index !== text.split('<br>').length - 1 && <br />}
    </React.Fragment>
  ));

  const renderEmployeeNameForManagerView = () => (
    currentRole !== UserRole.Employee
    && (
    <Box>
      <Typography className={styles.typographyText}>
        {employeeName}
      </Typography>
    </Box>
    )
  );

  return (
    <div
      className={styles.singleTimeOffRequest}
    >
      <Box
        ml={1.5}
        pt={0.4}
        pb={0.7}
        onClick={() => {
          handleItemClick(date, startDate, endDate, requestId);
        }}
        sx={{
          backgroundColor: color,
          borderColor: color,
        }}
        className={styles.timeOffRequest}
      >
        {renderEmployeeNameForManagerView()}
        <Box>
          <Typography
            className={styles.typographyText}
          >
            {renderTextWithLineBreaks(reason)}
          </Typography>
        </Box>
        <Box>
          <Typography
            className={styles.typographyText}
          >
            {date}
          </Typography>
        </Box>
        <Box>
          <Typography
            className={styles.typographyText}
          >
            {`${t('reviewStatus')} `}
            {reviewStatus}
          </Typography>
        </Box>
        {displayProcessStatus()}
      </Box>
    </div>
  );
}
