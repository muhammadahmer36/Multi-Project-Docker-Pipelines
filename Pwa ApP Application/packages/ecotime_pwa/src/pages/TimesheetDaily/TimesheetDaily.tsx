import {
  DropDown, Geofencing, StyledTextField, TimesheetActionButton, TimesheetHeader,
} from 'components';
import { ListItem } from 'components/DropDown/types';
import BottomBar from 'layout/bottomBar/bottomBar';
import ListHeader from 'pages/TimesheetDaily/DayList/Header';
import { getPayPeriod } from 'pages/Timesheet/selectors';
import {
  useEffect,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toLocaleDateString } from 'core/utils';
import { Resource } from 'common/types/types';
import { TimesheetActions } from 'pages/dashboard/types';
import { aprovedUnapprove, certifyUncertifyKey } from 'components/TimesheetActionButton/TimesheetActionButton';
import DayList from './DayList';
import styles from './TimesheetDaily.module.scss';
import {
  getDailyDetailsList,
  getDay,
  getDays,
} from './selectors';
import { setDay } from './slice';

export default function TimeSheetDaily() {
  const location = useLocation();
  const { state } = location;
  const data = useSelector(getDailyDetailsList) || [];
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const payPeriod = useSelector(getPayPeriod);
  const days = useSelector(getDays);
  const day = useSelector(getDay);
  const { Certitfy, UnCertitfy, Calculate } = TimesheetActions;
  const listContainerRef = useRef<HTMLDivElement>(null);

  const onChangeWeek = (value: string | undefined) => {
    if (value) {
      const selectedItem = days.find((item: ListItem) => item.code === value);
      dispatch(setDay(selectedItem));
    }
  };
  useEffect(() => {
    if (state && state.groupTitle && days.length > 0) {
      const { groupTitle } = state;
      const selectedGroupTitle = toLocaleDateString(groupTitle);
      const selectedDay = days.find(({
        code,
      }: ListItem) => {
        const itemDate = toLocaleDateString(code);
        const item = selectedGroupTitle === itemDate;
        return item;
      });
      if (selectedDay) {
        dispatch(setDay(selectedDay));
      }
    }
  }, [state.groupTitle, days.length]);

  return (
    <div className={styles.timesheetContainer}>
      <div className={styles.header}>
        <TimesheetHeader />
      </div>
      <Geofencing.GeofencingResourceAlert resourceId={Resource.Timesheet} />
      <div className={styles.timesheet}>
        <Geofencing.GeofencingResource resourceId={Resource.Timesheet}>
          <div className={styles.payPeriod}>
            <StyledTextField
              label={t('payPeriod')}
              value={payPeriod.description}
              contentEditable={false}
            />
          </div>
          <div className={styles.weeks}>
            <DropDown
              label={t('tsDay')}
              error={false}
              onChange={onChangeWeek}
              list={days}
              value={day}
            />
          </div>
          <div className={styles.list}>
            {data.length === 0 && <ListHeader />}
            {data.length === 0 ? (
              <div className={styles.noDataFound}>
                {t('noDataFound')}
              </div>
            )
              : (
                <div ref={listContainerRef} className={styles.listContainer}>
                  <DayList listContainerRef={listContainerRef} />

                </div>
              )}
            <TimesheetActionButton
              hideActionIds={[Certitfy, UnCertitfy, Calculate, certifyUncertifyKey, aprovedUnapprove]}
            />
          </div>
        </Geofencing.GeofencingResource>
        <div className={styles.footer}>
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
