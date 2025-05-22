import { useState, useEffect } from 'react';
import { ListItem } from 'components/DropDown/types';
import { DropDownCondition, SelectedItem } from '../types';

interface Props {
    selectedEmployeeList: ListItem[];
    selectedTimesheetGroup: ListItem;
}

const useDisabledDropDown = ({ selectedEmployeeList, selectedTimesheetGroup }: Props) => {
  const {
    allEnabled, timesheetEnabled, timesheetDisabled, employeeDisabled,
  } = DropDownCondition;
  const [disableDropDown, setDisableDropDown] = useState(allEnabled);
  const { atleastOneItemSelected } = SelectedItem;

  useEffect(() => {
    if (selectedEmployeeList.length >= atleastOneItemSelected) {
      setDisableDropDown(timesheetDisabled);
    } else if (selectedTimesheetGroup === null) {
      setDisableDropDown(timesheetEnabled);
    } else if (selectedTimesheetGroup != null) {
      setDisableDropDown(employeeDisabled);
    }
  }, [selectedEmployeeList, selectedTimesheetGroup]);

  return {
    disableDropDown,
  };
};

export default useDisabledDropDown;
