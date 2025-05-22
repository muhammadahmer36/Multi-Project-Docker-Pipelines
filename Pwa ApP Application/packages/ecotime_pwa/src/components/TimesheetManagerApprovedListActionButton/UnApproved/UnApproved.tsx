import IconButton from '@mui/material/IconButton';
import managerUnapprove from 'assets/img/managerUnapprove.svg';
import { useDispatch, useSelector } from 'react-redux';

import { getCheckedItems, getEmployeeDetailsList } from 'pages/TimesheetManager/selectors';
import { setVisibleUnApprovedConsent } from 'pages/TimesheetManager/slice';
import { EmployeeDetail } from 'pages/TimesheetManager/types';
import { useEffect, useRef, useState } from 'react';
import styles from './UnApproved.module.scss';

export default function Unapproved() {
  const dispatch = useDispatch();
  const checkedItems = useSelector(getCheckedItems);
  const data = useSelector(getEmployeeDetailsList);
  const [leastItemsChecked, setlestItemsChecked] = useState(true);
  const [allHaveSameStatus, setAllHaveSameStatus] = useState(true);
  const disabled = !(leastItemsChecked && allHaveSameStatus);
  const ref = useRef('');

  useEffect(() => {
    if (checkedItems.length > 0) {
      const isChecked = checkedItems.some((item: boolean) => item);
      if (isChecked) {
        setlestItemsChecked(true);
      } else {
        setlestItemsChecked(false);
      }
    }
  }, [checkedItems]);

  useEffect(() => {
    if (checkedItems.length > 0 && data.length > 0) {
      const checkedItemsIndex = checkedItems
        .map((item: boolean, index: number) => (item ? index : -1))
        .filter((index: number) => index !== -1);
      const selectedEmployee = data
        .filter((_: EmployeeDetail, index: number) => checkedItemsIndex.includes(index));
      const isAllEmployeeStatusAreSame = selectedEmployee
        .every((item: EmployeeDetail) => item.approveStatus_Code === true);
      if (isAllEmployeeStatusAreSame) {
        const isAllEmployeeIdString = selectedEmployee
          .map((item: EmployeeDetail) => item.empNo).join('|');
        ref.current = isAllEmployeeIdString;
        setAllHaveSameStatus(true);
      } else {
        setAllHaveSameStatus(false);
      }
    }
  }, [JSON.stringify(checkedItems), data]);

  const onUnApproved = () => {
    dispatch(setVisibleUnApprovedConsent(true));
  };

  return (
    <IconButton onClick={onUnApproved}>
      <img
        src={managerUnapprove}
        alt="managerUnapprove"
        style={{ opacity: disabled ? 0.5 : 1 }}
        className={styles.image}
      />
    </IconButton>
  );
}
