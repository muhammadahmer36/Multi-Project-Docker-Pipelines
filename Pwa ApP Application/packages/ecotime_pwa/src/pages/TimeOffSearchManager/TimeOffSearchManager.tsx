import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calender, DropDown, TimeOffPageFooter, TimeOffHeader,
} from 'components';
import { formatsMapper, getDateAgainstFormat } from 'core/utils';
import {
  saveEndDateOfTimeOffRequest, saveSelectedEmployees, setUserCurrentRole, saveSelectedTimesheetGroup,
  getTimeOffRequests,
  setListOfReviewStatus,
} from 'pages/TimeOffCalendar/slice';
import { getDropDownListLoader, getEmployeeListOfManager, getTimesheeGroups } from 'common/selectors/common';
import { getTimeOff } from 'pages/dashboard/selectors';
import {
  getEmployeesOfManger, getTimesheetGroups, setDropDownLoader, setEmployeeList,
} from 'common/slice/common';
import BottomBar from 'layout/bottomBar/bottomBar';
import Box from '@mui/material/Box';
import { yearMonthDayFormat, timeOff, dropDownMinimumSearchLength } from 'appConstants';
import {
  getCurrentMode,
  getEndDateOfTimeOffRequest,
  getListOfEmployees,
  getListOfReviewStatus,
  getSelectedTimesheetGroup, getUserRole,
} from 'pages/TimeOffCalendar/selectors';
import { ListItem } from 'components/DropDown/types';
import { UserRole } from 'common/types/types';
import Tags from './Tags';
import { DropDownCondition } from './types';
import useDisabledDropDown from './hooks/useDisabledDropDown';
import styles from './TimeOffSearchManager.module.scss';
import { shouldDisabledSearchButton } from './utilities';

export default function TimeOffSearch() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const employeeList = useSelector(getEmployeeListOfManager);
  const timesheetGroups = useSelector(getTimesheeGroups);
  const selectedTimesheetGroup = useSelector(getSelectedTimesheetGroup);
  const timeOffRequestEndDate = useSelector(getEndDateOfTimeOffRequest);
  const selectedEmployeeList = useSelector(getListOfEmployees);
  const dropDownListLoading = useSelector(getDropDownListLoader);
  const timeOffResource = useSelector(getTimeOff);
  const userCurrentRole = useSelector(getCurrentMode);
  const { resourceId } = timeOffResource;

  const selectedReviewStatuses = useSelector(getListOfReviewStatus);
  const { timesheetDisabled, employeeDisabled } = DropDownCondition;
  const userRole = useSelector(getUserRole);

  const disabledSearchButton = shouldDisabledSearchButton(
    selectedReviewStatuses,
    selectedTimesheetGroup,
    selectedEmployeeList,
  );

  const { disableDropDown } = useDisabledDropDown({
    selectedEmployeeList,
    selectedTimesheetGroup,
  });

  const onDateChange = (value: string | undefined) => {
    if (value) {
      dispatch(saveEndDateOfTimeOffRequest(value));
    }
  };

  const handleSearchButton = () => {
    const date = getDateAgainstFormat(timeOffRequestEndDate, formatsMapper[yearMonthDayFormat]);
    dispatch(saveEndDateOfTimeOffRequest(date));
    dispatch(getTimeOffRequests({ date, page: pathname, navigate }));
  };

  const handleMultiSelect = (seletedEmployees: ListItem[] | undefined) => {
    if (seletedEmployees) {
      dispatch(saveSelectedEmployees(seletedEmployees));
    }
  };

  const handleSelectTimesheetGroup = (value: string | undefined) => {
    if (value) {
      const selectedItem = timesheetGroups.find((item: ListItem) => item.code === value);
      dispatch(saveSelectedTimesheetGroup(selectedItem));
    } else {
      dispatch(saveSelectedTimesheetGroup(null));
    }
  };

  const clearFormData = () => {
    dispatch(saveSelectedEmployees([]));
    dispatch(setListOfReviewStatus([]));
    dispatch(saveSelectedTimesheetGroup(null));
  };

  const handleEmployeeClick = () => {
    clearFormData();
    dispatch(setUserCurrentRole(UserRole.Employee));
    navigate(timeOff);
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

  const handleClearButton = () => {
    clearFormData();
  };

  useEffect(() => {
    dispatch(setEmployeeList([]));
    dispatch(getTimesheetGroups(resourceId));
  }, []);

  return (
    <div className={styles.timeOffSearch}>
      <TimeOffHeader
        formLabel={t('Time Off')}
        userRole={userRole}
        currentUserRole={userCurrentRole}
        handleClickOnEmployeeIcon={handleEmployeeClick}
      />
      <Box
        className={styles.form}
      >
        <Calender
          viewMode={['year', 'month']}
          dateValue={timeOffRequestEndDate}
          format="MMMM,YYYY"
          calendarLabel={t('month')}
          onDateSelect={onDateChange}
        />
        <Tags />
        <DropDown
          label={t('employeeName')}
          error={false}
          multiple
          disableCloseOnSelect
          disabled={disableDropDown === employeeDisabled}
          multipeSelectonChange={handleMultiSelect}
          list={employeeList}
          loading={dropDownListLoading}
          value={selectedEmployeeList}
          readOnlyInput={false}
          onChangeTextInput={handleOnChange}
        />
        <Box mt={1.2} />
        <DropDown
          label={t('timesheetGroup')}
          error={false}
          value={selectedTimesheetGroup}
          disabled={disableDropDown === timesheetDisabled}
          onChange={handleSelectTimesheetGroup}
          list={timesheetGroups}
        />
        <TimeOffPageFooter
          primaryLabel={t('clear')}
          secondaryLabel={t('search')}
          footerClass={styles.footer}
          handleSecondaryButton={handleSearchButton}
          handlePrimaryButton={handleClearButton}
          shouldButtonDisable={disabledSearchButton}
        />
      </Box>
      <BottomBar />
    </div>
  );
}
