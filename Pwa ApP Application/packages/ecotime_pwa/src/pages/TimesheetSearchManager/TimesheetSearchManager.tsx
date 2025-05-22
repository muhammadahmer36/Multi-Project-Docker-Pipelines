import ButtonBase from '@mui/material/ButtonBase';
import { dropDownMinimumSearchLength, zeroRequestId } from 'appConstants';
import { primaryColor, white } from 'appConstants/colors';
import { getDropDownListLoader, getEmployeeListOfManager, getTimesheeGroups } from 'common/selectors/common';
import {
  getEmployeesOfManger,
  getTimesheetGroups, setDropDownLoader, setEmployeeList as setEmployeeListCommon,
} from 'common/slice/common';
import { DropDown, TimesheetHeader } from 'components';
import { ListItem } from 'components/DropDown/types';
import BottomBar from 'layout/bottomBar/bottomBar';
import { ResourceIds } from 'pages/dashboard/types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TimesheetManager.module.scss';
import {
  getPayPeriod,
  getPayPeriodDefault,
  getPayPeriodList,
  getSearchStatusList,
  getSelectedEmployeeGroup,
  getSelectedEmployeeList,
  getSelectedSearchStatusList,
} from './selectors';
import {
  getTimesheetSearchParam,
  getTimesheetSearchResult,
  setEmployeeList,
  setPayPeriod,
  setSelectSearchStatusList,
  setSelectSearchStatusListReset,
  setSelectedEmployeeGroup,
  setSelectedEmployeeList,
  setUnSelectSearchStatusList,
} from './slice';
import { SearchStatus } from './types';

export default function TimesheeMangaer() {
  const [t] = useTranslation();
  const payPeriodList = useSelector(getPayPeriodList);
  const payPeriod = useSelector(getPayPeriod);
  const statusList = useSelector(getSearchStatusList);
  const selectedStatusList = useSelector(getSelectedSearchStatusList);
  const timesheetGroupes = useSelector(getTimesheeGroups);
  const employeeList = useSelector(getEmployeeListOfManager);
  const selectedEmployeeGroup = useSelector(getSelectedEmployeeGroup);
  const selectedEmployeeList = useSelector(getSelectedEmployeeList);
  const dropDownListLoading = useSelector(getDropDownListLoader);
  const payPeriodDefault = useSelector(getPayPeriodDefault);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const searchDisabled = (() => {
    const autoCompeteSelected = (selectedEmployeeList.length === 0 ? selectedEmployeeGroup.code === '' : false);
    if ((selectedStatusList.length === 0
      || payPeriod.code === '' || autoCompeteSelected
    )) {
      return true;
    }

    return false;
  })();

  const disabledEmployeeNameAutoComplete = (() => {
    if (selectedEmployeeList.length === 0 && selectedEmployeeGroup.code === '') {
      return false;
    }
    if (selectedEmployeeGroup.code !== '') {
      return true;
    }
    return false;
  })();

  const disabledTimsheetGroupAutoComplete = (() => {
    if (selectedEmployeeList.length === 0 && selectedEmployeeGroup.code === '') {
      return false;
    }
    if (selectedEmployeeList.length > 0) {
      return true;
    }
    return false;
  })();

  useEffect(() => () => {
    dispatch(setEmployeeListCommon([]));
  }, []);

  const onChangePayCode = (value: string | undefined) => {
    if (value) {
      const selectedItem = payPeriodList.find((item: ListItem) => item.code === value);
      dispatch(setPayPeriod(selectedItem));
    } else {
      dispatch(setPayPeriod({ code: '', description: '' }));
    }
  };

  const handleClear = () => {
    dispatch(setSelectSearchStatusListReset());
    dispatch(setPayPeriod(payPeriodDefault));
    dispatch(setSelectedEmployeeList([]));
    dispatch(setSelectedEmployeeGroup({ code: '', description: '' }));
  };

  const handleSearch = () => {
    dispatch(getTimesheetSearchResult({ navigate }));
  };

  const onStatusClick = (id: number) => () => {
    if (selectedStatusList.includes(id)) {
      dispatch(setUnSelectSearchStatusList(id));
    } else {
      dispatch(setSelectSearchStatusList(id));
    }
  };

  const getEmployeeList = (searchParam: string) => {
    const getEmployeeListQueryParams = {
      resourceId: ResourceIds.TimeSheet.toString(),
      searchString: searchParam,
    };
    dispatch(getEmployeesOfManger(getEmployeeListQueryParams));
  };

  const getTimesheetSearchParamRes = (groupId: number) => {
    const getSearchParamQueryParams = {
      resourceId: ResourceIds.TimeSheet,
      groupId,
    };
    dispatch(getTimesheetSearchParam(getSearchParamQueryParams));
  };

  useEffect(() => {
    if (state === null) {
      getTimesheetSearchParamRes(timesheetGroupes[0]?.fldId || zeroRequestId);
    }
  }, [state]);

  useEffect(() => {
    dispatch(getTimesheetGroups(ResourceIds.TimeSheet.toString()));
  }, []);

  useEffect(() => {
    if (selectedEmployeeList.length > 1) {
      dispatch(setSelectedEmployeeGroup({ code: '', description: '' }));
    }
  }, [selectedEmployeeList]);

  const tagList = statusList.map(({ title, id }: SearchStatus) => {
    const isSelected = selectedStatusList.includes(id);

    const className = isSelected ? styles.selectedTagItem : styles.unSelectedTagItem;

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div key={id} className={className} onClick={onStatusClick(id)}>
        {title}
      </div>
    );
  });

  const handleMultiSelectEmployee = (seletedEmployees: ListItem[] | undefined) => {
    if (seletedEmployees && seletedEmployees.length > 0) {
      dispatch(setSelectedEmployeeList(seletedEmployees));
      dispatch(setSelectedEmployeeGroup({ code: '', description: '' }));
    } else {
      dispatch(setSelectedEmployeeList(seletedEmployees as []));
    }
  };

  const handleSelectTimesheetGroup = (value: string | undefined) => {
    if (value !== undefined) {
      const selectedItem = timesheetGroupes.find((item: ListItem) => item.code === value);
      dispatch(setSelectedEmployeeGroup(selectedItem));
      dispatch(setSelectedEmployeeList([]));
      getTimesheetSearchParamRes(selectedItem.fldId);
    } else {
      getTimesheetSearchParamRes(timesheetGroupes[0]?.fldId || zeroRequestId);
      dispatch(setSelectedEmployeeGroup({ code: '', description: '' }));
    }
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

  return (
    <div className={styles.timesheetContainer}>
      <TimesheetHeader />
      <div className={styles.timesheet}>
        <div className={styles.payPeriod}>
          <DropDown
            label={t('payPeriod')}
            error={false}
            onChange={onChangePayCode}
            list={payPeriodList}
            value={payPeriod}
          />

        </div>
        <div className={styles.tagLabelContainer}>
          {t('tags')}
        </div>
        <div className={styles.tagContainer}>
          {tagList}
        </div>
        <div className={styles.payPeriod}>
          <DropDown
            label={t('employeeName')}
            error={false}
            multiple
            disableCloseOnSelect
            multipeSelectonChange={handleMultiSelectEmployee}
            list={employeeList}
            loading={dropDownListLoading}
            readOnlyInput={false}
            value={selectedEmployeeList}
            disabled={disabledEmployeeNameAutoComplete}
            onChangeTextInput={handleOnChange}
          />
        </div>
        <div className={styles.payPeriod}>
          <DropDown
            label={t('timesheetGroup')}
            error={false}
            list={timesheetGroupes}
            onChange={handleSelectTimesheetGroup}
            value={selectedEmployeeGroup}
            disabled={disabledTimsheetGroupAutoComplete}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <ButtonBase
          sx={{
            height: '55px',
            width: '166px',
            borderRadius: '7px',
            border: `solid 2px ${primaryColor}`,
            color: primaryColor,
            fontSize: '18px',
            textTransform: 'none',
            marginRight: '10px',
            fontFamily: 'inherit',
          }}
          onClick={handleClear}
        >
          {t('clear')}
        </ButtonBase>
        <ButtonBase
          sx={{
            height: '55px',
            width: '166px',
            borderRadius: '7px',
            border: `solid 2px ${primaryColor}`,
            backgroundColor: primaryColor,
            fontSize: '18px',
            color: white,
            textTransform: 'none',
            opacity: searchDisabled ? 0.5 : 1,
            fontFamily: 'inherit',
          }}
          onClick={handleSearch}
          disabled={searchDisabled}
        >
          {t('search')}
        </ButtonBase>
      </div>
      <div className={styles.footer}>
        <BottomBar />
      </div>
    </div>
  );
}
