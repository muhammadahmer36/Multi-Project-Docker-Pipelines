import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OfflineModal } from 'components';
import {
  formatDateToLocale,
  formatTimeLabelToLocale,
  getCurrentDateTimeUtC,
  getTimeZoneAbbreviation,
} from 'core/utils';
import transferIcon from 'assets/img/transfer.svg';
import timeOutIcon from 'assets/img/out.svg';
import timeInIcon from 'assets/img/in.svg';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getOffline } from 'core/offline/selectors';
import useRunningClockDBServer from 'core/runningClockSyncing/hooks/useRunningClockDBServer';
import useRunningClock from 'core/runningClockSyncing/hooks/useRunningClock';
import { setUniqueId } from 'common/slice/common';
import { additionalInformation as additionalInformationRoute } from 'appConstants';
import { setPunchHeaderInformation } from 'pages/AdditionalData/slice';
import { getUUID } from 'utilities';
import useNavigateToAdditionalDataForm from 'pages/AdditionalData/hooks/useNavigateToAdditionalDataForm';
import {
  getAdditionalInformationIn, getAdditionalInformationOut,
  getAdditionalInformationTransfer,
}
  from 'pages/AdditionalData/selectors';
import { AdditionalDataNavigationParams } from 'pages/AdditionalData/types';
import { notifyGeofenceRestrictiveActivity } from 'core/geolocation/slice';
import { Resource } from 'common/types/types';
import {
  getShowLoader,
  getNexPunch,
  getTimeIn,
  getTransfer,
  getTimeOut,
} from './selector';
import { getDateAndTimeFormat } from '../selectors';
import {
  timePunch,
  setLastPunch,
  setNextPunch,
  setCurrentPunch,
} from './slice';
import Item from './Item';
import {
  In,
  Out,
  TimePunchTransfer,
  dateFormatOfLocalPunch,
  timeInBackgroundColor,
  timeOutBackgroundColor,
  transferBackgroundColor,
} from './constants';
import FooterItem from './FooterItem';
import { TimePunch } from './types';
import styles from './TimePunch.module.scss';

export default function TimePunching() {
  const { showOpenOfflineActionSnackBar, setOfflineMessage } = OfflineModal.useModalContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dbServerGMT = useRunningClockDBServer();
  const runningClock = useRunningClock();
  const [t] = useTranslation();
  const offline = useSelector(getOffline);
  const loading = useSelector(getShowLoader);
  const additionalInformationIn = useSelector(getAdditionalInformationIn);
  const additionalInformationOut = useSelector(getAdditionalInformationOut);
  const additionalInformationTransfer = useSelector(getAdditionalInformationTransfer);
  const timeIn = useSelector(getTimeIn);
  const timeOut = useSelector(getTimeOut);
  const transfer = useSelector(getTransfer);
  const nextPunch = useSelector(getNexPunch);
  const { timeFormat } = useSelector(getDateAndTimeFormat);
  const { TimeIn, TimeOut, Transfer } = TimePunch;

  const navigateToAdditionalData = ({ getAdditionalData, additionalInformation }
    : AdditionalDataNavigationParams) => {
    if (getAdditionalData && offline && additionalInformation?.punchDetails) {
      navigate(additionalInformationRoute);
    }
  };

  const offlinePunch = offline ? { isOfflinePunch: offline } : {};

  const setPunchInformation = (date: string, timePunchType: string) => {
    const timeZoneAbbreviation = getTimeZoneAbbreviation();
    const currentDateTimeUTC = getCurrentDateTimeUtC();
    const time = formatTimeLabelToLocale(currentDateTimeUTC, timeFormat);
    const punchInformation = t('punchInformation', {
      TimePunch: timePunchType,
      time,
      date,
      timeZoneAbbreviation,
    });
    dispatch(setPunchHeaderInformation(punchInformation));
  };

  const onTimeIn = () => {
    const currentDateTimeUTC = getCurrentDateTimeUtC();
    const time = formatTimeLabelToLocale(currentDateTimeUTC, timeFormat);
    const date = formatDateToLocale(currentDateTimeUTC, dateFormatOfLocalPunch);
    const timeZoneAbbreviation = getTimeZoneAbbreviation();

    const lastPunchText = t('lastPunch', {
      TimePunch: In,
      time,
      timeZoneAbbreviation,
      date,
    });
    if (offline) {
      dispatch(setLastPunch(lastPunchText));
      setPunchInformation(date, In);
    }
    const uniqueId = getUUID();
    dispatch(setUniqueId(uniqueId));
    dispatch(setCurrentPunch(TimeIn));
    dispatch(setNextPunch(TimeOut));
    dispatch(timePunch({
      time: runningClock,
      punch: TimeIn,
      dbServerGMT,
      uniqueId,
      ...offlinePunch,
    }));
    const offlineToastMessage = t('offlineTimePunchMessage', {
      TimePunch: In,
      time,
      date,
      timeZoneAbbreviation,
    });
    dispatch(notifyGeofenceRestrictiveActivity({ resourceId: Resource.TimePunches }));
    setOfflineMessage(offlineToastMessage);
    showOpenOfflineActionSnackBar();
    const { getAdditionalData } = timeIn;
    const navigationParams: AdditionalDataNavigationParams = {
      getAdditionalData,
      additionalInformation: additionalInformationIn,
    };
    navigateToAdditionalData(navigationParams);
  };

  const onTimeOut = () => {
    const currentDateTimeUTC = getCurrentDateTimeUtC();
    const time = formatTimeLabelToLocale(currentDateTimeUTC, timeFormat);
    const date = formatDateToLocale(currentDateTimeUTC, dateFormatOfLocalPunch);
    const timeZoneAbbreviation = getTimeZoneAbbreviation();
    const lastPunchText = t('lastPunch', {
      TimePunch: Out,
      time,
      timeZoneAbbreviation,
      date,
    });
    if (offline) {
      dispatch(setLastPunch(lastPunchText));
      setPunchInformation(date, Out);
    }
    const uniqueId = getUUID();
    dispatch(setUniqueId(uniqueId));
    dispatch(setCurrentPunch(TimeOut));
    dispatch(setNextPunch(TimeIn));
    dispatch(timePunch({
      time: runningClock,
      punch: TimeOut,
      dbServerGMT,
      uniqueId,
      ...offlinePunch,
    }));
    const offlineToastMessage = t('offlineTimePunchMessage', {
      TimePunch: Out,
      time,
      date,
      timeZoneAbbreviation,
    });
    dispatch(notifyGeofenceRestrictiveActivity({ resourceId: Resource.TimePunches }));
    setOfflineMessage(offlineToastMessage);
    showOpenOfflineActionSnackBar();
    const { getAdditionalData } = timeOut;
    const navigationParams: AdditionalDataNavigationParams = {
      getAdditionalData,
      additionalInformation: additionalInformationOut,
    };
    navigateToAdditionalData(navigationParams);
  };

  const onTransfer = () => {
    showOpenOfflineActionSnackBar();
    const currentDateTimeUTC = getCurrentDateTimeUtC();
    const time = formatTimeLabelToLocale(currentDateTimeUTC, timeFormat);
    const date = formatDateToLocale(currentDateTimeUTC, dateFormatOfLocalPunch);
    const timeZoneAbbreviation = getTimeZoneAbbreviation();
    const lastPunchText = t('lastPunch', {
      TimePunch: In,
      time,
      timeZoneAbbreviation,
      date,
    });
    if (offline) {
      dispatch(setLastPunch(lastPunchText));
      setPunchInformation(date, TimePunchTransfer);
    }
    const uniqueId = getUUID();
    dispatch(setUniqueId(uniqueId));
    dispatch(setCurrentPunch(Transfer));
    dispatch(timePunch({
      time: runningClock,
      punch: Transfer,
      dbServerGMT,
      uniqueId,
      ...offlinePunch,
    }));
    const offlineToastMessage = t('offlineTimePunchMessage', {
      TimePunch: TimePunchTransfer,
      time,
      date,
      timeZoneAbbreviation,
    });
    dispatch(notifyGeofenceRestrictiveActivity({ resourceId: Resource.TimePunches }));
    setOfflineMessage(offlineToastMessage);
    showOpenOfflineActionSnackBar();
    const { getAdditionalData } = transfer;
    const navigationParams: AdditionalDataNavigationParams = {
      getAdditionalData,
      additionalInformation: additionalInformationTransfer,
    };
    navigateToAdditionalData(navigationParams);
  };

  useNavigateToAdditionalDataForm();

  return (
    <div className={styles.container}>
      <div className={styles.punchContainer}>
        <Item
          onClick={onTimeIn}
          imageSource={timeInIcon}
          punch={timeIn}
          type={TimeIn}
          nextPunch={nextPunch}
          backgroundColor={timeInBackgroundColor}
          label={t('in')}
        />
        <Item
          onClick={onTimeOut}
          imageSource={timeOutIcon}
          punch={timeOut}
          type={TimeOut}
          nextPunch={nextPunch}
          backgroundColor={timeOutBackgroundColor}
          label={t('out')}

        />
        <Item
          onClick={onTransfer}
          imageSource={transferIcon}
          punch={transfer}
          type={TimeOut}
          nextPunch={nextPunch}
          backgroundColor={transferBackgroundColor}
          label={t('transfer')}
        />
      </div>
      <FooterItem />
      {/* will create this common component */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress className={styles.circularProgess} />
      </Backdrop>
    </div>
  );
}
