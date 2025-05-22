import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Notes, TimeOffHeader } from 'components';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import BottomBar from 'layout/bottomBar/bottomBar';
import IconButton from '@mui/material/IconButton';
import { getPayPeriod, getTimesheetRole, getTimesheetUserCurrentRole } from 'pages/Timesheet/selectors';
import { UserRole } from 'common/types/types';
import AddNotes from './AddNotes';
import { getEmployeeNameForManagerNoteView, getNoteSuccess, getNotesDetailOfTimesheet } from './selector';
import { saveNoteValidationMessage, setNoteSuccess } from './slice';
import ManagerInformation from './ManagerInformation';
import styles from './TimesheetNotes.module.scss';

export default function TimesheetNotes() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const notesDetail = useSelector(getNotesDetailOfTimesheet);
  const noteSuccesfullySave = useSelector(getNoteSuccess);
  const userRole = useSelector(getTimesheetRole);
  const currentRole = useSelector(getTimesheetUserCurrentRole);
  const selectedTimePayPeriod = useSelector(getPayPeriod);
  const employeeName = useSelector(getEmployeeNameForManagerNoteView);
  const [notes, setNotes] = useState('');
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const hideRoleIcon = true;

  const closeDialog = () => {
    setOpenDialogBox(false);
  };

  const openDialog = () => {
    dispatch(saveNoteValidationMessage(''));
    setOpenDialogBox(true);
    setNotes('');
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value);
  };

  useEffect(() => {
    if (noteSuccesfullySave) {
      closeDialog();
      dispatch(setNoteSuccess(false));
    }
  }, [noteSuccesfullySave]);

  return (
    <div className={styles.container}>
      <TimeOffHeader
        currentUserRole={currentRole}
        hideRoleIcon={hideRoleIcon}
        userRole={userRole}
        formLabel={t('timesheetNotes')}
      />
      {
        currentRole === UserRole.Manager
        && (
          <ManagerInformation
            employeeName={employeeName}
            payPeriod={selectedTimePayPeriod?.description}
          />
        )
      }
      <Notes
        currentRole={currentRole}
        notesDetail={notesDetail}
      />
      <AddNotes
        notes={notes}
        handleOnChange={handleOnChange}
        openDialogBox={openDialogBox}
        closeDialog={closeDialog}
      />
      <IconButton
        sx={{
          position: 'fixed',
          bottom: '70px',
          right: '25px',
        }}
        onClick={openDialog}
      >
        <div
          className={styles.addNoteIconBackGround}
        >
          <NoteAddOutlinedIcon
            className={styles.addNoteIcon}
          />
        </div>
      </IconButton>
      <BottomBar />
    </div>
  );
}
