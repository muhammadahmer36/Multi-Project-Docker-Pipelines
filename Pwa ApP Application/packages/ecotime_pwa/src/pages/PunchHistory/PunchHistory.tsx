import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker, Geofencing } from 'components';
import Header from 'layout/header/header';
import Box from '@mui/material/Box';
import {
  getDateInDayJSFormat, Dayjs, getDateMinusDays, formatsMapper,
} from 'core/utils';
import BottomBar from 'layout/bottomBar/bottomBar';
import { Resource } from 'common/types/types';
import Detail from './HistoryDetail';
import { getPunchHistoryList, setPunchHistory } from './slice';
import styles from './PunchHistory.module.scss';
import { getPunchHistorySearchDaysRestriction } from './selectors';

function PunchHistory() {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const phunchHistoryDaysRestriction = useSelector(getPunchHistorySearchDaysRestriction);

  const minimumSelectableDate = getDateMinusDays(phunchHistoryDaysRestriction);

  const [value, setValue] = React.useState<DateRange<Dayjs>>([
    getDateInDayJSFormat(),
    getDateInDayJSFormat(),
  ]);

  const handleDateRange = (dates: DateRange<Dayjs>) => {
    setValue(dates);
  };

  const getPunchHistory = () => {
    const dateRangeParams = [];
    dateRangeParams.push(value[0]?.format(formatsMapper['MM/DD/YYYY']));
    dateRangeParams.push(value[1]?.format(formatsMapper['MM/DD/YYYY']));
    const checkProperDates = value.every((val) => val !== null);
    if (checkProperDates) {
      dispatch(setPunchHistory([]));
      dispatch(getPunchHistoryList(dateRangeParams));
    }
  };

  const handleOkButton = () => {
    getPunchHistory();
  };

  useEffect(() => {
    getPunchHistory();
    return () => {
      dispatch(setPunchHistory([]));
    };
  }, []);

  return (
    <div className={styles.punchHistory}>
      <Header formLabel={t('punchHistory')} />
      <Geofencing.GeofencingResourceAlert resourceId={Resource.TimePunches} />
      <Geofencing.GeofencingResource resourceId={Resource.TimePunches}>
        <Box mt={0.9} mb={2} ml={2} mr={2}>
          <DateRangePicker
            label={t('Date')}
            value={value}
            minimumSelectableDate={minimumSelectableDate}
            closeDateRangeOnSelection={false}
            handleDateRange={handleDateRange}
            handleOkButton={handleOkButton}
          />
        </Box>
        <Box mt={2} ml={2} mr={2}>
          <Detail />
        </Box>
        <BottomBar />
      </Geofencing.GeofencingResource>
    </div>
  );
}

export default PunchHistory;
