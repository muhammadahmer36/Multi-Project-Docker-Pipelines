import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  EmployeeInformation,
  Calender, Geofencing,
  BalanceHeader,
} from 'components';
import BottomBar from 'layout/bottomBar/bottomBar';
import Box from '@mui/material/Box';
import { CalendarRef } from 'components/Calender/Calender';
import { Resource, UserRole } from 'common/types/types';
import { balanceSearchManager, balances, firstRecord } from 'appConstants';
import { getCurrentFormattedDate, isDateValidAndWithinRange } from 'core/utils';
import PaginationInformation from './PaginationInformation';
import {
  getBalanceCategories, getBalanceForTimesheetGroups, saveEmployee, saveSelectedTimesheetGroup,
  setBalanceDate, setBalanceParams, setUserCurrentRole,
} from './slice';
import List from './List';
import {
  getBalanceDate, getBalanceGroupes, getBalanceParams, getBalanceRole,
  getBalanceUserCurrentRole, getHeaderInfo, getResourceInformation, getSelectedEmployee,
} from './selectors';
import BalanceActionButtons from './BalanceActionButtons';
import { GroupBalance } from './types';
import styles from './Balances.module.scss';

function Balances() {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const navigate = useNavigate();
  const calendarRef = useRef<CalendarRef>(null);
  const headerInfo = useSelector(getHeaderInfo);
  const balanceDate = useSelector(getBalanceDate);
  const employee = useSelector(getSelectedEmployee);
  const userCurrentRole = useSelector(getBalanceUserCurrentRole);
  const userRole = useSelector(getBalanceRole);
  const balanceGroupes = useSelector(getBalanceGroupes);
  const resourceInformation = useSelector(getResourceInformation);
  const balanceParams = useSelector(getBalanceParams);
  const { currentPageId } = balanceParams || {};
  const balancesForTimesheetGroup = employee === null;

  const handleDateSelect = (date: string) => {
    if (isDateValidAndWithinRange(date)) {
      dispatch(setBalanceDate(date));
      const balanceForAnEmployee = { date };
      const balanceForTimesheetGroups = {
        date,
        page: balances,
        navigate,
        pageid: currentPageId || firstRecord,
      };

      if (userCurrentRole === UserRole.Employee || !balancesForTimesheetGroup) {
        dispatch(getBalanceCategories(balanceForAnEmployee));
      } else {
        dispatch(getBalanceForTimesheetGroups(balanceForTimesheetGroups));
      }
    }
  };

  const handleClickOnManager = () => {
    dispatch(setBalanceDate(getCurrentFormattedDate()));
    dispatch(setUserCurrentRole(UserRole.Manager));
    dispatch(saveSelectedTimesheetGroup(null));
    dispatch(saveEmployee(null));
    dispatch(setBalanceParams(null));
    navigate(balanceSearchManager);
  };

  const handleClickOnEmployee = () => {
    if (calendarRef.current) {
      calendarRef.current.setCurrentDateToCalendar();
    }
    dispatch(setUserCurrentRole(UserRole.Employee));
    dispatch(setBalanceDate(getCurrentFormattedDate()));
    dispatch(getBalanceCategories({
      date: getCurrentFormattedDate(),
    }));
  };

  return (
    <div className={styles.balances}>
      <BalanceHeader
        formLabel={t('balances')}
        currentUserRole={userCurrentRole}
        userRole={userRole}
        handleClickOnManagerIcon={handleClickOnManager}
        handleClickOnEmployeeIcon={handleClickOnEmployee}
      />
      <main>
        <Geofencing.GeofencingResourceAlert resourceId={Resource.Balances} />
        {userCurrentRole === UserRole.Manager && (
          <EmployeeInformation
            employeeName={resourceInformation?.employeeNameText}
            paginationInformation={(
              <PaginationInformation
                balancesForTimesheetGroup={balancesForTimesheetGroup}
              />
            )}
          />
        )}
        <Geofencing.GeofencingResource resourceId={Resource.Balances}>
          <Box mt={2} ml={2} mr={2}>
            <div>
              <Calender
                viewMode={['year', 'day']}
                dateValue={balanceDate}
                ref={calendarRef}
                calendarLabel={headerInfo?.tableTitle || ''}
                onDateSelect={handleDateSelect}
              />
            </div>
          </Box>
          {
            balanceGroupes.map((eachItem: GroupBalance, index: number) => (
              <Box
              // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={styles.borders}
                mt={2}
                ml={2}
                mr={2}
              >
                <List groupedBalance={eachItem} />
              </Box>
            ))
          }
        </Geofencing.GeofencingResource>
      </main>
      {
        userCurrentRole === UserRole.Manager
        && (
          <BalanceActionButtons
            showChevronButtons={balancesForTimesheetGroup}
          />
        )
      }
      <BottomBar />
    </div>
  );
}
export default Balances;
