import IconButton from '@mui/material/IconButton';
import managerApproved from 'assets/img/managerApproved.svg';
import managerUnapprove from 'assets/img/managerUnapprove.svg';
import { useManagerSelectedTimesheet } from 'common/hooks';
import { TimesheetApproveUnapprovePopup } from 'components';
import { getEmployeeDetailsList } from 'pages/TimesheetManager/selectors';
import { timesheetAction } from 'pages/TimesheetManager/slice';
import { EmployeeDetail } from 'pages/TimesheetManager/types';
import { getTimesheetSearchResult } from 'pages/TimesheetSearchManager/slice';
import { TimesheetActions } from 'pages/dashboard/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

export default function ApprovedUnapprove() {
  const data = useSelector(getEmployeeDetailsList);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { empNo } = useManagerSelectedTimesheet();
  const [t] = useTranslation();
  const { approveStatus_Code: approveStatus } = data.find((item: EmployeeDetail) => item.empNo === empNo) || {};
  const actionButtonTitle = approveStatus ? t('unapprove') : t('approve');
  const headerTitle = approveStatus ? t('unapproveTimesheet') : t('approveTimesheet');
  const approvedTimesheetContent = approveStatus ? t('unapprovedTimsheetContent') : t('approvedTimsheetContent');

  const onManagerView = () => {
    setVisible(true);
  };

  const timesheetActionUpdate = () => {
    dispatch(timesheetAction({
      actionId: approveStatus ? TimesheetActions.UnApprove : TimesheetActions.Approved,
      listOfEmployeeNumbers: empNo,
    }));

    dispatch(getTimesheetSearchResult({}));
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleOk = () => {
    timesheetActionUpdate();
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <>
      <IconButton onClick={onManagerView}>
        <img
          alt="managerListView"
          src={approveStatus ? managerUnapprove : managerApproved}
        />

      </IconButton>
      <TimesheetApproveUnapprovePopup
        t={t}
        headerTitle={headerTitle}
        visible={visible}
        handleCancel={handleCancel}
        handleClose={handleClose}
        handleOk={handleOk}
        actionButtonTitle={actionButtonTitle}
        approvedTimesheetContent={approvedTimesheetContent}
      />
    </>
  );
}
