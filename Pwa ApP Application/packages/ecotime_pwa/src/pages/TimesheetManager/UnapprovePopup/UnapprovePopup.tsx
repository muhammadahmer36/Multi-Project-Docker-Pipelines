import { TimesheetApproveUnapprovePopup } from 'components';
import { TimesheetActions } from 'pages/dashboard/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getCheckedItems, getEmployeeDetailsList, getVisibleUnApprovedConsent } from '../selectors';
import { setVisibleUnApprovedConsent, timesheetAction } from '../slice';
import { EmployeeDetail } from '../types';

export default function Unapproved() {
  const [t] = useTranslation();
  const visible = useSelector(getVisibleUnApprovedConsent);
  const dispatch = useDispatch();
  const [listOfEmployeeNumbers, setListOfEmployeeNumbers] = useState('');
  const data = useSelector(getEmployeeDetailsList);
  const checkedItems = useSelector(getCheckedItems);

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
        setListOfEmployeeNumbers(isAllEmployeeIdString);
      }
    }
  }, [JSON.stringify(checkedItems), data]);

  const handleClose = () => {
    dispatch(setVisibleUnApprovedConsent(false));
  };

  const handleOk = () => {
    dispatch(timesheetAction({
      actionId: TimesheetActions.UnApprove,
      listOfEmployeeNumbers,
    }));
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <TimesheetApproveUnapprovePopup
      t={t}
      headerTitle={t('unapproveTimesheet')}
      visible={visible}
      handleCancel={handleCancel}
      handleClose={handleClose}
      handleOk={handleOk}
      actionButtonTitle={t('unapprove')}
      approvedTimesheetContent={t('unapprovedTimsheetContent')}
    />
  );
}
