import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BalanceHeader, Calender, DropDown } from 'components';
import Box from '@mui/material/Box';
import {
  getBalanceDate, getBalanceRole, getBalanceUserCurrentRole, getHeaderInfo, getSelectedEmployee,
  getSelectedTimesheetGroup,
} from 'pages/Balances/selectors';
import { getBalances } from 'pages/dashboard/selectors';
import { getDropDownListLoader, getEmployeeListOfManager, getTimesheeGroups } from 'common/selectors/common';
import { CalendarRef } from 'components/Calender/Calender';
import {
  getBalanceCategories, getBalanceForTimesheetGroups, saveEmployee,
  saveSelectedTimesheetGroup, setBalanceDate, setUserCurrentRole,
} from 'pages/Balances/slice';
import {
  getEmployeesOfManger, getTimesheetGroups, setDropDownLoader, setEmployeeList,
} from 'common/slice/common';
import { balances, dropDownMinimumSearchLength, firstRecord } from 'appConstants';
import BottomBar from 'layout/bottomBar/bottomBar';
import { ListItem } from 'components/DropDown/types';
import { UserRole } from 'common/types/types';
import { isDateValidAndWithinRange } from 'core/utils';
import Footer from './Footer';
import styles from './BalanceSearchManager.module.scss';

export default function BalanceSearchManager() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const headerInfo = useSelector(getHeaderInfo);
  const balanceDate = useSelector(getBalanceDate);
  const employeeList = useSelector(getEmployeeListOfManager);
  const balanceResource = useSelector(getBalances);
  const timesheetGroups = useSelector(getTimesheeGroups);
  const selectedEmployee = useSelector(getSelectedEmployee);
  const userCurrentRole = useSelector(getBalanceUserCurrentRole);
  const selectedTimesheetGroup = useSelector(getSelectedTimesheetGroup);
  const dropDownListLoading = useSelector(getDropDownListLoader);
  const userRole = useSelector(getBalanceRole);
  const { resourceId } = balanceResource;
  const calendarRef = useRef<CalendarRef>(null);
  const { pathname } = location;

  const disableSearchButton = (selectedEmployee === null && selectedTimesheetGroup === null) || balanceDate === '';

  const handleDateSelect = (date: string) => {
    if (isDateValidAndWithinRange(date)) {
      dispatch(setBalanceDate(date));
    } else {
      dispatch(setBalanceDate(''));
    }
  };

  const getEmployeeList = (searchParam: string) => {
    const getEmployeeListQueryParams = {
      resourceId,
      searchString: searchParam,
    };
    dispatch(getEmployeesOfManger(getEmployeeListQueryParams));
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: searchText } = e.target;
    if (searchText.length >= dropDownMinimumSearchLength) {
      dispatch(setDropDownLoader(true));
      getEmployeeList(searchText);
    } else {
      dispatch(setEmployeeList([]));
    }
  };

  const handleSelectEmployee = (value: string | undefined) => {
    if (value) {
      const selectedItem = employeeList.find((item: ListItem) => item.code === value);
      dispatch(saveEmployee(selectedItem));
    } else {
      dispatch(saveEmployee(null));
    }
  };

  const handleSearchButton = () => {
    if (selectedTimesheetGroup) {
      dispatch(getBalanceForTimesheetGroups({
        date: balanceDate,
        page: pathname,
        navigate,
        pageid: firstRecord,
      }));
    } else {
      dispatch(getBalanceCategories({ date: balanceDate, page: pathname, navigate }));
    }
  };

  const handleClickOnEmployee = () => {
    dispatch(setUserCurrentRole(UserRole.Employee));
    dispatch(getBalanceCategories({
      date: balanceDate,
    }));
    navigate(balances);
  };

  const handleSelectTimesheetGroup = (value: string | undefined) => {
    if (value) {
      const selectedItem = timesheetGroups.find((item: ListItem) => item.code === value);
      dispatch(saveSelectedTimesheetGroup(selectedItem));
    } else {
      dispatch(saveSelectedTimesheetGroup(null));
    }
  };

  const clearForm = () => {
    if (calendarRef.current) {
      calendarRef.current.setCurrentDateToCalendar();
    }
    dispatch(saveEmployee(null));
    dispatch(saveSelectedTimesheetGroup(null));
  };

  useEffect(() => {
    dispatch(getTimesheetGroups(resourceId));
  }, []);

  return (
    <div className={styles.balanceSearch}>
      <BalanceHeader
        formLabel={t('balances')}
        currentUserRole={userCurrentRole}
        userRole={userRole}
        handleClickOnEmployeeIcon={handleClickOnEmployee}
      />
      <Box
        className={styles.form}
        mt={2}
        ml={2}
        mr={2}
      >
        <div>
          <Calender
            viewMode={['year', 'day']}
            dateValue={balanceDate}
            ref={calendarRef}
            calendarLabel={headerInfo?.tableTitle || ''}
            onDateSelect={handleDateSelect}
          />
          <Box mt={1.5}>
            <DropDown
              label={t('employeeName')}
              error={false}
              disabled={selectedTimesheetGroup !== null}
              list={employeeList}
              value={selectedEmployee}
              loading={dropDownListLoading}
              readOnlyInput={false}
              onChange={handleSelectEmployee}
              onChangeTextInput={handleOnChange}
            />
          </Box>
          <Box mt={1.5}>
            <DropDown
              label={t('timesheetGroup')}
              error={false}
              value={selectedTimesheetGroup}
              disabled={selectedEmployee !== null}
              onChange={handleSelectTimesheetGroup}
              list={timesheetGroups}
            />
          </Box>
        </div>
        <Footer
          primaryLabel={t('clear')}
          secondaryLabel={t('search')}
          footerClass={styles.footer}
          handleSecondaryButton={handleSearchButton}
          handlePrimaryButton={clearForm}
          shouldButtonDisable={disableSearchButton}
        />
      </Box>
      <BottomBar />
    </div>
  );
}
